// Global planet variable
let planets = [];

function Train({ isVisible, planetColor }) {
  return (
    <div className={`train-container ${isVisible ? 'visible' : ''}`}>
      <div className="train">
        <div className="train-engine" style={{ borderColor: planetColor }}>
          <div className="train-window"></div>
          <div className="train-smokestack">
            <div className="smoke"></div>
            <div className="smoke"></div>
            <div className="smoke"></div>
          </div>
        </div>

        <div className="train-car" style={{ borderColor: planetColor }}>
          <div className="train-wheel"></div>
          <div className="train-wheel"></div>
        </div>
        <div className="train-car" style={{ borderColor: planetColor }}>
          <div className="train-wheel"></div>
          <div className="train-wheel"></div>
        </div>

        <div className="train-tracks">
          <div className="track-line"></div>
          <div className="track-line"></div>
        </div>
      </div>
    </div>
  );
}

function Planet({ planet, isActive, onClick}) {
  return (
    <div
      className={`planet ${isActive ? 'active' : ''}`}
      onClick = {onClick}
      style = {{
        background: `radial-gradient(circle at 30% 30%, ${planet.color}aa, ${planet.color}22)`,
        boxShadow: `0 0 20px ${planet.color}44, inset 0 0 20px ${planet.color}22`
      }}
    >
      <div className="planet-glow" style={{ backgroundColor: planet.color}}></div>
      <div className="planet-surface">
        <div className="crater crater-1"></div>
        <div className="crater crater-2"></div>
        <div className="crater crater-3"></div>
      </div>
    </div>
  );
}

function Modal({ title, long, onClose }) {
  const [isClosing, setIsClosing] = React.useState(false);

  const handleClose = () => {
    setIsClosing(true); // animation start
    setTimeout(() => {
      onClose(); // closes modal after animation
    }, 300); // animation duration
  };

  // Close modal when pressing Escape key
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    //Prevent body scroll
    document.body.classList.add('modal-open');


    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Create portal to render modal at document.body level
  return ReactDOM.createPortal(
    <div className={`modal ${isClosing ? "fade-out" : ""}`} onClick={handleClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close" onClick={handleClose}>&times;</span>
        <h2>{title}</h2>
        <p>{long}</p>
      </div>
    </div>,
    document.body
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p className="loading-text">Loading planetary data...</p>
    </div>
  )
}

function ErrorScreen({ onRetry }) {
  return (
    <div className="error-screen">
      <h2>Failed to Load Planets</h2>
      <p>There was an error loading the planetary data.</p>
      <button className="retry-btn" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}

function TrainJourney() {
  const [currentPlanetIndex, setCurrentPlanetIndex] = React.useState(0);
  const [isTrainVisible, setIsTrainVisible] = React.useState(false);
  const [selectedPlanet, setSelectedPlanet] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [planetsData, setPlanetsData] = React.useState([]);

  // Loading data from json
  const loadPlanets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch('./planets.json');
      if (!res.ok) {
        throw new Error(`HTTP error... Status: ${res.status}`);
      }

      const data = await res.json();
      planets = data.planets; // Global var set
      setPlanetsData(data.planets);

      // Train animation
      setTimeout(() => {
        setIsTrainVisible(true);
      }, 500);

    } catch (err) {
      console.error('Error loading planets:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadPlanets();
  }, []);

  const currentPlanet = planetsData[currentPlanetIndex];

  const goToPlanet = (index) => {
    if (index !== currentPlanetIndex) {
      setIsTrainVisible(false);
      setTimeout(() => {
        setCurrentPlanetIndex(index);
        setIsTrainVisible(true);
      }, 500);
    }
  };

  const nextPlanet = () => {
    const nextIndex = (currentPlanetIndex + 1) % planetsData.length;
    goToPlanet(nextIndex);
  };

  const prevPlanet = () => {
    const prevIndex = (currentPlanetIndex - 1 + planetsData.length) % planetsData.length;
    goToPlanet(prevIndex);
  };

  if (isLoading) {
    return (
      <div className="hero">
        <LoadingScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero">
        <ErrorScreen onRetry={loadPlanets} />
      </div>
    );
  }

  // No planets loaded
  if (!planetsData.length || !currentPlanet) {
    return (
      <div className="hero">
        <div className="error-screen">
          <h2> No Planets Found</h2>
          <p> Unable to load planetary data.</p>
          <button className="retry-btn" onClick={loadPlanets}>
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hero">
      <div className="train-journey">
        <div className="planet-title-section">
          <h1 className="planet-name">{currentPlanet.name}</h1>
          <h2 className="journey-subtitle">{currentPlanet.title}</h2>
          <p className="planet-description">{currentPlanet.description}</p>
        </div>

        <div className="journey-scene">
          <Train isVisible={isTrainVisible} planetColor={currentPlanet.color} />

          <div className="planet-selector">
            {planetsData.map((planet, index) => (
              <Planet
                key={planet.id}
                planet={planet}
                isActive={index === currentPlanetIndex}
                onClick={() => goToPlanet(index)}
              />
            ))}
          </div>
        </div>
        
        <div className="journey-controls">
          <button className="nav-btn prev" onClick={prevPlanet}>
            ← Previous Planet
          </button>
          <button
            className="explore-btn"
            onClick={() => setSelectedPlanet(currentPlanet)}
          >
            Explore This Planet
          </button>
          <button className="nav-btn next" onClick={nextPlanet}>
            Next Planet →
          </button>
        </div>
      </div>

        {selectedPlanet && (
          <Modal
            title={selectedPlanet.title}
            long={selectedPlanet.long}
            onClose={() => setSelectedPlanet(null)}
          />
        )}
    </div>
  );
}

// Mount React
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<TrainJourney />);
