import { Ability } from '../app/types/enum/Ability';
import { Rarity } from '../app/types/enum/Game';
import {Pkm, PkmFamily} from '../app/types/enum/Pokemon';
import PokemonFactory from '../app/models/pokemon-factory';
import fs from 'fs';
import { Synergy } from '../app/types/enum/Synergy';
import { RarityHpCost } from '../app/types/Config';

const data = {
  NORMAL: {
    pokemons: [],
    mythicalPokemons: []
  },
  GRASS: {
    pokemons: [],
    mythicalPokemons: []
  },
  FIRE: {
    pokemons: [],
    mythicalPokemons: []
  },
  WATER: {
    pokemons: [],
    mythicalPokemons: []
  },
  ELECTRIC: {
    pokemons: [],
    mythicalPokemons: []
  },
  FIGHTING: {
    pokemons: [],
    mythicalPokemons: []
  },
  PSYCHIC: {
    pokemons: [],
    mythicalPokemons: []
  },
  DARK: {
    pokemons: [],
    mythicalPokemons: []
  },
  METAL: {
    pokemons: [],
    mythicalPokemons: []
  },
  GROUND: {
    pokemons: [],
    mythicalPokemons: []
  },
  POISON: {
    pokemons: [],
    mythicalPokemons: []
  },
  DRAGON: {
    pokemons: [],
    mythicalPokemons: []
  },
  FIELD: {
    pokemons: [],
    mythicalPokemons: []
  },
  MONSTER: {
    pokemons: [],
    mythicalPokemons: []
  },
  HUMAN: {
    pokemons: [],
    mythicalPokemons: []
  },
  AQUATIC: {
    pokemons: [],
    mythicalPokemons: []
  },
  BUG: {
    pokemons: [],
    mythicalPokemons: []
  },
  FLYING: {
    pokemons: [],
    mythicalPokemons: []
  },
  FLORA: {
    pokemons: [],
    mythicalPokemons: []
  },
  MINERAL: {
    pokemons: [],
    mythicalPokemons: []
  },
  GHOST: {
    pokemons: [],
    mythicalPokemons: []
  },
  FAIRY: {
    pokemons: [],
    mythicalPokemons: []
  },
  ICE: {
    pokemons: [],
    mythicalPokemons: []
  },
  FOSSIL: {
    pokemons: [],
    mythicalPokemons: []
  },
  SOUND: {
    pokemons: [],
    mythicalPokemons: []
  }
};

(Object.keys(Synergy) as Synergy[]).forEach((type)=>{
  const pokemonCandidates = [];
  const mythicalPokemonCandidates = [];

  Object.values(Pkm).forEach((pkm) => {
    const pokemon = PokemonFactory.createPokemonFromName(pkm);
    const family = PkmFamily[pkm];
    if (pokemon.rarity != Rarity.NEUTRAL && pokemon.skill != Ability.DEFAULT) {
      if (pokemon.types.includes(type)) {
        if (pokemon.rarity == Rarity.MYTHICAL) {
          mythicalPokemonCandidates.push(pokemon);
        } else {
          let included = false;
          pokemonCandidates.forEach((candidate) =>{
            if (PkmFamily[candidate.name] == family) {
              included = true;
            }
          });
          if (!included) {
            pokemonCandidates.push(pokemon);
          }
        }
      }
    }
  });

  pokemonCandidates.sort(function(a, b) {
    return RarityHpCost[a.rarity] - RarityHpCost[b.rarity];
  });

  pokemonCandidates.forEach((p)=>{
    data[type].pokemons.push(p.name);
  });
  mythicalPokemonCandidates.forEach((p)=>{
    data[type].mythicalPokemons.push(p.name);
  });
});

console.log(data);

fs.writeFileSync('../app/models/precomputed/type-pokemons.json', JSON.stringify(data));