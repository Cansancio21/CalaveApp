import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSubmissionContext } from "./SubmissionContext";

export default function AddSubmissionScreen() {
  const { submissions, addOrUpdateSubmission } = useSubmissionContext();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [collegeGrade, setCollegeGrade] = useState("");

  const [nameError, setNameError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [collegeGradeError, setCollegeGradeError] = useState("");

  const router = useRouter();

  const handleSubmit = () => {
    let hasError = false;

    setNameError("");
    setSubjectError("");
    setCollegeGradeError("");

    // === Name Validations ===
    if (!name) {
      setNameError("Name is required.");
      hasError = true;
    } else if (/\d/.test(name)) {
      setNameError("Name must not contain numbers.");
      hasError = true;
    }

    // === Subject Validations ===
    if (!subject) {
      setSubjectError("Subject is required.");
      hasError = true;
    } else if (!/^[A-Z]/.test(subject)) {
      setSubjectError("Subject must start with a capital letter.");
      hasError = true;
    } else if (/\d/.test(subject)) {
      setSubjectError("Subject must not contain numbers.");
      hasError = true;
    }

    // === College Grade Validation ===
    if (!collegeGrade) {
      setCollegeGradeError("College grade is required.");
      hasError = true;
    }

    if (hasError) return;

    const exists = submissions.some(
      (s) => s.name.trim() === name.trim()
    );

    if (submissions.length > 0 && !exists) {
      Alert.alert(
        "Students Not Found",
        "This Students does not exist in submissions. Please enter the exact name as registered."
      );
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
        {/* === Name === */}
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
        <Text style={styles.errorText}>{nameError}</Text>

        {/* === Subject === */}
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
        <Text style={styles.errorText}>{subjectError}</Text>

        {/* === College Grade === */}
        <Text style={styles.label}>Enter College Grade:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="College Grade (e.g., 1.0 - 5.0)"
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
        <Text style={styles.errorText}>{collegeGradeError}</Text>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
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
    marginBottom: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  inputIcon: {
    marginLeft: 10,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
    minHeight: 18, // Keeps space even when empty
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
