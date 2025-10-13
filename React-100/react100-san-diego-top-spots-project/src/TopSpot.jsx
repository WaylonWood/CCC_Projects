const TopSpot = ({ name, description, location }) => {
    // Create Google Maps URL from latitude and longitude
    const googleMapsUrl = `https://maps.google.com/?q=${location[0]},${location[1]}`;

    return (
        <div data-testid="topspot" className="card top-spot-card">
            <div className="card-body">
                <h4 className="card-title spot-title">{name}</h4>
                <p className="card-text spot-description">{description}</p>
                <a 
                    href={googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn maps-button"
                >
                    View on Google Maps
                </a>
            </div>
        </div>
    );
};

export default TopSpot;