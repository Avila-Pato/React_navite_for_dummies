import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorByType: Record<string, string> = {
  grass: "#7ac74c",
  fire: "#f08030",
  water: "#6890f0",
  bug: "#a8b820",
  poison: "#a040a0",
  normal: "#a8a878",
  electric: "#f8d030",
  ground: "#e0c068",
  fighting: "#c03028",
  psychic: "#f85888",
  rock: "#b8a038",
  ghost: "#705898",
  ice: "#98d8d8",
  dragon: "#7038f8",
  dark: "#705848",
  steel: "#b8b8d0",
  fairy: "#ee99ac",
  flying: "#a890f0",
};
export default function Index() {
  const api = "https://pokeapi.co/api/v2/pokemon/?limit=20";
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [pageUrl, setPageUrl] = useState(api);
  const [isLoading, setIsLoading] = useState(false);

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  // console.log(JSON.stringify(pokemons[0], null, 2));
  async function getData() {
    setIsLoading(true);
    try {
      const response = await fetch(pageUrl);
      const data = await response.json();

      setNextPageUrl(data.next);
      setPrevPageUrl(data.previous);

      const detailsPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types,
          };
        }),
      );

      setPokemons(detailsPokemons);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, [pageUrl]);

  if (isLoading) {
    return (
      <Text style={{ textAlign: "center", fontSize: 20 }}>Cargando...</Text>
    );
  }
  return (
    <ScrollView contentContainerStyle={{ gap: 16, padding: 16 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        <Pressable
          onPress={() => prevPageUrl && setPageUrl(prevPageUrl)}
          disabled={!prevPageUrl}
          style={styles.button}
        >
          <Text>Previous</Text>
        </Pressable>
        <Pressable
          onPress={() => nextPageUrl && setPageUrl(nextPageUrl)}
          disabled={!nextPageUrl}
          style={styles.button}
        >
          <Text>Next</Text>
        </Pressable>
      </View>
      {pokemons.map((pokemon) => (
        <Link
          key={pokemon.name}
          href={{
            pathname: "/components/details",
            params: { name: pokemon.name },
          }}
        >
          <View
            style={{
              alignItems: "center",
              flex: 1,
              margin: 10,
              backgroundColor: colorByType[pokemon.types[0].type.name] + 30,
              padding: 20,
              borderRadius: 20,
            }}
          >
            <Text style={styles.name}>{pokemon.name}</Text>
            <Text style={styles.type}>{pokemon.types[0].type.name}</Text>
            <View style={{ flexDirection: "row" }}>
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              />
              <Image
                src={pokemon.imageBack}
                alt={pokemon.name}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              />
            </View>
          </View>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
  button: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  IsLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
