import axios from "axios";
import React, { useEffect, useState } from "react";
import "../index.css";
import PokemonCards from "../card/PokemonCards";
const Pokemon = () => {
  const [pokemon, setpokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setsearch] = useState("");

  const API = "https://pokeapi.co/api/v2/pokemon?limit=300";

  const getPokemonData = async () => {
    try {
      const response = await axios.get(API);
      // console.log("data =>", response);

      const detailedPokemonData = response.data.results.map(
        async (curentpokemon) => {
          const data = await axios.get(curentpokemon.url);
          // console.log("new data =>", data);
          return data;
        }
      );
      const detailedResponse = await Promise.all(detailedPokemonData);
      console.log("final data :", detailedResponse);
      setpokemon(detailedResponse);
      setLoading(false);
    } catch (error) {
      //error handling
      console.log("error message : ", error.message);
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    getPokemonData();
  }, []);

  //Search functionality ..

  const searchPokemon = pokemon.filter((currPokemon) =>
    currPokemon.data.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <h1>Loading....</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>{error.message}</h1>
      </div>
    );
  }

  return (
    <>
      <section className="container">
        <header>
          <h1>Lets Catch Pokemon !</h1>
        </header>
        <div className="pokemon-search">
          <input
            type="text"
            placeholder="Search your pokemon !"
            value={search}
            onChange={(e) => setsearch(e.target.value)}
          />
        </div>
        <div>
          <ul className="cards">
            {/* {pokemon.map((pokemoncurr) => { */}
            {searchPokemon.map((pokemoncurr) => {
              return (
                <PokemonCards
                  key={pokemoncurr.data.id}
                  pokemonData={pokemoncurr.data}
                />
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Pokemon;
