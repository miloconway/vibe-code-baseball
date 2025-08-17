import './style.css'

const searchItems = [
  'Baseballs',
  'Baseball Bats',
  'Baseball Mitts',
  'Baseball Caps',
  'Batting Helmets',
  'Batting Gloves',
  'Belts',
  'Wristbands',
  'Long Sleeves'
];

document.querySelector('#app').innerHTML = `
  <div class="game-container">
    <h1>Darn Dog's Penultimate Trading Card Game™ Set 01</h1>
    <p class="instructions">
      First: Look at your 9 baseball cards and write down the number of the following search items!<br>
      Next: If you have more than the other lineup, you score runs! The number of runs is equal to how many more of that item you have.
    </p>
    
    <div class="team-names">
      <div class="team-input">
        <label for="homeTeam">Home Team:</label>
        <input type="text" id="homeTeam" placeholder="Enter home team name" maxlength="20">
      </div>
      <div class="team-input">
        <label for="visitingTeam">Visiting Team:</label>
        <input type="text" id="visitingTeam" placeholder="Enter visiting team name" maxlength="20">
      </div>
    </div>
    
    <div class="scorecard">
      <table id="scoreTable">
        <thead>
          <tr>
            <th>Inning</th>
            <th>Search Item</th>
            <th id="homeTeamHeader">Home Team</th>
            <th id="visitingTeamHeader">Visiting Team</th>
          </tr>
        </thead>
        <tbody id="scoreBody">
        </tbody>
        <tfoot>
          <tr class="runs-row">
            <td colspan="2"><strong>Runs</strong></td>
            <td id="homeRuns">0</td>
            <td id="visitingRuns">0</td>
          </tr>
          <tr class="totals">
            <td colspan="2"><strong>Running Totals</strong></td>
            <td id="p1Total">0</td>
            <td id="p2Total">0</td>
          </tr>
        </tfoot>
      </table>
    </div>
    
    <div class="controls">
      <button id="resetGame">Reset Game</button>
      <button id="recordGame">Record Game</button>
    </div>
    
    <div class="history-section">
      <h2>Game History</h2>
      <div class="history-table-container">
        <table id="historyTable">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Home Team</th>
              <th>Home Runs</th>
              <th>Home Total</th>
              <th>Visiting Team</th>
              <th>Visiting Runs</th>
              <th>Visiting Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="historyBody">
          </tbody>
        </table>
        <div id="noHistory" class="no-history" style="display: none;">
          <p>No games recorded yet. Play a game and click "Record Game" to save it to history!</p>
        </div>
      </div>
    </div>
  </div>
`;

