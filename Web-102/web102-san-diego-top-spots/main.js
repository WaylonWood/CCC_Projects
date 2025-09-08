let map;
let markers = [];
let userLocation = null;
let allSpots = [];

const elements = {
    container: document.getElementById("topspots-container"),
    resultsCount: document.getElementById("resultsCount"),
    locationIndicator: document.getElementById("locationIndicator"),
    mapTooltip: document.getElementById("mapTooltip"),
    tooltipImage: document.getElementById("tooltipImage"),
    tooltipTitle: document.getElementById("tooltipTitle"),
    tooltipDescription: document.getElementById("tooltipDescription"),
    filters: document.querySelectorAll(".filter-option input[type='checkbox']")
};

const FILTER_KEYWORDS = {
    outdoor: ["park", "zoo", "safari", "hike", "trail", "surf", "beach", "outdoor", "run"],
    cultural: ["museum", "art", "tour", "historic", "culture", "mummies", "ghost", "gaslamp", "aquarium", "comic con", "convention"],
    food: ["food", "restaurant", "café", "beer", "brewery", "sangria", "grub", "dinner", "localvore"],
    free: ["$", "ticket", "admission", "pay", "cost"],
    family: ["family", "kid", "children", "zoo", "aquarium", "museum", "park", "safari"]
};

function initMap() {
    const defaultCenter = { lat: 32.7157, lng: -117.1611 };
    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultCenter,
        zoom: 10
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => handleUserLocation(pos),
            () => console.log("Geolocation unavailable or denied")
        );
    }

    if (allSpots.length) addMarkers(allSpots);
}
window.initMap = initMap;

function handleUserLocation(position) {
    userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    addUserMarker(userLocation);
    showLocationIndicator();
    updateDistancesAndRepopulate();
}

function showLocationIndicator() {
    if (!elements.locationIndicator) return;
    const indicator = elements.locationIndicator;

    indicator.style.display = "block";
    setTimeout(() => indicator.classList.add("show"), 10);

    setTimeout(() => {
        indicator.classList.remove("show");
        indicator.classList.add("hide");
        setTimeout(() => {
            indicator.style.display = "none";
            indicator.classList.remove("hide");
        }, 400);
    }, 3000);
}

function loadTopSpotsData() {
    fetch("data.json")
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            allSpots = data.map((spot, idx) => {
                const [lat, lng] = spot.location;
                return {
                    idx,
                    name: spot.name,
                    description: spot.description,
                    mapsLink: `https://www.google.com/maps?q=${lat},${lng}`,
                    lat,
                    lng,
                    distance: userLocation ? getDistance(userLocation.lat, userLocation.lng, lat, lng) : null
                };
            });

            if (userLocation) {
                allSpots.sort((a, b) => a.distance - b.distance);
            }

            populateTable(allSpots);
            setupFilters();
            if (map) addMarkers(allSpots);
        })
        .catch(error => {
            console.error("Error loading spots:", error);
            if (elements.container) {
                elements.container.innerHTML = `
                    <div class="loading-card">
                        <p>Error loading spots: ${error.message}</p>
                        <button onclick="loadTopSpotsData()" style="margin-top: 10px; padding: 8px 16px; background: #00aa6c; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Try Again
                        </button>
                    </div>`;
            }
        });
}
document.addEventListener("DOMContentLoaded", loadTopSpotsData);

function updateDistancesAndRepopulate() {
    if (!allSpots.length || !userLocation) return;
    allSpots.forEach(spot => {
        spot.distance = getDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng);
    });
    allSpots.sort((a, b) => a.distance - b.distance);
    applyFilters();
}

function addUserMarker(location) {
    new google.maps.Marker({
        position: location,
        map: map,
        title: "Your Location",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeWeight: 2
        }
    });
}

function setupFilters() {
    elements.filters.forEach(checkbox => {
        checkbox.addEventListener("change", applyFilters);
    });
}

function applyFilters() {
    const filters = {
        outdoor: document.getElementById("outdoor").checked,
        cultural: document.getElementById("cultural").checked,
        food: document.getElementById("food").checked,
        free: document.getElementById("free").checked,
        family: document.getElementById("family").checked
    };

    const hasFilters = Object.values(filters).some(Boolean);

    const filteredSpots = allSpots.filter(spot => {
        if (!hasFilters) return true;
        const text = (spot.description + " " + spot.name).toLowerCase();
        return Object.entries(filters).some(([key, checked]) => {
            if (!checked) return false;
            return key === "free"
                ? !FILTER_KEYWORDS.free.some(word => text.includes(word))
                : FILTER_KEYWORDS[key].some(word => text.includes(word));
        });
    });

    populateTable(filteredSpots);
    addMarkers(filteredSpots);
}

