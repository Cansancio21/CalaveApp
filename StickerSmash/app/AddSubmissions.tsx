import { Ionicons } from "@expo/vector-icons";
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
import { useSubmissionContext } from "./(tabs)/SubmissionContext";

export default function AddSubmissionScreen() {
  const { addOrUpdateSubmission } = useSubmissionContext();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const router = useRouter();

 const handleSubmit = () => {
  if (!name || !subject || !grade) {
    Alert.alert("Please fill in all fields.");
    return;
  }

  addOrUpdateSubmission({ image: null, name, subject, grade });
  Alert.alert(
    "Submission Successful",
    `Name: ${name}\nSubject: ${subject}\nGrade: ${grade}`,
    [
      {
        text: "OK",
        onPress: () => {
          setName("");
          setSubject("");
          setGrade("");
          router.push("/(tabs)/Submissions"); // Updated route
        },
      },
    ]
  );
};

  return (
    <View style={styles.container}>
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

      <Text style={styles.label}>Enter Grade:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Grade"
          value={grade}
          onChangeText={setGrade}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
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