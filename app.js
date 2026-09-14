async function buscarPokemon() {
    const input = document.getElementById('pokemonInput').value.toLowerCase().trim();

    const card = document.getElementById('pokemonCard');
    const errorMessage = document.getElementById('errorMessage');
    const waitingMessage = document.getElementById('waitingMessage');

    if (!input) return;

    // Estado de "carregando"
    waitingMessage.classList.add('hidden');
    card.classList.add('hidden');
    errorMessage.classList.add('hidden');

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);

        if (!response.ok) {
            throw new Error('Pokémon não encontrado');
        }

        const data = await response.json();

        // A arte em pixel retro fica mais legal com o tema, mas mantive a oficial caso prefira HD
        // Para a arte em pixel clássica, use: data.sprites.front_default
        document.getElementById('pokemonImg').src = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;

        // Formata o ID para ter zeros à esquerda (ex: 025)
        const pokemonId = data.id.toString().padStart(3, '0');
        document.getElementById('pokemonName').textContent = `#${pokemonId} ${data.name}`;

        const typesContainer = document.getElementById('pokemonTypes');
        typesContainer.innerHTML = '';
        data.types.forEach(typeInfo => {
            const span = document.createElement('span');
            span.textContent = typeInfo.type.name;
            typesContainer.appendChild(span);
        });

        card.classList.remove('hidden');

    } catch (error) {
        errorMessage.classList.remove('hidden');
    }
}

document.getElementById('pokemonInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        buscarPokemon();
    }
});
