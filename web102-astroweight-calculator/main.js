// Write your JavaScript code here! 
var planets = [ 
    ['Pluto', 0.06], 
    ['Neptune', 1.148], 
    ['Uranus', 0.917], 
    ['Saturn', 1.139], 
    ['Jupiter', 2.640], 
    ['Mars', 0.3895], 
    ['Moon', 0.1655], 
    ['Earth', 1], 
    ['Venus', 0.9032], 
    ['Mercury', 0.377], 
    ['Sun', 27.9] 
];

// Keep track of custom planets
var customPlanets = [];

// STEP 1: Populate the dropdown menu
function populateDropdown() {
    let dropdown = document.getElementById('planets'); // Changed from 'planet-dropdown'
    let excludePluto = document.getElementById('exclude-pluto').checked;
    
    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">Select a planet</option>';
    
    // Filter planets based on Pluto checkbox
    let filteredPlanets = planets.filter(planet => {
        if (excludePluto && planet[0] === 'Pluto') {
            return false;
        }
        return true;
    });
    
    // Add original planets (reversed order)
    let reversedPlanets = filteredPlanets.slice().reverse();
    reversedPlanets.forEach(function(planet) {
        let option = document.createElement('option');
        option.value = planet[0];
        option.textContent = planet[0];
        dropdown.appendChild(option);
    });
    
    // Add custom planets
    customPlanets.forEach(function(planet) {
        let option = document.createElement('option');
        option.value = planet[0];
        option.textContent = planet[0] + ' (Custom)';
        dropdown.appendChild(option);
    });
}

// STEP 2: Calculate weight on selected planet
function calculateWeight(weight, planetName) { 
    // Check original planets first
    for (let i = 0; i < planets.length; i++) {
        if (planets[i][0] === planetName) {
            return parseFloat(weight) * planets[i][1];
        }
    }
    
    // Check custom planets
    for (let i = 0; i < customPlanets.length; i++) {
        if (customPlanets[i][0] === planetName) {
            return parseFloat(weight) * customPlanets[i][1];
        }
    }
    
    return null; // Planet not found
}

// STEP 3: Handle click events
function handleClickEvent(e) {
    let userWeight = document.getElementById('user-weight').value;
    let planetName = document.getElementById('planets').value;

    if (!userWeight || !planetName) {
        let resultDiv = document.getElementById('output'); 
        resultDiv.textContent = 'Please enter your weight and select a planet.';
        resultDiv.className = 'show';
        return;
    }

    let result = calculateWeight(userWeight, planetName);
    let resultDiv = document.getElementById('output'); 
    
    if (result === null) {
        resultDiv.textContent = 'Error: Planet not found.';
        resultDiv.className = 'show';
    } else {
        resultDiv.textContent = `If you were on ${planetName}, you would weigh ${result.toFixed(2)}lbs!`;
        resultDiv.className = 'show';
    }
}

// Modal functionality
function handleOpenModal(e) {
    document.getElementById('planet-modal').style.display = 'block';
}

function handleCloseModal(e) {
    document.getElementById('planet-modal').style.display = 'none';
    // Clear input fields when closing
    document.getElementById('custom-planet-name').value = '';
    document.getElementById('custom-planet-multiplier').value = '';
}

// Handle adding custom planets
function handleAddPlanet(e) {
    let planetName = document.getElementById('custom-planet-name').value.trim();
    let multiplier = document.getElementById('custom-planet-multiplier').value;
    
    if (!planetName || !multiplier) {
        alert('Please enter both planet name and gravity multiplier.');
        return;
    }
    
    if (isNaN(multiplier) || multiplier <= 0) {
        alert('Please enter a valid positive number for the gravity multiplier.');
        return;
    }
    
    // Check if planet already exists
    let planetExists = planets.some(planet => planet[0].toLowerCase() === planetName.toLowerCase()) ||
                     customPlanets.some(planet => planet[0].toLowerCase() === planetName.toLowerCase());
    
    if (planetExists) {
        alert('A planet with this name already exists.');
        return;
    }
    
    // Add to custom planets array
    customPlanets.push([planetName, parseFloat(multiplier)]);
    
    // Clear input fields and close modal
    document.getElementById('custom-planet-name').value = '';
    document.getElementById('custom-planet-multiplier').value = '';
    document.getElementById('planet-modal').style.display = 'none';
    
    // Refresh dropdown
    populateDropdown();
    
    alert(`${planetName} has been added successfully!`);
}

// Initialize the application
window.addEventListener('DOMContentLoaded', function() {
    // Populate dropdown on page load
    populateDropdown();
    
    // Add event listeners
    document.getElementById('calculate-button').addEventListener('click', handleClickEvent);
    document.getElementById('add-planet-button').addEventListener('click', handleAddPlanet);
    document.getElementById('open-modal-button').addEventListener('click', handleOpenModal);
    
    // Modal close events
    document.querySelector('.close').addEventListener('click', handleCloseModal);
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('planet-modal')) {
            handleCloseModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            handleCloseModal();
        }
    });
    
    // Refresh dropdown when Pluto checkbox changes
    document.getElementById('exclude-pluto').addEventListener('change', populateDropdown);
});