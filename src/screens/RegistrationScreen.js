import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { React, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import PopupComponent from "../components/PopUpComponent";
const googleIcon = require("../../assets/googleIcon.png");

const RegistrationScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigation = useNavigation();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsPopupVisible(true);
      }
    });

    return () => {
      unsubscribe();
      setEmail("");
      setPassword("");
      setName("");
      setIsPopupVisible(false);
    };
  }, []);

  const handleSignUp = async () => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Registered with:", user.email);

      // Store additional user information in Firestore
      await setDoc(doc(db, "users", user.uid), { name });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container} behavior="padding">
      <PopupComponent
        isVisible={isPopupVisible}
        onPress={() => {
          setIsPopupVisible(false);
          navigation.replace("Home");
        }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nome"
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="E-mail"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => {}} style={styles.iconContainer}>
          <Image style={styles.icons} source={googleIcon} />
        </TouchableOpacity>
      </View>
      <View style={[styles.buttonContainer, styles.loginButtonContainer]}>
        <Text>Já tem uma conta? Faça seu login</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: "70%",
    alignItems: "center",
    flex: 1,
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  loginButtonContainer: {
    marginTop: "25%",
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 10,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  icons: {
    width: 35,
    height: 35,
  },
  iconContainer: {
    borderRadius: 50,
    backgroundColor: "grey",
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconsContainer: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "60%",
  },
});
