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

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
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

  const handleRegister = async () => {
    if (!firstName || !lastName || !username || !email || !password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      const existingUsers = await AsyncStorage.getItem("users");
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Check if username already exists
      if (users.some((u: any) => u.username === username)) {
        Alert.alert("Error", "Username already exists");
        return;
      }

      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        Alert.alert("Error", "Email already registered");
        return;
      }

      const newUser = {
        firstName,
        lastName,
        username,
        email,
        contactNumber,
        password
      };

      users.push(newUser);
      await AsyncStorage.setItem("users", JSON.stringify(users));
      await AsyncStorage.setItem("authToken", username);
      
      Alert.alert("Success", "Account created successfully!", [
        { text: "Continue", onPress: () => router.push("/(tabs)") }
      ]);
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
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
            <Text style={styles.subtitle}>Create your account</Text>
          </View>

          <View style={styles.formContainer}>
            {/* First Name */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#FFD700"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#555"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>

            {/* Last Name */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#FFD700"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#555"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>

            {/* Username */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-circle-outline"
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
                autoCapitalize="none"
              />
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#FFD700"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#555"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Contact Number */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#FFD700"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                placeholderTextColor="#555"
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
              />
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
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
                style={styles.registerButton} 
                onPress={handleRegister}
                onPressIn={animatePressIn}
                onPressOut={animatePressOut}
                activeOpacity={0.9}
              >
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity 
              style={styles.loginPrompt}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Sign in</Text>
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
    marginBottom: 30,
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
    marginBottom: 20,
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
  registerButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 0.5,
  },
  loginPrompt: {
    alignSelf: 'center',
  },
  loginText: {
    color: '#555',
    fontSize: 14,
  },
  loginLink: {
    color: '#FFD700',
    fontWeight: '600',
  },
});