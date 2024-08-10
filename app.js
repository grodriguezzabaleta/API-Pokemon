//Buscar el pokemos por su nombre
const URL = "https://pokeapi.co/api/v2/pokemon/";

const searchInput = document.getElementById("search");
const numPokemonInput = document.getElementById("num-pokemon");
const pokedexContainer = document.getElementById("pokedex");

async function fetchPokemonData(id) {
	const response = await fetch(`${URL}${id}`);
	if (!response.ok) {
		throw new Error("Pokémon no encontrado");
	}
	return response.json();
}

async function searchPokemon() {
	const searchedPokemon = searchInput.value.toLowerCase().trim();

	try {
		const response = await fetch(`${URL}${searchedPokemon}`);
		if (!response.ok) {
			throw new Error("Pokémon no encontrado");
		}
		const data = await response.json();

		pokedexContainer.innerHTML = `
            <div class="pokemon-card">
                <h2>${data.name.toUpperCase()}</h2>
                <img src="${
									data.sprites.other["official-artwork"].front_default
								}" alt="${data.name}">
                <p>Número: ${data.id}</p>
                <p>Habilidad 1: ${data.abilities[0]?.ability.name || "N/A"}</p>
                <p>Oculta la habilidad: ${
									data.abilities[0]?.is_hidden ? "Sí" : "No"
								}</p>
                <p>Habilidad 2: ${data.abilities[1]?.ability.name || "N/A"}</p>
                <p>Oculta la habilidad: ${
									data.abilities[1]?.is_hidden ? "Sí" : "No"
								}</p>
                <p>Tipo 1: ${data.types[0]?.type.name || "N/A"}</p>
                <p>Tipo 2: ${data.types[1]?.type.name || "N/A"}</p>
            </div>
        `;
	} catch (error) {
		pokedexContainer.innerHTML = `<p>No se pudo encontrar el Pokémon. Asegúrate de que el nombre o número esté correctamente escrito.</p>`;
	}

	searchInput.value = "";
	searchInput.focus();
}

async function showPokemonList() {
	const numberOfPokemons = parseInt(numPokemonInput.value, 10);
	pokedexContainer.innerHTML = ""; // Limpiar resultados anteriores

	if (isNaN(numberOfPokemons) || numberOfPokemons <= 0) {
		pokedexContainer.innerHTML = `<p>Por favor, ingresa un número válido.</p>`;
		return;
	}

	try {
		const promises = [];
		for (let i = 1; i <= numberOfPokemons; i++) {
			promises.push(fetchPokemonData(i));
		}

		const results = await Promise.all(promises);

		results.forEach((data) => {
			const ability1 = data.abilities[0]?.ability.name || "N/A";
			const hiddenAbility1 = data.abilities[0]?.is_hidden ? "Sí" : "No";
			const ability2 = data.abilities[1]?.ability.name || "N/A";
			const hiddenAbility2 = data.abilities[1]?.is_hidden ? "Sí" : "No";

			const type1 = data.types[0]?.type.name || "N/A";
			const type2 = data.types[1]?.type.name || "N/A";

			pokedexContainer.innerHTML += `
                <div class="pokemon-card">
                    <h2>${data.name.toUpperCase()}</h2>
                    <img src="${
											data.sprites.other["official-artwork"].front_default
										}" alt="${data.name}">
                    <p>Número: ${data.id}</p>
                    <p>Habilidad 1: ${ability1}</p>
                    <p>Oculta la habilidad: ${hiddenAbility1}</p>
                    <p>Habilidad 2: ${ability2}</p>
                    <p>Oculta la habilidad: ${hiddenAbility2}</p>
                    <p>Tipo 1: ${type1}</p>
                    <p>Tipo 2: ${type2}</p>
                </div>
            `;
		});
	} catch (error) {
		pokedexContainer.innerHTML = `<p>No se pudo encontrar algunos Pokémon. Intenta con otro número.</p>`;
	}

	numPokemonInput.value = "";
	numPokemonInput.focus();
}

document.getElementById("btn-search").addEventListener("click", searchPokemon);
document.getElementById("btn-show").addEventListener("click", showPokemonList);