function populateTable(rows) {
    if (elements.resultsCount) {
        elements.resultsCount.textContent = `${rows.length} results`;
    }

    if (!elements.container) return;
    elements.container.innerHTML = "";

    rows.forEach(row => {
        const card = document.createElement("div");
        card.className = "listing-card";
        const activityIcon = getActivityIcon(row.description, row.name);

        const maxLength = 150;
        const isLong = row.description.length > maxLength;
        const shortDescription = isLong ? row.description.slice(0, maxLength) + "..." : row.description;

        card.innerHTML = `
            <div class="listing-image">${activityIcon}</div>
            <div class="listing-content">
                <div class="listing-header">
                    <h3 class="listing-title">${row.name}</h3>
                </div>
                <div class="description-container">
                    <p class="listing-description short" data-full="${row.description.replace(/"/g, '&quot;')}">${shortDescription}</p>
                    ${isLong ? '<button class="see-more-btn">See more</button>' : ''}
                </div>
                <div class="listing-actions">
                    <div class="listing-meta">
                        ${row.distance ? `<span class="distance-badge">${row.distance.toFixed(1)} miles away</span>` : ""}
                    </div>
                    <a href="${row.mapsLink}" target="_blank" class="map-link">View on Map</a>
                </div>
            </div>
        `;

        card.addEventListener("click", e => {
            if (e.target.classList.contains("map-link")) return;
            if (e.target.classList.contains("see-more-btn")) {
                e.stopPropagation();
                const btn = e.target;
                const desc = btn.parentElement.querySelector(".listing-description");
                const fullText = desc.getAttribute("data-full");
                if (btn.textContent === "See more") {
                    desc.textContent = fullText;
                    btn.textContent = "See less";
                    desc.classList.remove("short");
                } else {
                    desc.textContent = shortDescription;
                    btn.textContent = "See more";
                    desc.classList.add("short");
                }
                return;
            }

            map.panTo({ lat: row.lat, lng: row.lng });
            map.setZoom(15);
            google.maps.event.trigger(markers[row.idx], "click");
        });

        elements.container.appendChild(card);
    });

    populateHiddenTable(rows);
}

function populateHiddenTable(rows) {
    const tbody = document.getElementById("topspots-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    rows.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.name}</td>
            <td>${row.description}</td>
            <td><a href="${row.mapsLink}" target="_blank">View on Map</a></td>
        `;
        tbody.appendChild(tr);
    });
}

function addMarkers(rows) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    const bounds = new google.maps.LatLngBounds();

    rows.forEach(row => {
        const marker = new google.maps.Marker({
            position: { lat: row.lat, lng: row.lng },
            map,
            title: row.name
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<strong>${row.name}</strong><br>${row.description}`
        });

        const icon = getActivityIcon(row.description, row.name);

        marker.addListener("mouseover", e => showMapTooltip(e, row.name, row.description, icon));
        marker.addListener("mouseout", hideMapTooltip);
        marker.addListener("click", () => {
            hideMapTooltip();
            infoWindow.open(map, marker);
        });

        markers[row.idx] = marker;
        bounds.extend(marker.position);
    });

    if (rows.length > 0) {
        map.fitBounds(bounds);
        if (map.getZoom() > 13) map.setZoom(13);
    }
}

function getActivityIcon(text) {
    const text = (description + " " + name).toLowerCase();
    if (text.includes("zoo") || text.includes("animal") || text.includes("safari")) return "🦁";
    if (text.includes("beach") || text.includes("surf")) return "🏄‍♂️";
    if (text.includes("food") || text.includes("eat") || text.includes("restaurant") || text.includes("café")) return "🍽️";
    if (text.includes("hike") || text.includes("trail") || text.includes("park")) return "🥾";
    if (text.includes("museum") || text.includes("art")) return "🎨";
    if (text.includes("beer") || text.includes("brewery")) return "🍺";
    if (text.includes("tour") || text.includes("ghost")) return "👻";
    if (text.includes("aquarium") || text.includes("fish")) return "🐠";
    if (text.includes("comic") || text.includes("convention")) return "🦸‍♂️";
    if (text.includes("seaport") || text.includes("harbor")) return "⛵";
    return "🏛️";
}

function showMapTooltip(mouseEvent, title, description, icon) {
    if (!elements.mapTooltip) return;
    elements.tooltipImage.textContent = icon;
    elements.tooltipTitle.textContent = title;
    elements.tooltipDescription.textContent = description;

    const x = mouseEvent.domEvent.clientX;
    const y = mouseEvent.domEvent.clientY;

    elements.mapTooltip.style.left = `${Math.min(x + 15, window.innerWidth - 320)}px`;
    elements.mapTooltip.style.top = `${Math.max(y - 10, 10)}px`;
    elements.mapTooltip.classList.add("show");
}

function hideMapTooltip() {
    if (elements.mapTooltip) elements.mapTooltip.classList.remove("show");
}

// Calculates distance between two coordinates using the Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(value) {
    return value * Math.PI / 180;
}
