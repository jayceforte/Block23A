// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2410-ftb-et-web-am";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    // TODO
    const response = await fetch(API_URL)
    const data = await response.json();
    renderAllPlayers(data)
    if (data.data.players){
      return data.data.players;
    }
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/${playerID}`)
    const data = await response.json()
    console.log(data);
    if (data.player) {
      return data.player
    }
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    // TODO
    const response = await fetch (`${API_URL}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(playerObj)
    });
    if (!response.ok){
      throw new Error(`Could not add new player. Status: ${response.status}`)
    }

    const data = await response.json();
    return data.player;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: "DELETE"
    });
    if (response.ok){
      console.log(`Player ${playerID} removed successfully`);
    } else {
      console.error(
        `Failed to get rid of player ${playerId}. Response: ${response.status}`
      )
    }
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  // TODO
const main = document.querySelector("main");
if (!playerList.length) {
main.innerHTML = "<p> Players not found.</p>";
return;
}
main.innerHTML = "";

playerList.forEach((player) => {
  const playerCard = document.createElement("div");
  playerCard.classList.add("player-card");

  playerCard.innerHTML =`
  <h2>${player.name}</h2>
  <img src+"${player.imageUrl}" alt+"${player.name}" />
  <p> Player ID: ${player.id}</p>
  <button onclick="removePLayer(${player.id})">Remove from roster</button>
  `;
  const seeDetails = document.createElement("button");
  seeDetails.onclick = () => renderSinglePlayer(player);
  seeDetails.textContent = "See details";
  playerCard.appendChild(seeDetails);
  main.appendChild(playerCard);
});
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  // TODO
  console.log(player);
  const maine = document.querySelector("main");
  main.innerHTML ="";
  main.innerHTML = `
  <h2>${player.name}</h2>
  <img src="${player.imageUrl}" alt="${player.name}" />
  <p>Player ID; ${player.id}</p>
  <p>Breed: ${player.breed},/p>
  <p>Team: ${player.team || "Not Assigned"}</p>
  `;
  const seeDetails = document.createElement ("button");
  seeDetails.onclick = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  };
  seeDetails.textContent = "Back to every player";
  main.appendChild(seeDetails);
};
/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
const form = document.getElementById("new-player-form");

form.innerHTML = `
 <label for="name">Player Name:</label>
 <input type="text" id="name" required />
 <label for="breed">Breed:</label>
 <input type="text" id="breed" required />
 <label for="imageUrl">Image url:</label>
 <input type="url" id="imageurl" required />
 <label for="team">Team:</label>
 <input type="text" id="team" />
 <button type="submit">Add Player </button>
 `;

 form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const playerObj = {
    name: document.getElementById("name").value,
    breed: document.getElementById("breed").value,
    imageUrl: document.getElementById("imageUrl").value,
    team: document.getElementById("team").value || null,
  };
  await addNewPlayer(playerObj);
  const players = await fetchAllPlayers();
  console.log(players);
  renderAllPlayers(players);
 });
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
