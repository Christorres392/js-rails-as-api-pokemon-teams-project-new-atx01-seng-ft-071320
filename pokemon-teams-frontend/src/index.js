const BASE_URL = 'http://localhost:3000';
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;

let _trainers;
let _pokemons;

document.addEventListener('DOMContentLoaded', () => {
  const trainerPromise = fetch(TRAINERS_URL).then((res) => res.json());
  const pokePromise = fetch(POKEMONS_URL).then((res) => res.json());

  Promise.all([trainerPromise, pokePromise]).then((data) => {
    [_trainers, _pokemons] = data;
    renderTrainers(_trainers);
    renderPokémons(_pokemons);
  });
});

function renderTrainers(data) {
  data.forEach((trainer) => renderTrainer(trainer));
}

function renderTrainer(trainer) {
  const list = document.getElementById('trainer-list');
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('data-id', trainer.id);

  card.innerHTML = `
  <p>${trainer.name}</p>
  <button data-trainer-id="${trainer.id}">Add Pokemon</button>
  <ul>
  </ul>
  `;
  const button = card.querySelector('button');
  button.addEventListener('click', () => addPokemon(trainer.id));
  list.append(card);
}

function renderPokémons(data) {
  data.forEach((poke) => renderPokemon(poke));
}

function renderPokemon(poke) {
  const trainer = document.querySelector(`[data-id='${poke.trainer_id}']`);
  const li = document.createElement('li');
  li.innerHTML = `${poke.nickname} (${poke.species}) 
  <button class="release" data-pokeomon-id="${poke.id}">Release</button>`;

  const button = li.querySelector('button');
  button.addEventListener('click', () => releasePokemon(poke.id));

  trainer.append(li);
}

function addPokemon(trainerId) {
  if (_pokemons.filter((e) => parseInt(e.trainer_id) == trainerId).length < 6) {
    fetch(POKEMONS_URL, {
      method: 'POST',
      headers: {
        Accepts: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ trainerId }),
    })
      .then((res) => res.json())
      .then((json) => {
        _pokemons.push(json);
        renderPokemon(json);
      });
  }
}

function releasePokemon(id) {
  document.querySelector(`[data-pokeomon-id='${id}']`).parentNode.remove();
  _pokemons = _pokemons.filter((e) => e.id !== id);
  fetch(`${POKEMONS_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Accepts: 'application/json',
      'Content-type': 'application/json',
    },
  });
}
