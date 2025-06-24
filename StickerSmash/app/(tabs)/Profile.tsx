import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  contactNumber: string;
  password: string;
  profileImage?: string | null;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem("authToken");
        console.log("Auth Token:", token); // Debug: Log token

        if (!token) {
          Alert.alert("Error", "Not logged in. Please log in again.");
          router.push("/login");
          return;
        }

        const existingUsers = await AsyncStorage.getItem("users");
        console.log("Users Data:", existingUsers); // Debug: Log users

        if (!existingUsers) {
          Alert.alert("Error", "No user data found. Please register.");
          router.push("/register");
          return;
        }

        const users = JSON.parse(existingUsers);
        const currentUser = users.find((u: User) => u.username === token);

        if (currentUser) {
          setUser(currentUser);
        } else {
          Alert.alert("Error", "User not found. Please log in again.");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to load profile. Please try again.");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "We need access to your gallery to upload photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && user) {
      try {
        const updatedUser = { ...user, profileImage: result.assets[0].uri };
        const existingUsers = await AsyncStorage.getItem("users");
        const users = existingUsers ? JSON.parse(existingUsers) : [];
        const updatedUsers = users.map((u: User) =>
          u.username === user.username ? updatedUser : u
        );
        await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
        setUser(updatedUser);
        console.log("Updated user with profile image:", updatedUser); // Debug
        Alert.alert("Success", "Profile image updated!");
      } catch (error) {
        console.error("Error saving profile image:", error);
        Alert.alert("Error", "Failed to save profile image.");
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>No Profile Data</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
        {user.profileImage ? (
          <Image source={{ uri: user.profileImage }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Tap to upload photo</Text>
          </View>
        )}
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>First Name:</Text>
          <Text style={styles.value}>{user.firstName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Last Name:</Text>
          <Text style={styles.value}>{user.lastName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{user.username}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Contact Number:</Text>
          <Text style={styles.value}>{user.contactNumber}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            try {
              await AsyncStorage.removeItem("authToken");
              router.push("/login");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to log out.");
            }
          }}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  photoContainer: {
    alignSelf: "center",
    marginTop: 20, // Reduced from 80 since no back button
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "black",
    textAlign: "center",
    fontSize: 14,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  infoContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: "#ffd33d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  logoutButton: {
    backgroundColor: "#ffd33d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});