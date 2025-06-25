import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Platform
} from "react-native";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState({
    username: false,
    password: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const buttonScale = new Animated.Value(1);

  const animatePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const existingUsers = await AsyncStorage.getItem("users");
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      const user = users.find(
        (u: any) => u.username === username && u.password === password
      );

      if (!user) {
        Alert.alert("Error", "Invalid credentials");
        return;
      }

      await AsyncStorage.setItem("authToken", username);
      Alert.alert("Welcome", `Hello ${username}!`, [
        { text: "Continue", onPress: () => router.push("/(tabs)") }
      ]);
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.glassContainer}>
          <View style={styles.header}>
            <Text style={styles.appName}>CalaveApp</Text>
            <View style={styles.logoUnderline} />
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={[
              styles.inputWrapper,
              isFocused.username && styles.inputFocused
            ]}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#FFD700"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#555"
                value={username}
                onChangeText={setUsername}
                onFocus={() => setIsFocused({...isFocused, username: true})}
                onBlur={() => setIsFocused({...isFocused, username: false})}
                autoCapitalize="none"
              />
            </View>

            <View style={[
              styles.inputWrapper,
              isFocused.password && styles.inputFocused
            ]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#FFD700"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#555"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsFocused({...isFocused, password: true})}
                onBlur={() => setIsFocused({...isFocused, password: false})}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={toggleShowPassword}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#FFD700"
                  style={styles.passwordIcon}
                />
              </TouchableOpacity>
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLogin}
                onPressIn={animatePressIn}
                onPressOut={animatePressOut}
                activeOpacity={0.9}
              >
                <Text style={styles.loginButtonText}>Sign In</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity 
              style={styles.registerPrompt}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.registerText}>
                New here? <Text style={styles.registerLink}>Register account</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  glassContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(10px)',
      },
      android: {
        elevation: 10,
      },
    }),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  logoUnderline: {
    width: 50,
    height: 4,
    backgroundColor: '#FFD700',
    marginVertical: 8,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    letterSpacing: 0.5,
  },
  formContainer: {
    borderRadius: 16,
    padding: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 12,
    marginBottom: 28,
  },
  inputFocused: {
    borderColor: '#FFD700',
  },
  inputIcon: {
    marginRight: 12,
  },
  passwordIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 4,
  },
  loginButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 0.5,
  },
  registerPrompt: {
    alignSelf: 'center',
  },
  registerText: {
    color: '#555',
    fontSize: 14,
  },
  registerLink: {
    color: '#FFD700',
    fontWeight: '600',
  },
});