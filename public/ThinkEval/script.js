import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

const resultOverlay = document.getElementById("result-overlay");
const resultIcon = document.getElementById("result-icon");

const firebaseConfig = {
  apiKey: "AIzaSyBwGgvtyEzA_SvpFnTf867yP1WTZReDcdI",
  authDomain: "thinkeval.firebaseapp.com",
  projectId: "thinkeval",
  storageBucket: "thinkeval.appspot.com",
  messagingSenderId: "348522791964",
  appId: "1:348522791964:web:e53e677e9eb550a3b74bd9",
  measurementId: "G-ELDBL548WP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const generate = document.getElementById("generate")
const board = document.getElementById("board")
const send = document.getElementById("send")
const good = document.getElementById("good")
const bad = document.getElementById("bad")

// Custom puzzle creator elements
const previewPuzzle = document.getElementById("preview-puzzle")
const playCustom = document.getElementById("play-custom")
const sharePuzzle = document.getElementById("share-puzzle")
const clearForm = document.getElementById("clear-form")
const previewBoard = document.getElementById("preview-board")

let selected = []
let game = []
let gameID = -1
let method = ""
let customPuzzle = null
let isPlayingCustom = false

// Check for shared puzzle on page load
window.addEventListener('DOMContentLoaded', () => {
    checkForSharedPuzzle();
});

generate.addEventListener("click", async () => {
    board.innerHTML = "";
    selected = []

    const response = await fetch("exp.json")
    const games = await response.json()

    game = games[Math.floor(Math.random() * games.length)];

    loadGame(game)
    good.disabled = false
    bad.disabled = false

    const message = document.getElementById("message");
    message.textContent = "Select 4 words that belong to the same category";
    message.className = "message";

    hideResultOverlay();
})

send.addEventListener("click", async () => {
    if (selected.length == 4) {
        let highest = 0
        const selectedWords = selected.map(tile => tile.textContent);
        const message = document.getElementById("message")
        for (const category in game) {
            if (category == "id" || category == "method") {
              continue
            }
            let currGroupings = 0
            for (const word of game[category]) {
                if (selectedWords.includes(word)) {
                    currGroupings++;
                }
            }
            highest = Math.max(highest, currGroupings)

            if (currGroupings == 4) {
                selected.forEach(tile => {
                    tile.classList.remove("selected");
                    tile.classList.add("correct");
                  });
                  selected = [];
                  
                  message.textContent = `Correct! Category: ${category}`
                  message.className = "message success";

                  showSuccessOverlay();
                  createConfetti();

                  return;
            }
        }
        message.textContent = `You were ${4 - highest} word(s) away.`
        message.className = "message error";
        showErrorOverlay();
    }
})

good.addEventListener("click", async () => {
    const modelRef = doc(db, "PuzzleEvaluation", String(gameID));
    const modelSnap = await getDoc(modelRef);

    let goodCount = 0
    let totalCount = 0
    if (modelSnap.exists()) {
      const data = modelSnap.data()
      goodCount = data.good || 0;
      totalCount = data.total || 0
    } else {
      await setDoc(modelRef, { good: 0, total: 0, method: method});
    }
  
    await updateDoc(modelRef, {
      good: goodCount + 1,
      total: totalCount + 1,
    });

    good.disabled = true
    bad.disabled = true
  
  });


bad.addEventListener("click", async () => {
  const modelRef = doc(db, "PuzzleEvaluation", String(gameID));
  const modelSnap = await getDoc(modelRef);

  let totalCount = 0
  if (modelSnap.exists()) {
    const data = modelSnap.data()
    totalCount = data.total || 0
  } else {
    await setDoc(modelRef, { good: 0, total: 0, method: method});
  }

  await updateDoc(modelRef, {
    total: totalCount + 1,
  });

  good.disabled = true
  bad.disabled = true

});

function loadGame(game) {
    let randomized = [];
    for (const category in game) {
      if (category == "id") {
        gameID = game[category]
      }
      else if (category == "method") {
        method = game["method"]
      }
      else {
        randomized.push(...game[category])
      }
    }
    randomized = shuffle(randomized);

    for (const word of randomized) {
        const tile = document.createElement("div")
        tile.className = 'word-tile-game'
        tile.textContent = word
        tile.onclick = () => {
            toggleSelection(tile)
        }
        board.appendChild(tile)
    }
    
    const message = document.getElementById("message");
    message.className = "message";
    message.textContent = "Select 4 words that belong to the same category";
  
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function toggleSelection(tile) {
    if (!tile.classList.contains("selected") && selected.length < 4) {
        tile.classList.add("selected");
        selected.push(tile);
    } else if (tile.classList.contains("selected")) {
        tile.classList.remove("selected");
        selected = selected.filter(t => t !== tile);
    }
}

function showSuccessOverlay() {
  resultIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
  resultIcon.className = "result-icon success";
  resultOverlay.className = "result-overlay success visible";

  setTimeout(() => {
      hideResultOverlay();
  }, 1500);
}

function showErrorOverlay() {
  resultIcon.innerHTML = '<i class="fas fa-times"></i>';
  resultIcon.className = "result-icon error";
  resultOverlay.className = "result-overlay error visible";
  
  setTimeout(() => {
      hideResultOverlay();
  }, 1500);
}

function hideResultOverlay() {
    resultOverlay.className = "result-overlay";
}

function createConfetti() {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const container = document.querySelector('body');

  for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      

      const size = Math.random() * 10 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = color;
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.top = `-20px`;
      
      container.appendChild(confetti);
      

      const animation = confetti.animate(
          [
              { 
                  transform: `translate(0, 0) rotate(0deg)`,
                  opacity: 1
              },
              { 
                  transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 500 + 500}px) rotate(${Math.random() * 360}deg)`,
                  opacity: 0
              }
          ],
          {
              duration: Math.random() * 2000 + 1500,
              easing: 'cubic-bezier(0.1, 0.8, 0.9, 0.2)'
          }
      );
      

      animation.onfinish = () => {
          confetti.remove();
      };
  }
}

// Custom Puzzle Creator Functions
previewPuzzle.addEventListener("click", () => {
    const puzzle = createCustomPuzzle();
    if (puzzle) {
        customPuzzle = puzzle;
        updatePreview(puzzle);
        playCustom.disabled = false;
        sharePuzzle.disabled = false;
    }
});

sharePuzzle.addEventListener("click", () => {
    generateShareableLink();
});

playCustom.addEventListener("click", () => {
    if (customPuzzle) {
        isPlayingCustom = true;
        board.innerHTML = "";
        selected = [];
        game = customPuzzle;
        gameID = -1; // Custom puzzles don't have IDs
        method = "custom";
        
        loadGame(customPuzzle);
        good.disabled = true; // Disable rating for custom puzzles
        bad.disabled = true;
        
        const message = document.getElementById("message");
        message.textContent = "Playing your custom puzzle! Select 4 words that belong to the same category";
        message.className = "message";
        
        hideResultOverlay();
        
        // Scroll to the game board
        document.getElementById("board").scrollIntoView({ behavior: 'smooth' });
    }
});

clearForm.addEventListener("click", () => {
    // Clear all input fields
    document.getElementById("blue-words").value = "";
    document.getElementById("blue-description").value = "";
    document.getElementById("green-words").value = "";
    document.getElementById("green-description").value = "";
    document.getElementById("yellow-words").value = "";
    document.getElementById("yellow-description").value = "";
    document.getElementById("purple-words").value = "";
    document.getElementById("purple-description").value = "";
    document.getElementById("puzzle-title").value = "";
    document.getElementById("puzzle-author").value = "";
    
    // Clear preview
    previewBoard.innerHTML = "";
    for (let i = 0; i < 16; i++) {
        const tile = document.createElement("div");
        tile.className = "preview-tile";
        tile.textContent = "";
        previewBoard.appendChild(tile);
    }
    
    playCustom.disabled = true;
    sharePuzzle.disabled = true;
    customPuzzle = null;
});

function createCustomPuzzle() {
    const blueWords = document.getElementById("blue-words").value.trim();
    const blueDesc = document.getElementById("blue-description").value.trim();
    const greenWords = document.getElementById("green-words").value.trim();
    const greenDesc = document.getElementById("green-description").value.trim();
    const yellowWords = document.getElementById("yellow-words").value.trim();
    const yellowDesc = document.getElementById("yellow-description").value.trim();
    const purpleWords = document.getElementById("purple-words").value.trim();
    const purpleDesc = document.getElementById("purple-description").value.trim();
    
    // Validate that all fields are filled
    if (!blueWords || !blueDesc || !greenWords || !greenDesc || 
        !yellowWords || !yellowDesc || !purpleWords || !purpleDesc) {
        alert("Please fill in all category fields before creating the puzzle.");
        return null;
    }
    
    // Parse and validate words
    const blue = blueWords.split(",").map(w => w.trim()).filter(w => w.length > 0);
    const green = greenWords.split(",").map(w => w.trim()).filter(w => w.length > 0);
    const yellow = yellowWords.split(",").map(w => w.trim()).filter(w => w.length > 0);
    const purple = purpleWords.split(",").map(w => w.trim()).filter(w => w.length > 0);
    
    // Validate that each category has exactly 4 words
    if (blue.length !== 4 || green.length !== 4 || yellow.length !== 4 || purple.length !== 4) {
        alert("Each category must have exactly 4 words separated by commas.");
        return null;
    }
    
    // Check for duplicate words across categories
    const allWords = [...blue, ...green, ...yellow, ...purple];
    const uniqueWords = new Set(allWords.map(w => w.toLowerCase()));
    if (uniqueWords.size !== 16) {
        alert("All 16 words must be unique (case-insensitive).");
        return null;
    }
    
    return {
        [blueDesc]: blue,
        [greenDesc]: green,
        [yellowDesc]: yellow,
        [purpleDesc]: purple,
        id: "custom",
        method: "custom"
    };
}

function updatePreview(puzzle) {
    previewBoard.innerHTML = "";
    
    let allWords = [];
    for (const category in puzzle) {
        if (category !== "id" && category !== "method") {
            allWords.push(...puzzle[category]);
        }
    }
    
    // Shuffle words for preview
    allWords = shuffle([...allWords]);
    
    for (let i = 0; i < 16; i++) {
        const tile = document.createElement("div");
        tile.className = "preview-tile filled";
        tile.textContent = allWords[i] || "";
        previewBoard.appendChild(tile);
    }
}

// Initialize preview grid with empty tiles
function initializePreview() {
    for (let i = 0; i < 16; i++) {
        const tile = document.createElement("div");
        tile.className = "preview-tile";
        tile.textContent = "";
        previewBoard.appendChild(tile);
    }
}

// Initialize preview on page load
initializePreview();

// URL Sharing Functions
function encodeCustomPuzzle(puzzle) {
    const puzzleData = {
        categories: [],
        title: document.getElementById("puzzle-title").value.trim() || "Custom Puzzle",
        author: document.getElementById("puzzle-author").value.trim() || "Anonymous"
    };
    
    for (const category in puzzle) {
        if (category !== "id" && category !== "method") {
            puzzleData.categories.push({
                name: category,
                words: puzzle[category]
            });
        }
    }
    
    const jsonString = JSON.stringify(puzzleData);
    return btoa(encodeURIComponent(jsonString));
}

function decodeCustomPuzzle(encodedData) {
    try {
        const jsonString = decodeURIComponent(atob(encodedData));
        const puzzleData = JSON.parse(jsonString);
        
        const puzzle = {
            id: "shared",
            method: "shared"
        };
        
        puzzleData.categories.forEach(category => {
            puzzle[category.name] = category.words;
        });
        
        return {
            puzzle: puzzle,
            title: puzzleData.title,
            author: puzzleData.author
        };
    } catch (error) {
        console.error("Error decoding puzzle:", error);
        return null;
    }
}

function checkForSharedPuzzle() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedPuzzle = urlParams.get('puzzle');
    
    if (sharedPuzzle) {
        const decodedData = decodeCustomPuzzle(sharedPuzzle);
        if (decodedData) {
            // Load the shared puzzle
            customPuzzle = decodedData.puzzle;
            
            // Show a message about the shared puzzle
            const message = document.getElementById("message");
            message.textContent = `Playing "${decodedData.title}" by ${decodedData.author}`;
            message.className = "message";
            
            // Auto-play the shared puzzle
            isPlayingCustom = true;
            board.innerHTML = "";
            selected = [];
            game = customPuzzle;
            gameID = -1;
            method = "shared";
            
            loadGame(customPuzzle);
            good.disabled = true;
            bad.disabled = true;
            
            hideResultOverlay();
            
            // Scroll to the game board
            setTimeout(() => {
                document.getElementById("board").scrollIntoView({ behavior: 'smooth' });
            }, 500);
        } else {
            alert("Invalid puzzle link. Please check the URL and try again.");
        }
    }
}

function generateShareableLink() {
    if (!customPuzzle) {
        alert("Please create a puzzle first before generating a shareable link.");
        return;
    }
    
    const encodedPuzzle = encodeCustomPuzzle(customPuzzle);
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?puzzle=${encodedPuzzle}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
        // Show success message
        const shareButton = document.getElementById("share-puzzle");
        const originalText = shareButton.textContent;
        shareButton.textContent = "Link Copied!";
        shareButton.style.backgroundColor = "#10b981";
        
        setTimeout(() => {
            shareButton.textContent = originalText;
            shareButton.style.backgroundColor = "";
        }, 2000);
    }).catch(err => {
        // Fallback: show the URL in a prompt
        prompt("Copy this link to share your puzzle:", shareUrl);
    });
}
