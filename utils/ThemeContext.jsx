import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_PATH = "beberagua:notificationSettings";
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeName, setThemeName] = useState(systemColorScheme || "light");
  const theme = themes[themeName];

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(SETTINGS_PATH);
        const settings = savedSettings ? JSON.parse(savedSettings) : {};
        setThemeName(settings.theme || systemColorScheme || "light");
      } catch (error) {
        console.error("Erro ao carregar tema:", error);
        setThemeName(systemColorScheme || "light");
      }
    };
    loadTheme();
  }, []);

  const setTheme = async (newTheme) => {
    setThemeName(newTheme);
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_PATH);
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      await AsyncStorage.setItem(SETTINGS_PATH, JSON.stringify({ ...settings, theme: newTheme }));
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export const themes = {
    light: {
      background: "#E3F2FD",
      cardBackground: "#FFF",
      primary: "#2196F3",
      primaryDark: "#1976D2",
      text: "#333",
      secondaryText: "#666",
      error: "#D32F2F",
      tabBarBackground: "#FFF",
      tabBarBorder: "#E3F2FD",
      headerColor: "#fff"
    },
    dark: {
      background: "#1E1E1E",
      cardBackground: "#2C2C2C",
      primary: "#42A5F5",
      primaryDark: "#90CAF9",
      text: "#E0E0E0",
      secondaryText: "#B0B0B0",
      error: "#EF5350",
      tabBarBackground: "#2C2C2C",
      tabBarBorder: "#424242",
      headerColor: "#2C2C2C"
    }
  };