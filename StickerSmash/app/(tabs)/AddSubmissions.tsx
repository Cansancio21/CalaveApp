import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSubmissionContext } from "./SubmissionContext";

export default function AddSubmissionScreen() {
  const { addOrUpdateSubmission } = useSubmissionContext();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [collegeGrade, setCollegeGrade] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (!name || !subject || !collegeGrade) {
      Alert.alert("Validation Error", "Please fill in all fields with valid college grade information.");
      return;
    }

    addOrUpdateSubmission({ name, subject, grade: collegeGrade });
    Alert.alert(
      "Submission Successful",
      `Name: ${name}\nSubject: ${subject}\nCollege Grade: ${collegeGrade}`,
      [
        {
          text: "OK",
          onPress: () => {
            setName("");
            setSubject("");
            setCollegeGrade("");
            router.push("/(tabs)/Submissions");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Enter Name:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <Ionicons
            name="person-outline"
            size={24}
            color="#ffd33d"
            style={styles.inputIcon}
          />
        </View>

        <Text style={styles.label}>Enter Subject:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
          />
          <Ionicons
            name="book-outline"
            size={24}
            color="#ffd33d"
            style={styles.inputIcon}
          />
        </View>

        <Text style={styles.label}>Enter College Grade:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="College Grade (e.g., 1.0-5.0)"
            value={collegeGrade}
            onChangeText={setCollegeGrade}
            keyboardType="numeric"
          />
          <Ionicons
            name="school-outline"
            size={24}
            color="#ffd33d"
            style={styles.inputIcon}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  scrollContent: ViewStyle;
  label: TextStyle;
  inputWrapper: ViewStyle;
  input: TextStyle;
  inputIcon: TextStyle;
  submitButton: ViewStyle;
  submitButtonText: TextStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
    marginTop: 16,
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
  submitButton: {
    backgroundColor: "#ffd33d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});