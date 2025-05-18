const API_URL = 'https://fsa-puppy-bowl.herokuapp.com/api/2301-FTB-ET-WEB-FT/players';
const playersContainer = document.getElementById('players-container');
const form = document.getElementById('add-player-form');

async function fetchPlayers() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();
    renderPlayers(result.data.players);
  } catch (error) {
    console.error('Failed to fetch players:', error);
  }
}

function renderPlayers(players) {
  playersContainer.innerHTML = '';

  players.forEach(player => {
    const card = document.createElement('div');
    card.classList.add('player-card');

    card.innerHTML = `
      <h3>${player.name}</h3>
      <p><strong>Breed:</strong> ${player.breed}</p>
      <img src="${player.imageUrl}" alt="${player.name}" width="200" />
      <button data-id="${player.id}" class="remove-btn">Remove</button>
    `;

    card.querySelector('.remove-btn').addEventListener('click', async () => {
      await removePlayer(player.id);
    });

    playersContainer.appendChild(card);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const breed = document.getElementById('breed').value;
  const imageUrl = document.getElementById('imageUrl').value;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, breed, imageUrl }),
    });

    const result = await response.json();

    if (result.success) {
      form.reset();
      fetchPlayers();
    } else {
      alert('Failed to add puppy.');
    }
  } catch (error) {
    console.error('Error adding puppy:', error);
  }
});

async function removePlayer(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (result.success) {
      fetchPlayers(); 
    } else {
      alert('Failed to remove puppy.');
    }
  } catch (error) {
    console.error('Error removing puppy:', error);
  }
}

fetchPlayers();


