import TopSpot from "./TopSpot";

const TopSpots = ({ spots }) => {
    return (
        <div data-testid="topspots" className="top-spots-grid">
            {spots.map((topspot, index) => (
                <TopSpot 
                    key={index}
                    name={topspot.name}
                    description={topspot.description}
                    location={topspot.location}
                />
            ))}
        </div>
    );
};

export default TopSpots;
