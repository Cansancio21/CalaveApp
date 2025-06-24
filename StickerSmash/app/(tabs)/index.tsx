import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSubmissionContext } from "./SubmissionContext";

export default function Index() {
  const { addOrUpdateSubmission } = useSubmissionContext();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [yearLevel, setYearLevel] = useState("Select");
  const [course, setCourse] = useState("Select");

  // 🔴 Error States
  const [nameError, setNameError] = useState("");
  const [subjectError, setSubjectError] = useState("");

  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.name) {
      setName(params.name as string);
    }
  }, [params.name]);

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

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    let hasError = false;

    // Reset error messages
    setNameError("");
    setSubjectError("");

    // Validate name
    if (!name) {
      setNameError("Name is required.");
      hasError = true;
    } else if (/\d/.test(name)) {
      setNameError("Name must not contain numbers.");
      hasError = true;
    }

    // Validate subject
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

    if (!grade || yearLevel === "Select" || course === "Select") {
      Alert.alert("Please fill in all fields, including Year Level and Course.");
      hasError = true;
    }

    if (hasError) return;

    addOrUpdateSubmission({ image, name, subject, grade, yearLevel, course });

    Alert.alert(
      "Submission Successful",
      `Name: ${name}\nSubject: ${subject}\nCollege Grade: ${grade}\nYear Level: ${yearLevel}\nCourse: ${course}`,
      [
        {
          text: "OK",
          onPress: () => {
            setName("");
            setSubject("");
            setGrade("");
            setYearLevel("Select");
            setCourse("Select");
            setImage(null);
            router.push("/(tabs)/Submissions");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.fixedPhotoContainer}>
        <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Tap to upload photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
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
        <Text style={styles.errorText}>{nameError}</Text>

        <Text style={styles.label}>Select Year Level:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={yearLevel}
            onValueChange={(value: string) => setYearLevel(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Year Level" value="Select" />
            <Picker.Item label="1st Year" value="1st Year" />
            <Picker.Item label="2nd Year" value="2nd Year" />
            <Picker.Item label="3rd Year" value="3rd Year" />
            <Picker.Item label="4th Year" value="4th Year" />
          </Picker>
        </View>

        <Text style={styles.label}>Select Course:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={course}
            onValueChange={(value: string) => setCourse(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Course" value="Select" />
            <Picker.Item label="BS Criminology" value="BS Criminology" />
            <Picker.Item label="BS Information Technology" value="BS Information Technology" />
            <Picker.Item label="BS Hospitality Management" value="BS Hospitality Management" />
            <Picker.Item label="BS Tourism Management" value="BS Tourism Management" />
            <Picker.Item label="BS Education" value="BS Education" />
            <Picker.Item label="BS Accounting Management" value="BS Accounting Management" />
          </Picker>
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
        <Text style={styles.errorText}>{subjectError}</Text>

        <Text style={styles.label}>Enter College Grade:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="College Grade (e.g., 1.0-5.0)"
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fixedPhotoContainer: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
    zIndex: 1,
  },
  photoContainer: {
    alignSelf: "center",
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
    fontSize: 12,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
    minHeight: 18, // reserve height to avoid layout shift
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
