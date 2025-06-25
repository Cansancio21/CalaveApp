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
        "This student does not exist in submissions. Please enter the exact name as registered."
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
    <View style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.glassContainer}>
          {/* === Name === */}
          <Text style={styles.label}>Enter Name:</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={24}
              color="#FFD700"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
          </View>
          <Text style={styles.errorText}>{nameError}</Text>

          {/* === Subject === */}
          <Text style={styles.label}>Enter Subject:</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="book-outline"
              size={24}
              color="#FFD700"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Subject"
              placeholderTextColor="#888"
              value={subject}
              onChangeText={setSubject}
            />
          </View>
          <Text style={styles.errorText}>{subjectError}</Text>

          {/* === College Grade === */}
          <Text style={styles.label}>Enter College Grade:</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="school-outline"
              size={24}
              color="#FFD700"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="College Grade (1.0-5.0)"
              placeholderTextColor="#888"
              value={collegeGrade}
              onChangeText={setCollegeGrade}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.errorText}>{collegeGradeError}</Text>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
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
  label: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 8,
    marginBottom: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 12,
    marginTop: -6,
  },
  submitButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});