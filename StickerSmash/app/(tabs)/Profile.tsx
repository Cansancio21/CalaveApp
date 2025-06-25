import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
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
        if (!token) {
          router.push("/login");
          return;
        }

        const existingUsers = await AsyncStorage.getItem("users");
        if (!existingUsers) {
          router.push("/register");
          return;
        }

        const users = JSON.parse(existingUsers);
        const currentUser = users.find((u: User) => u.username === token);
        setUser(currentUser || null);
      } catch (error) {
        Alert.alert("Error", "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "We need access to your gallery.");
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
      } catch (error) {
        Alert.alert("Error", "Failed to save profile image.");
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.background}>
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.background}>
        <Text style={styles.loadingText}>No Profile Data</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.glassContainer}>
          <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
            {user.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="camera" size={32} color="#555" />
                <Text style={styles.placeholderText}>Tap to upload photo</Text>
              </View>
            )}
          </TouchableOpacity>

          {["firstName", "lastName", "username", "email", "contactNumber"].map(
            (key) => (
              <View key={key} style={styles.infoContainer}>
                <Text style={styles.label}>
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}:
                </Text>
                <Text style={styles.value}>{user[key as keyof User] || "Not provided"}</Text>
              </View>
            )
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await AsyncStorage.removeItem("authToken");
              router.push("/login");
            }}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  glassContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 25,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  photoContainer: {
    alignSelf: 'center',
    marginBottom: 25,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  placeholderText: {
    color: '#555',
    fontSize: 12,
    marginTop: 8,
  },
  infoContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});