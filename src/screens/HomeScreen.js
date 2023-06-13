import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { React, useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      getDoc(userDoc)
        .then((userSnapshot) => {
          if (userSnapshot.exists()) {
            setUserName(userSnapshot.data().name);
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  }, [auth.currentUser]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Registration");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Bem vinde, {userName}!</Text>
      <Text>Email: {auth.currentUser?.email}</Text>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
