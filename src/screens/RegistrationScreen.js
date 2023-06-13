import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const navigation = useNavigation();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleSignUp = async (data) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      console.log("Registered with:", user.email);

      // Store additional user information in Firestore
      await setDoc(doc(db, "users", user.uid), { name: data.name });
      setIsPopupVisible(true);
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
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        }}
      />
      <KeyboardAvoidingView style={styles.inputContainer}>
        <Controller
          control={control}
          rules={{
            required: "Campo obrigatório",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Nome"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="name"
        />
        {errors.name && (
          <Text style={styles.errorText}>*{errors.name.message}</Text>
        )}
        <Controller
          control={control}
          rules={{
            required: "Campo obrigatório",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Endereço de email inválido",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="E-mail"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text style={styles.errorText}>*{errors.email.message}</Text>
        )}
        <Controller
          control={control}
          rules={{
            required: "Campo obrigatório",
            validate: {
              minLength: (value) =>
                value.length >= 8 || "A senha deve ter pelo menos 8 caracteres",
              upperCase: (value) =>
                /[A-Z]/.test(value) ||
                "A senha deve conter pelo menos um caractere maiúsculo",
              number: (value) =>
                /\d/.test(value) || "A senha deve conter pelo menos um número",
              specialChar: (value) =>
                /[!@#$%^&*]/.test(value) ||
                "A senha deve conter pelo menos um caractere especial",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Senha"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              secureTextEntry
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text style={styles.errorText}>*{errors.password.message}</Text>
        )}
      </KeyboardAvoidingView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSubmit(handleSignUp)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => {}} style={styles.iconContainer}>
          <Image style={styles.icons} source={googleIcon} />
        </TouchableOpacity>
      </View>
      <View style={[styles.buttonContainer, styles.loginButtonContainer]}>
        <Text>Já tem uma conta? Faça seu login.</Text>
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
    marginTop: "50%",
    alignItems: "center",
    justifyContent: "center",
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
    position: "static",
    bottom: 0,
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
  errorText: {
    color: "red",
  },
});
