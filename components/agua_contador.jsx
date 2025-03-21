import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../utils/ThemeContext";
import { useFocusEffect } from "expo-router";
import { Audio } from "expo-av";

const HISTORICO_AGUA = "waterHistory";
const SETTINGS_PATH = "beberagua:notificationSettings";

export default function AguaContador({ copos, setCopos }) {
    const { theme } = useTheme();
    const [dailyGoal, setDailyGoal] = useState();
    const [sound, setSound] = useState();

    async function playSound() {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(require('../assets/water-sound.mp3'));
      setSound(sound);
  
      console.log('Playing Sound');
      await sound.playAsync();
    }

    useEffect(() => {
      return sound
        ? () => {
            console.log('Unloading Sound');
            sound.unloadAsync();
          }
        : undefined;
    }, [sound]);

    useFocusEffect(
      useCallback(() => {
        loadSettings();
      }, [])
    )
  
    const adicionar = async () => {
      const dtAtual = new Date().toLocaleDateString("pt-BR");
      setCopos(copos + 1);
      playSound();
      try {
      const historico = await AsyncStorage.getItem(HISTORICO_AGUA);
      const lista = historico ? JSON.parse(historico) : [];
      const coposHoje = lista.find(entry => entry.date === dtAtual);
      if (coposHoje) {
          coposHoje.count += 1;
      } else {
          lista.push({ date: dtAtual, count: 1 });
      }
      await AsyncStorage.setItem(HISTORICO_AGUA, JSON.stringify(lista));
      } catch (e) {
      console.error("Erro ao salvar histórico:", e);
      }
    };

    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(SETTINGS_PATH);
        if (savedSettings) {
          const { dailyGoal: dailyGoalSaved } = JSON.parse(savedSettings);
          setDailyGoal(dailyGoalSaved);
        } else {
          setInterval(1);
        }
      } catch (e) {
        console.error("Erro ao carregar configurações:", e);
        setInterval(1);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <View style={[styles.counterCard, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.cardContent}>
          <Text style={[styles.counterText, { color: theme.primaryDark }]}>
            Copos Hoje
          </Text>
          <Button title="Bebi um copo!" onPress={adicionar} color={theme.primary} />
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.counter}>{copos}/{dailyGoal} 💧</Text>
        </View>
      </View>
    );
  }

const styles = StyleSheet.create({
    counterCard: {
        flexDirection: "row",
        padding: 20,
        alignItems: "center",
        justifyContent: "space-between",
    },
    cardContent: {
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
    },
    counter: {
        fontSize: 46,
        fontWeight: "bold",
    },
    counterText: {
        fontSize: 24,
        fontWeight: "600",
    },
});