function createScoreRows() {
  const tbody = document.getElementById('scoreBody');

  searchItems.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item}</td>
      <td><input type="number" min="0" max="99" class="count-input" data-player="1" data-inning="${index}" value="0"></td>
      <td><input type="number" min="0" max="99" class="count-input" data-player="2" data-inning="${index}" value="0"></td>
    `;
    tbody.appendChild(row);
  });
}

function calculateTotals() {
  let p1Total = 0;
  let p2Total = 0;
  let homeRuns = 0;
  let visitingRuns = 0;

  searchItems.forEach((_, index) => {
    const p1Input = document.querySelector(`[data-player="1"][data-inning="${index}"]`);
    const p2Input = document.querySelector(`[data-player="2"][data-inning="${index}"]`);

    const p1Count = parseInt(p1Input.value) || 0;
    const p2Count = parseInt(p2Input.value) || 0;

    p1Total += p1Count;
    p2Total += p2Count;

    // Calculate runs: 1 run for whoever has the higher count in this inning
    if (p1Count > p2Count) {
      homeRuns += 1;
    } else if (p2Count > p1Count) {
      visitingRuns += 1;
    }
    // No runs awarded for ties
  });

  document.getElementById('p1Total').textContent = p1Total;
  document.getElementById('p2Total').textContent = p2Total;
  document.getElementById('homeRuns').textContent = homeRuns;
  document.getElementById('visitingRuns').textContent = visitingRuns;
}

function updateTeamHeaders() {
  const homeTeamName = document.getElementById('homeTeam').value || 'Home Team';
  const visitingTeamName = document.getElementById('visitingTeam').value || 'Visiting Team';

  document.getElementById('homeTeamHeader').textContent = homeTeamName;
  document.getElementById('visitingTeamHeader').textContent = visitingTeamName;
}

function saveGameState() {
  const gameState = {
    homeTeam: document.getElementById('homeTeam').value,
    visitingTeam: document.getElementById('visitingTeam').value,
    scores: []
  };

  // Save all the count inputs
  searchItems.forEach((_, index) => {
    const p1Input = document.querySelector(`[data-player="1"][data-inning="${index}"]`);
    const p2Input = document.querySelector(`[data-player="2"][data-inning="${index}"]`);

    gameState.scores.push({
      homeCount: parseInt(p1Input.value) || 0,
      visitingCount: parseInt(p2Input.value) || 0
    });
  });

  localStorage.setItem('vibeCodeBaseballGame', JSON.stringify(gameState));
}

function loadGameState() {
  const savedState = localStorage.getItem('vibeCodeBaseballGame');
  if (!savedState) return;

  try {
    const gameState = JSON.parse(savedState);

    // Restore team names
    if (gameState.homeTeam) {
      document.getElementById('homeTeam').value = gameState.homeTeam;
    }
    if (gameState.visitingTeam) {
      document.getElementById('visitingTeam').value = gameState.visitingTeam;
    }

    // Restore scores
    if (gameState.scores && gameState.scores.length === searchItems.length) {
      gameState.scores.forEach((score, index) => {
        const p1Input = document.querySelector(`[data-player="1"][data-inning="${index}"]`);
        const p2Input = document.querySelector(`[data-player="2"][data-inning="${index}"]`);

        if (p1Input) p1Input.value = score.homeCount;
        if (p2Input) p2Input.value = score.visitingCount;
      });
    }

    // Update headers and calculations
    updateTeamHeaders();
    calculateTotals();
  } catch (error) {
    console.log('Error loading saved game state:', error);
  }
}

function getGameHistory() {
  const history = localStorage.getItem('vibeCodeBaseballHistory');
  return history ? JSON.parse(history) : [];
}

function saveGameToHistory() {
  const currentGameState = {
    homeTeam: document.getElementById('homeTeam').value || 'Home Team',
    visitingTeam: document.getElementById('visitingTeam').value || 'Visiting Team',
    scores: [],
    timestamp: new Date().toISOString()
  };

  // Get current scores
  searchItems.forEach((_, index) => {
    const p1Input = document.querySelector(`[data-player="1"][data-inning="${index}"]`);
    const p2Input = document.querySelector(`[data-player="2"][data-inning="${index}"]`);

    currentGameState.scores.push({
      homeCount: parseInt(p1Input.value) || 0,
      visitingCount: parseInt(p2Input.value) || 0
    });
  });

  // Calculate final scores for the history entry
  let homeRuns = 0;
  let visitingRuns = 0;
  let homeTotalItems = 0;
  let visitingTotalItems = 0;

  currentGameState.scores.forEach(score => {
    homeTotalItems += score.homeCount;
    visitingTotalItems += score.visitingCount;

    if (score.homeCount > score.visitingCount) {
      homeRuns += 1;
    } else if (score.visitingCount > score.homeCount) {
      visitingRuns += 1;
    }
  });

  currentGameState.finalScore = {
    homeRuns,
    visitingRuns,
    homeTotalItems,
    visitingTotalItems
  };

  // Get existing history
  let history = getGameHistory();

  // Add new game to history
  history.push(currentGameState);

  // Sort by timestamp (newest first) and keep only the 10 most recent
  history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  history = history.slice(0, 10);

  // Save back to localStorage
  localStorage.setItem('vibeCodeBaseballHistory', JSON.stringify(history));

  // Refresh the history display
  displayGameHistory();

  return true;
}

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function loadGameFromHistory(gameIndex) {
  const history = getGameHistory();
  if (gameIndex < 0 || gameIndex >= history.length) return;

  const game = history[gameIndex];

  // Load team names
  document.getElementById('homeTeam').value = game.homeTeam;
  document.getElementById('visitingTeam').value = game.visitingTeam;

  // Load scores
  if (game.scores && game.scores.length === searchItems.length) {
    game.scores.forEach((score, index) => {
      const p1Input = document.querySelector(`[data-player="1"][data-inning="${index}"]`);
      const p2Input = document.querySelector(`[data-player="2"][data-inning="${index}"]`);

      if (p1Input) p1Input.value = score.homeCount;
      if (p2Input) p2Input.value = score.visitingCount;
    });
  }

  // Update display
  updateTeamHeaders();
  calculateTotals();
  saveGameState();
}

function eraseGameFromHistory(gameIndex) {
  const history = getGameHistory();
  if (gameIndex < 0 || gameIndex >= history.length) return;

  // Remove the game at the specified index
  history.splice(gameIndex, 1);

  // Save the updated history back to localStorage
  localStorage.setItem('vibeCodeBaseballHistory', JSON.stringify(history));

  // Refresh the history display
  displayGameHistory();
}

function displayGameHistory() {
  const history = getGameHistory();
  const historyBody = document.getElementById('historyBody');
  const noHistoryDiv = document.getElementById('noHistory');

  if (history.length === 0) {
    historyBody.innerHTML = '';
    noHistoryDiv.style.display = 'block';
    return;
  }

  noHistoryDiv.style.display = 'none';
  historyBody.innerHTML = '';

  history.forEach((game, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatDateTime(game.timestamp)}</td>
      <td>${game.homeTeam}</td>
      <td>${game.finalScore.homeRuns}</td>
      <td>${game.finalScore.homeTotalItems}</td>
      <td>${game.visitingTeam}</td>
      <td>${game.finalScore.visitingRuns}</td>
      <td>${game.finalScore.visitingTotalItems}</td>
      <td class="action-buttons">
        <button class="load-game-btn" data-game-index="${index}">Load Game</button>
        <button class="erase-game-btn" data-game-index="${index}">Erase Record</button>
      </td>
    `;
    historyBody.appendChild(row);
  });

  // Add event listeners to load game buttons
  document.querySelectorAll('.load-game-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const gameIndex = parseInt(e.target.dataset.gameIndex);
      loadGameFromHistory(gameIndex);
    });
  });

  // Add event listeners to erase game buttons
  document.querySelectorAll('.erase-game-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const gameIndex = parseInt(e.target.dataset.gameIndex);
      const history = getGameHistory();
      const game = history[gameIndex];

      // Confirm before erasing
      const confirmMessage = `Are you sure you want to erase the game between ${game.homeTeam} and ${game.visitingTeam} from ${formatDateTime(game.timestamp)}?`;
      if (confirm(confirmMessage)) {
        eraseGameFromHistory(gameIndex);
      }
    });
  });
}

