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

function setupEventListeners() {
  // Add event listeners to all count inputs
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('count-input')) {
      calculateTotals();
    }
  });

  // Add event listeners for team name inputs
  document.getElementById('homeTeam').addEventListener('input', updateTeamHeaders);
  document.getElementById('visitingTeam').addEventListener('input', updateTeamHeaders);

  // Reset button
  document.getElementById('resetGame').addEventListener('click', () => {
    document.querySelectorAll('.count-input').forEach(input => {
      input.value = 0;
    });
    document.getElementById('homeTeam').value = '';
    document.getElementById('visitingTeam').value = '';
    updateTeamHeaders();
    calculateTotals();
  });
}

// Initialize the game
createScoreRows();
setupEventListeners();
calculateTotals();
