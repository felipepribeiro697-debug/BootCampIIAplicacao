import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// --- Configuração do Supabase ---
// Preencha com os dados do SEU projeto: Project Settings -> API
// A "anon public" key é feita para uso no frontend (não é segredo de servidor).
const SUPABASE_URL = "https://lxovprhafktjsdnhaojh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_7ZAcXauKC2ee-352CqavPA_LqZUG_b_";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Guarda os dados do Pokémon exibido no momento, para poder favoritá-lo
let pokemonAtual = null;

async function buscarPokemon() {
    const input = document.getElementById('pokemonInput').value.toLowerCase().trim();

    const card = document.getElementById('pokemonCard');
    const errorMessage = document.getElementById('errorMessage');
    const waitingMessage = document.getElementById('waitingMessage');

    if (!input) return;

    pokemonAtual = null;

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
        pokemonAtual = data;

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

// --- Persistência (Supabase): tabela "favoritos" ---
// Colunas esperadas: id (gerado automaticamente), criado_em (gerado automaticamente),
// nome_item (nome do Pokémon), dados_extra (JSON em texto com sprite, tipos e id da Pokédex)

async function favoritarPokemonAtual() {
    if (!pokemonAtual) return;

    const dadosExtra = JSON.stringify({
        sprite: pokemonAtual.sprites.other['official-artwork'].front_default || pokemonAtual.sprites.front_default,
        tipos: pokemonAtual.types.map(t => t.type.name),
        pokedexId: pokemonAtual.id
    });

    const { error } = await supabase
        .from('favoritos')
        .insert({ nome_item: pokemonAtual.name, dados_extra: dadosExtra });

    if (error) {
        console.error(error);
        alert('Não foi possível adicionar ao time. Veja o console (F12) para detalhes.');
        return;
    }

    await listarFavoritos();
}

async function listarFavoritos() {
    const lista = document.getElementById('teamList');

    const { data, error } = await supabase
        .from('favoritos')
        .select('*')
        .order('criado_em');

    if (error) {
        console.error(error);
        lista.innerHTML = '<p class="error">Não foi possível carregar o time.</p>';
        return;
    }

    renderizarTime(data);
}

function renderizarTime(favoritos) {
    const lista = document.getElementById('teamList');
    lista.innerHTML = '';

    if (!favoritos || favoritos.length === 0) {
        lista.innerHTML = '<p class="waiting">Nenhum Pokémon no time ainda.</p>';
        return;
    }

    favoritos.forEach(fav => {
        let extra = {};
        try {
            extra = JSON.parse(fav.dados_extra);
        } catch (e) {
            extra = {};
        }

        const item = document.createElement('div');
        item.className = 'team-item';
        item.innerHTML = `
            <img src="${extra.sprite || ''}" alt="${fav.nome_item}">
            <span>${fav.nome_item}</span>
            <button class="remove-btn" data-id="${fav.id}">remover</button>
        `;
        lista.appendChild(item);
    });

    lista.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => removerFavorito(btn.dataset.id));
    });
}

async function removerFavorito(id) {
    const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('id', id);

    if (error) {
        console.error(error);
        alert('Não foi possível remover. Veja o console (F12) para detalhes.');
        return;
    }

    await listarFavoritos();
}

document.getElementById('btnBuscar').addEventListener('click', buscarPokemon);

document.getElementById('pokemonInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        buscarPokemon();
    }
});

document.getElementById('btnFavoritar').addEventListener('click', favoritarPokemonAtual);

// Carrega o time salvo assim que a página abre
listarFavoritos();
