import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const navigation = useNavigation();

  const handleLogin = async (data) => {
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Logged in with:", user.email);
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
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <ControllerInput
          control={control}
          name="email"
          rules={emailRules}
          placeholder="E-mail"
        />
        {errors.email && <ErrorText message={errors.email.message} />}
        <ControllerInput
          control={control}
          name="password"
          rules={passwordRules}
          placeholder="Senha"
          secureTextEntry
        />
        {errors.password && <ErrorText message={errors.password.message} />}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSubmit(handleLogin)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const emailRules = {
  required: "Campo obrigatório",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    message: "Endereço de email inválido",
  },
};

const passwordRules = {
  required: "Campo obrigatório",
};

const ControllerInput = ({ control, name, rules, ...props }) => (
  <Controller
    control={control}
    rules={rules}
    render={({ field: { onChange, onBlur, value } }) => (
      <TextInput
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        style={styles.input}
        {...props}
      />
    )}
    name={name}
  />
);

const ErrorText = ({ message }) => (
  <Text style={styles.errorText}>*{message}</Text>
);

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
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
  errorText: {
    color: "red",
  },
});
