import React from "react";
import { StyleSheet, View, Text, Share, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { useTheme } from "../../utils/ThemeContext";

const equipe = Constants.expoConfig.extra.equipe;

export default function AboutScreen() {
  const { theme } = useTheme();

  const onShare = async () => {
    try {
      await Share.share(
        {
          message: "Experimente o Lembrete de Água! Um app simples para te ajudar a se manter hidratado todos os dias. Baixe agora em https://videira.ifc.edu.br",
          title: "Convide amigos para se hidratar!",
          url: "https://videira.ifc.edu.br",
        },
        { dialogTitle: "Compartilhar o Lembrete de Água" }
      );
    } catch (error) {
      console.error("Erro ao compartilhar:", error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: theme.primaryDark }]}>
          Equipe de Desenvolvimento
        </Text>
        {equipe?.map((member, index) => (
          <Text key={index} style={[styles.text, { color: theme.secondaryText }]}>
            {member}
          </Text>
        ))}
        <Text style={[styles.sectionTitle, { color: theme.primaryDark }]}>
          Versão
        </Text>
        <Text style={[styles.text, { color: theme.secondaryText }]}>
          {Constants.expoConfig.version}
        </Text>
        <Text style={[styles.sectionTitle, { color: theme.primaryDark }]}>
          Objetivo
        </Text>
        <Text style={[styles.text, { color: theme.secondaryText }]}>
          Este aplicativo foi criado para ajudar as pessoas a se manterem hidratadas,
          oferecendo lembretes regulares e um registro simples do consumo de água.
        </Text>
        <TouchableOpacity style={[styles.shareButton, { backgroundColor: theme.primary }]} onPress={onShare}>
          <Text style={styles.shareButtonText}>Compartilhar App 💧</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  shareButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
  },
  shareButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});