function setupEventListeners() {
  // Add event listeners to all count inputs
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('count-input')) {
      calculateTotals();
      saveGameState();
    }
  });

  // Add event listeners for team name inputs
  document.getElementById('homeTeam').addEventListener('input', () => {
    updateTeamHeaders();
    saveGameState();
  });
  document.getElementById('visitingTeam').addEventListener('input', () => {
    updateTeamHeaders();
    saveGameState();
  });

  // Reset button - only reset scores, keep team names
  document.getElementById('resetGame').addEventListener('click', () => {
    document.querySelectorAll('.count-input').forEach(input => {
      input.value = 0;
    });
    calculateTotals();
    saveGameState();
  });

  // Record Game button - save current game to history
  document.getElementById('recordGame').addEventListener('click', () => {
    const success = saveGameToHistory();
    if (success) {
      // Show a brief confirmation (you could enhance this with a modal or toast)
      const button = document.getElementById('recordGame');
      const originalText = button.textContent;
      button.textContent = 'Game Recorded!';
      button.style.background = '#27ae60';

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);

      // Refresh the history display
      displayGameHistory();
    }
  });
}

// Initialize the game
createScoreRows();
setupEventListeners();
loadGameState(); // Load saved state if it exists
calculateTotals();
displayGameHistory(); // Display any existing game history
