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
    
    <div class="scorecard">
      <table id="scoreTable">
        <thead>
          <tr>
            <th>Inning</th>
            <th>Search Item</th>
            <th>Player 1 Count</th>
            <th>Player 2 Count</th>
            <th>Runs</th>
          </tr>
        </thead>
        <tbody id="scoreBody">
        </tbody>
        <tfoot>
          <tr class="totals">
            <td colspan="2"><strong>TOTALS</strong></td>
            <td id="p1Total">0</td>
            <td id="p2Total">0</td>
            <td id="runsTotal">0</td>
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
      <td class="runs-cell" id="runs-${index}">0</td>
    `;
    tbody.appendChild(row);
  });
}

function calculateRuns() {
  let p1Total = 0;
  let p2Total = 0;
  let totalRuns = 0;

  searchItems.forEach((_, index) => {
    const p1Input = document.querySelector(`[data-player="1"][data-inning="${index}"]`);
    const p2Input = document.querySelector(`[data-player="2"][data-inning="${index}"]`);

    const p1Count = parseInt(p1Input.value) || 0;
    const p2Count = parseInt(p2Input.value) || 0;

    p1Total += p1Count;
    p2Total += p2Count;

    // Calculate runs for this inning (difference if player 1 wins, 0 if player 2 wins or tie)
    const runs = Math.max(0, p1Count - p2Count);
    totalRuns += runs;

    document.getElementById(`runs-${index}`).textContent = runs;
  });

  document.getElementById('p1Total').textContent = p1Total;
  document.getElementById('p2Total').textContent = p2Total;
  document.getElementById('runsTotal').textContent = totalRuns;
}

function setupEventListeners() {
  // Add event listeners to all count inputs
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('count-input')) {
      calculateRuns();
    }
  });

  // Reset button
  document.getElementById('resetGame').addEventListener('click', () => {
    document.querySelectorAll('.count-input').forEach(input => {
      input.value = 0;
    });
    calculateRuns();
  });
}

// Initialize the game
createScoreRows();
setupEventListeners();
calculateRuns();
