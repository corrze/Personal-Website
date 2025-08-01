const cards = [
  {
    id: "school",
    title: "School",
    short: "Explore my journey at UW Seattle...",
    long: "Here's a detailed look at my academic journey — courses like Data Structures, ML, Systems, and more!"
  },
  {
    id: "corrbot",
    title: "CorrBot",
    short: "Building my own LLM",
    long: "This project fine-tuned a personalized chatbot on my own messages using LLaMA 3 and QLoRA."
  },
  {
    id: "thinkeval",
    title: "ThinkEval",
    short: "NYT Connections Game research",
    long: "This benchmark evaluated reasoning capabilities using daily puzzles and transformer models."
  },
  {
    id: "studemon",
    title: "Studemon",
    short: "Gamified flashcards",
    long: "Built a flashcard app with Pygame where you battle using quiz knowledge — inspired by Pokémon."
  },
  {
    id: "artdev",
    title: "Art and Game Dev",
    short: "Explore how my hobbies go hand in hand",
    long: "I create both 2D/3D art and turn them into game assets and UI mockups for indie game projects"
  },
  {
    id: "editing",
    title: "Video Editing",
    short: "WIP...",
    long: "This section is under construction but will feature my Premiere Pro projects."
  },
];

function JourneyCard({ title, short, onOpen }) {
  return (
    <div className="interest-card" onClick={onOpen}>
      <h3>{title}</h3>
      <p>{short}</p>
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
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
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

function JourneyApp() {
  const [openCardId, setOpenCardId] = React.useState(null);
  const selectedCard = cards.find((c) => c.id === openCardId);

  return (
    <div className="hero">
      <p className="journey">Welcome Traveler</p>
      <h2>What journey shall we embark on?</h2>

      <div className="interest-list">
        {cards.map((card) => (
          <JourneyCard
            key={card.id}
            title={card.title}
            short={card.short}
            long={card.long}
            onOpen={() => setOpenCardId(card.id)}
          />
        ))}
      </div>

      {selectedCard && (
        <Modal
          title={selectedCard.title}
          long={selectedCard.long}
          onClose={() => setOpenCardId(null)}
        />
      )}
    </div>
  );
}

// Mount React
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<JourneyApp />);
