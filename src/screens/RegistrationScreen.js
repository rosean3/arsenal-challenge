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
import { React, useState, useEffect } from "react";
import { firebaseAuth, db } from "../../firebase";
import auth from "@react-native-firebase/auth";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import PopupComponent from "../components/PopUpComponent";
const googleIcon = require("../../assets/googleIcon.png");
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "532114080761-7la7296o1bc3poisd6g9nij198knnhce.apps.googleusercontent.com",
});

async function onGoogleButtonPress() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const { idToken } = await GoogleSignin.signIn();

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  return auth().signInWithCredential(googleCredential);
}

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
    mode: "onChange",
  });

  const navigation = useNavigation();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleSignUp = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      console.log("Registered with:", user.email);

      await setDoc(doc(db, "users", user.uid), { name: data.name });
      setIsPopupVisible(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    onGoogleButtonPress()
      .then(async (user) => {
        const name = user.additionalUserInfo.profile.name;
        const uid = user.user.uid;
        await setDoc(doc(db, "users", uid), { name });
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      })
      .catch((error) => {
        alert(error.message);
      });
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
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignUp}
        >
          <Image source={googleIcon} style={styles.logo} />
          <Text style={styles.text}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.buttonContainer, styles.loginButtonContainer]}>
        <Text>
          Já tem uma conta? Faça seu{" "}
          <Text
            style={styles.textLink}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            LOGIN
          </Text>
        </Text>
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
    marginBottom: 30,
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
  icons: {
    width: 35,
    height: 35,
  },
  iconsContainer: {
    paddingTop: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  errorText: {
    color: "red",
  },
  textLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: "#757575",
  },
});
