import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Switch, ActivityIndicator, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateNotifications } from "../../utils/notifications";
import Slider from "@react-native-community/slider";
import { useTheme, themes } from "../../utils/ThemeContext";

const SETTINGS_PATH = "beberagua:notificationSettings";
const INTERVAL_MIN = 0.01;
const INTERVAL_MAX = 4;
const INTERVAL_STEP = 0.01;

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [interval, setInterval] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === themes.dark);
  const [dailyGoal, setDailyGoal] = useState(0);

  const toggleTheme = (value) => {
    setIsDarkMode(value);
    setTheme(value ? "dark" : "light");
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveSettings();
    }
  }, [isDarkMode, notificationsEnabled, interval, dailyGoal]);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_PATH);
      if (savedSettings) {
        const { enabled, interval: savedInterval, theme: savedTheme, dailyGoal: dailyGoalSaved } = JSON.parse(savedSettings);
        setNotificationsEnabled(enabled);
        setInterval(parseFloat(savedInterval) || 1);
        setIsDarkMode(savedTheme === "dark");
        setDailyGoal(dailyGoalSaved);
        if (savedTheme) setTheme(savedTheme);
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

  const saveSettings = async () => {
    console.log("Chamando save...")
    try {
      const settings = {
        enabled: notificationsEnabled,
        interval: interval,
        theme: isDarkMode ? "dark" : "light",
        dailyGoal: dailyGoal,
      };
      await AsyncStorage.setItem(SETTINGS_PATH, JSON.stringify(settings));
      await updateNotifications();
    } catch (e) {
      console.error("Erro ao salvar configurações:", e);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const handleDailyGoalChange = (text) => {
      // Allow only numbers
      const numericValue = text.replace(/[^0-9]/g, "");
      setDailyGoal(numericValue);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.setting}>
          <Text style={[styles.label, { color: theme.secondaryText }]}>
            Modo Escuro
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#ccc", true: theme.primary }}
            thumbColor={isDarkMode ? theme.primaryDark : "#f4f3f4"}
          />
        </View>
        <View style={styles.setting}>
          <Text style={[styles.label, { color: theme.secondaryText }]}>
            Notificações
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#ccc", true: theme.primary }}
            thumbColor={notificationsEnabled ? theme.primaryDark : "#f4f3f4"}
          />
        </View>
        <View style={styles.sliderContainer}>
          <Text style={[styles.label, { color: theme.secondaryText }]}>
            Intervalo: {interval?.toFixed(2)} hora(s)
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={INTERVAL_MIN}
            maximumValue={INTERVAL_MAX}
            step={INTERVAL_STEP}
            value={interval}
            onValueChange={setInterval}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.secondaryText}
            thumbTintColor={theme.primaryDark}
          />
        </View>
        <View style={styles.setting}>
          <Text style={[styles.label, { color: theme.secondaryText }]}>
            Meta diária
          </Text>
          <TextInput inputMode="numeric" keyboardType="numeric" style={{backgroundColor: theme.background, color:theme.secondaryText, minWidth: "20%", textAlign: "center"}} value={dailyGoal} onChangeText={handleDailyGoalChange}/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
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
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
  },
  sliderContainer: {
    marginVertical: 15,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});