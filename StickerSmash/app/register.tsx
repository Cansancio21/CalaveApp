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
} from "react-native";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!firstName || !lastName || !username || !email || !contactNumber || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    // Basic contact number validation (digits only, 7-15 characters)
    const contactRegex = /^\d{7,15}$/;
    if (!contactRegex.test(contactNumber)) {
      Alert.alert("Error", "Please enter a valid contact number (7-15 digits).");
      return;
    }

    try {
      // Check if username already exists
      const existingUsers = await AsyncStorage.getItem("users");
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      if (users.some((user: any) => user.username === username)) {
        Alert.alert("Error", "Username already exists.");
        return;
      }

      // Store user data
      const newUser = { firstName, lastName, username, email, contactNumber, password };
      users.push(newUser);
      await AsyncStorage.setItem("users", JSON.stringify(users));
      console.log("Registered user:", newUser); // Debug: Log registered user

      Alert.alert("Success", "Registration successful!", [
        {
          text: "OK",
          onPress: () => {
            setFirstName("");
            setLastName("");
            setUsername("");
            setEmail("");
            setContactNumber("");
            setPassword("");
            router.push("/login");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to register. Please try again.");
      console.error("Register error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Text style={styles.label}>First Name:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />
        <Ionicons
          name="person-outline"
          size={24}
          color="#ffd33d"
          style={styles.inputIcon}
        />
      </View>

      <Text style={styles.label}>Last Name:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />
        <Ionicons
          name="person-outline"
          size={24}
          color="#ffd33d"
          style={styles.inputIcon}
        />
      </View>

      <Text style={styles.label}>Username:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <Ionicons
          name="person-circle-outline"
          size={24}
          color="#ffd33d"
          style={styles.inputIcon}
        />
      </View>

      <Text style={styles.label}>Email:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Ionicons
          name="mail-outline"
          size={24}
          color="#ffd33d"
          style={styles.inputIcon}
        />
      </View>

      <Text style={styles.label}>Contact Number:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter contact number"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />
        <Ionicons
          name="call-outline"
          size={24}
          color="#ffd33d"
          style={styles.inputIcon}
        />
      </View>

      <Text style={styles.label}>Password:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color="#ffd33d"
          style={styles.inputIcon}
        />
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
    fontWeight: "bold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  inputIcon: {
    marginLeft: 10,
  },
  registerButton: {
    backgroundColor: "#ffd33d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  loginLink: {
    fontSize: 16,
    color: "#ffd33d",
    textAlign: "center",
    marginTop: 20,
  },
});