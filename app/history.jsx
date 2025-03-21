// app/history.jsx
import React, { useState, useCallback } from "react";

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../utils/ThemeContext";
import { useFocusEffect } from "expo-router";

const HISTORICO_AGUA = "waterHistory"; // Mesma chave usada no componente AguaContador

export default function HistoryScreen() {
    const { theme } = useTheme();
    const [historico, setHistorico] = useState([]);

    useFocusEffect(
      useCallback(() => {
        carregar();
      }, [])
    );
  
    const ordenarHistorico = (a, b) => {
      const [diaA, mesA, anoA] = a.date.split("/");
      const [diaB, mesB, anoB] = b.date.split("/");
      return new Date(anoB, mesB - 1, diaB) - new Date(anoA, mesA - 1, diaA);
    };
  
    const carregar = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem(HISTORICO_AGUA);
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory);
          const ordenado = parsed.sort(ordenarHistorico);
          setHistorico(ordenado);
        }
      } catch (e) {
        console.error("Erro ao carregar histórico:", e);
      }
    };
  
    const limparHistorico = () => {
      Alert.alert(
        "Limpar Histórico",
        "Tem certeza que deseja limpar todo o histórico de consumo?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Limpar",
            onPress: async () => {
              await AsyncStorage.removeItem(HISTORICO_AGUA);
              setHistorico([]);
            },
            style: "destructive",
          },
        ]
      );
    };

  const renderHistoryItem = ({ item }) => (
      <View style={[styles.historyItem, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.historyText, { color: theme.secondaryText }]}>
          {item.date}: {item.count} copo(s) 💧
          </Text>
      </View>
  );

  return (
  <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.primaryDark }]}>
      Histórico de Consumo
      </Text>
      <TouchableOpacity style={styles.limparButton} onPress={limparHistorico}>
      <Text style={styles.limparButtonText}>Limpar Histórico</Text>
      </TouchableOpacity>
      <FlatList
      data={historico}
      renderItem={renderHistoryItem}
      keyExtractor={item => item.date}
      style={styles.historyList}
      contentContainerStyle={styles.historyContent}
      ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
              Nenhum registro de consumo encontrado
          </Text>
          </View>
      )}
      />
  </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 20,
    },
    historyList: {
      flex: 1,
    },
    historyContent: {
      paddingBottom: 20,
    },
    historyItem: {
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    historyText: {
      fontSize: 16,
    },
    limparButton: {
      backgroundColor: "#FF5252",
      borderRadius: 10,
      padding: 12,
      marginBottom: 20,
      alignItems: "center",
    },
    limparButtonText: {
      color: "#FFF",
      fontWeight: "bold",
      fontSize: 16,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      fontSize: 16,
      textAlign: "center",
    },
  });