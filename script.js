import { puzzles, wordImages } from './data.js';
document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const mistakesContainer = document.getElementById('mistakes-container');
    const shuffleButton = document.getElementById('shuffle-button');
    const submitButton = document.getElementById('submit-button');
    const deselectButton = document.getElementById('deselect-button');
    const messageToast = document.getElementById('message-toast');
    const solvedContainer = document.getElementById('solved-container');
    
    // Modal elements
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalResults = document.getElementById('modal-results');
    const playAgainButton = document.getElementById('play-again-button');

    // How to Play modal elements
    const howToPlayButton = document.getElementById('how-to-play-button');
    const howToPlayModal = document.getElementById('how-to-play-modal');
    const howToPlayCloseButton = document.getElementById('how-to-play-close-button');

    const colors = {
        0: { bg: 'bg-yellow-400', text: 'text-yellow-900', name: "Easy" },
        1: { bg: 'bg-green-500', text: 'text-green-900', name: "Medium" },
        2: { bg: 'bg-blue-400', text: 'text-blue-900', name: "Hard" },
        3: { bg: 'bg-purple-500', text: 'text-purple-900', name: "Tricky" },
    };

    let currentPuzzle;
    let words = [];
    let solution = {};
    let selectedWords = [];
    let mistakesRemaining;
    let solvedGroups = [];

    function initGame() {
        // Pick a random puzzle
        currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        words = [...currentPuzzle.words];
        solution = currentPuzzle.solution;
        
        selectedWords = [];
        solvedGroups = [];
        mistakesRemaining = 4;
        
        gridContainer.innerHTML = '';
        solvedContainer.innerHTML = '';
        modalOverlay.classList.remove('show');
        
        shuffleWords(words);
        createGrid();
        updateMistakes();
        updateSubmitButton();
    }

    function shuffleWords(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // script.js


function createGrid() {
    gridContainer.innerHTML = '';
    words.forEach(word => {
        if (!isWordSolved(word)) {
            const wordEl = document.createElement('div');
            wordEl.classList.add('grid-item', 'bg-zinc-800', 'has-image');
            wordEl.dataset.word = word;
            wordEl.addEventListener('click', () => toggleWordSelection(wordEl));

            const imgEl = document.createElement('img');
            // Use the word to look up the correct image URL
            imgEl.src = wordImages[word]; 
            imgEl.alt = word;
            imgEl.classList.add('tile-image');

            const textSpan = document.createElement('span');
            textSpan.classList.add('tile-text');
            textSpan.textContent = word;

            wordEl.appendChild(imgEl);
            wordEl.appendChild(textSpan);
            
            gridContainer.appendChild(wordEl);
        }
    });
}

    function isWordSolved(word) {
        return solvedGroups.some(group => group.words.includes(word));
    }

    function toggleWordSelection(wordEl) {
        const word = wordEl.dataset.word;
        if (selectedWords.includes(word)) {
            selectedWords = selectedWords.filter(w => w !== word);
            wordEl.classList.remove('selected');
        } else {
            if (selectedWords.length < 4) {
                selectedWords.push(word);
                wordEl.classList.add('selected');
            }
        }
        updateSubmitButton();
    }

    function updateSubmitButton() {
        submitButton.disabled = selectedWords.length !== 4;
    }

    function deselectAll() {
        // Clear the array of selected words
        selectedWords = [];
        // Find all elements with the 'selected' class and remove it
        const selectedElements = document.querySelectorAll('.grid-item.selected');
        selectedElements.forEach(el => el.classList.remove('selected'));
        // Update the submit button state
        updateSubmitButton();
    }

    function updateMistakes() {
        mistakesContainer.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const circle = document.createElement('div');
            circle.classList.add('w-5', 'h-5', 'rounded-full');
            if (i < mistakesRemaining) {
                circle.classList.add('bg-zinc-400');
            } else {
                circle.classList.add('bg-zinc-700');
            }
            mistakesContainer.appendChild(circle);
        }
    }
    
    function showMessage(text, duration = 2000) {
        messageToast.textContent = text;
        messageToast.classList.add('show');
        setTimeout(() => {
            messageToast.classList.remove('show');
        }, duration);
    }

    function handleSubmit() {
        if (selectedWords.length !== 4) return;

        let correctGroup = null;
        for (const groupName in solution) {
            const groupWords = solution[groupName];
            if (selectedWords.every(word => groupWords.includes(word)) && selectedWords.length === groupWords.length) {
                correctGroup = groupName;
                break;
            }
        }

        if (correctGroup) {
            handleCorrectGuess(correctGroup);
        } else {
            handleIncorrectGuess();
        }
    }
    
    function handleCorrectGuess(groupName) {
        const groupWords = solution[groupName];
        const colorIndex = Object.keys(solution).indexOf(groupName);

        solvedGroups.push({ name: groupName, words: groupWords });

        const groupEl = document.createElement('div');
        groupEl.classList.add('solved-group', colors[colorIndex].bg, colors[colorIndex].text);
        groupEl.innerHTML = `
            <p class="font-bold text-lg">${groupName}</p>
            <p class="font-medium">${groupWords.join(', ')}</p>
        `;
        solvedContainer.appendChild(groupEl);
        
        selectedWords = [];
        createGrid();
        updateSubmitButton();

        if (solvedGroups.length === 4) {
            setTimeout(() => endGame(true), 500);
        }
    }

    function handleIncorrectGuess() {
        mistakesRemaining--;
        updateMistakes();
        
        const selectedElements = document.querySelectorAll('.grid-item.selected');
        selectedElements.forEach(el => el.classList.add('shake'));
        setTimeout(() => {
             selectedElements.forEach(el => el.classList.remove('shake'));
        }, 400);

        if (mistakesRemaining === 0) {
            setTimeout(() => endGame(false), 500);
            return;
        }

        // Check for "One away"
        let isOneAway = false;
         for (const groupName in solution) {
            const groupWords = solution[groupName];
            const correctWordsInSelection = selectedWords.filter(word => groupWords.includes(word));
            if (correctWordsInSelection.length === 3) {
                isOneAway = true;
                break;
            }
        }
        
        if (isOneAway) {
            showMessage("One film away...");
        } else {
            showMessage("Not a correct group");
        }
    }

    function endGame(isWin) {
    modalTitle.textContent = isWin ? "Congratulations!" : "Next Time!";
    modalSubtitle.textContent = isWin ? "You found all the connections." : "You ran out of mistakes. The connections were:"; // Changed subtitle text
    modalResults.innerHTML = '';
    
    const groupOrder = Object.keys(solution);
    
    solvedGroups.forEach(group => {
        const colorIndex = groupOrder.indexOf(group.name);
        const resultEl = document.createElement('div');
        resultEl.classList.add('w-full', 'h-4', 'rounded-full', colors[colorIndex].bg);
        modalResults.appendChild(resultEl);
    });
    
    // Show remaining groups if player lost
    if (!isWin) {
        // Iterate through all solution groups
        groupOrder.forEach(groupName => {
            // Check if the group has not been solved yet
            if (!solvedGroups.some(sg => sg.name === groupName)) {
                const colorIndex = groupOrder.indexOf(groupName);
                
                const groupEl = document.createElement('div');
                groupEl.classList.add('solved-group', 'w-full', colors[colorIndex].bg, colors[colorIndex].text, 'text-sm');
                groupEl.style.opacity = 1; // Make solved groups instantly visible
                groupEl.style.transform = 'none'; // Prevent animation
                groupEl.innerHTML = `
                    <p class="font-bold">${groupName}</p>
                    <p class="font-medium">${solution[groupName].join(', ')}</p>
                `;
                modalResults.appendChild(groupEl);
            }
        });
    }
    
    modalOverlay.classList.add('show');
}


   shuffleButton.addEventListener('click', () => {
        shuffleWords(words);
        createGrid();
        selectedWords.forEach(word => {
            const wordEl = document.querySelector(`.grid-item[data-word="${word}"]`);
            if(wordEl) wordEl.classList.add('selected');
        });
    });

    submitButton.addEventListener('click', handleSubmit);
    playAgainButton.addEventListener('click', initGame);

    // Add the new event listener for the deselect button
    deselectButton.addEventListener('click', deselectAll);

        // Event listeners for How to Play modal
    howToPlayButton.addEventListener('click', () => {
        howToPlayModal.classList.add('show');
    });

    howToPlayCloseButton.addEventListener('click', () => {
        howToPlayModal.classList.remove('show');
    });

    howToPlayModal.addEventListener('click', (event) => {
        if (event.target === howToPlayModal) {
            howToPlayModal.classList.remove('show');
        }
    });

    // Initial game setup
    initGame();
});
