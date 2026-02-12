import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface PokemonDetails {
  name: string;
  image: string;
  imageBack: string;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  height: number;
  weight: number;
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

const Details = () => {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPokemon() {
      setIsLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const details = await res.json();
        setPokemon({
          name: details.name,
          image: details.sprites.front_default,
          imageBack: details.sprites.back_default,
          types: details.types,
          stats: details.stats,
          height: details.height,
          weight: details.weight,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    if (name) fetchPokemon();
  }, [name]);

  const typeColor = pokemon
    ? (colorByType[pokemon.types[0].type.name] ?? "#a8a878")
    : "#a8a878";

  if (isLoading) return <Text>Loading...</Text>;
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: name ?? "Details" }} />
      <ScrollView
        contentContainerStyle={{
          gap: 16,
          padding: 16,
        }}
      >
        {pokemon && (
          <View style={{ alignItems: "center", gap: 12 }}>
            <Text style={styles.name}>{pokemon.name}</Text>
            <Text style={[styles.type, { color: typeColor }]}>
              {pokemon.types.map((t) => t.type.name).join(" / ")}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
              />
              <Image
                src={pokemon.imageBack}
                alt={pokemon.name}
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Height: {pokemon.height / 10} m
              </Text>
              <Text style={styles.infoLabel}>
                Weight: {pokemon.weight / 10} kg
              </Text>
            </View>
            <View style={{ width: "100%", gap: 8 }}>
              <Text style={styles.statsTitle}>Stats</Text>
              {pokemon.stats.map((s) => (
                <View key={s.stat.name} style={styles.statRow}>
                  <Text style={styles.statName}>{s.stat.name}</Text>
                  <View style={styles.statBarBg}>
                    <View
                      style={[
                        styles.statBarFill,
                        {
                          width: `${Math.min((s.base_stat / 255) * 100, 100)}%`,
                          backgroundColor: typeColor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.statValue}>{s.base_stat}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Details;

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  type: {
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  infoRow: {
    flexDirection: "row",
    gap: 24,
  },
  infoLabel: {
    fontSize: 16,
    color: "#555",
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statName: {
    width: 120,
    fontSize: 14,
    textTransform: "capitalize",
    color: "#555",
  },
  statBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
  statBarFill: {
    height: 8,
    borderRadius: 4,
  },
  statValue: {
    width: 32,
    fontSize: 14,
    textAlign: "right",
    fontWeight: "600",
  },
});
