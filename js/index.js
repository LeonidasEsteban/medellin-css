const speach = window.speechSynthesis;

const $pokedex = document.querySelector('#pokedex');
const $image = document.querySelector('#image');
const $form = document.querySelector('#form');
const $chart = document.querySelector('#chart');
const context = $chart.getContext('2d');

async function getData(entrypoint, id) {
  const response = await fetch(`https://pokeapi.co/api/v2/${entrypoint}/${id}/`);
  const pokemon = await response.json();
  console.log(pokemon)
  return pokemon;
}
const labels = ['Velocidad', 'Defensa Especial', 'Ataque Especial', 'Defensa', 'Ataque', 'PS']
$form.addEventListener('submit', async (event) => {
  event.preventDefault();
  $pokedex.classList.add('is-active');
  const form = new FormData($form);
  const id = form.get('id')
  const pokemon = await getData('pokemon', id);
  const species = await getData('pokemon-species', id);
  const flavor = species.flavor_text_entries.find((entry) => entry.language.name === 'es')
  const stats = pokemon.stats.map((stat) => stat.base_stat)
  console.log(stats)
  $image.setAttribute('src', pokemon.sprites.front_default)
  const utterance = new SpeechSynthesisUtterance(`${pokemon.name}. ${flavor.flavor_text}`)
  utterance.rate = .8
  utterance.lang = 'es'

  speach.speak(utterance)
  createChart(stats, pokemon.name);
})
function createChart(data, name) {
  new Chart(context, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: name,
        data,
        backgroundColor: 'rgba(221, 8, 47,.5)'
      }]
    },
    options: {
      maintainAspectRatio: false,
    }
  })
}