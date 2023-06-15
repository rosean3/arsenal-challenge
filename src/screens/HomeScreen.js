import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { signOut as signOutFirebase } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { firebaseAuth, db } from "../../firebase";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [userEmail, setEmail] = useState("");

  useEffect(() => {
    fetchUserData();
    fetchGoogleUserData();
  }, []);

  const fetchUserData = () => {
    const currentUser = firebaseAuth.currentUser;
    if (!currentUser) return;

    const userDoc = doc(db, "users", currentUser.uid);
    setEmail(currentUser.email);

    getDoc(userDoc)
      .then((userSnapshot) => {
        if (userSnapshot.exists()) {
          setUserName(userSnapshot.data().name);
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const fetchGoogleUserData = () => {
    GoogleSignin.isSignedIn()
      .then((isSignedIn) => {
        if (!isSignedIn) return;

        GoogleSignin.signInSilently()
          .then((userInfo) => {
            console.log("userInfo:", userInfo);
            setUserName(userInfo.user.name);
            setEmail(userInfo.user.email);
          })
          .catch(console.error);
      })
      .catch(console.error);
  };

  const handleSignOut = async () => {
    await signOutGoogle();
    await signOutFirebaseAuth();
    navigation.replace("Registration");
  };

  const signOutGoogle = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!isSignedIn) return;

    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      console.log("User signed out from Google");
    } catch (error) {
      console.error(error);
    }
  };

  const signOutFirebaseAuth = async () => {
    const currentUser = firebaseAuth.currentUser;
    if (!currentUser) return;

    try {
      await signOutFirebase(firebaseAuth);
      console.log("User signed out from Firebase");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Bem vinde, {userName}!</Text>
      <Text>Email: {userEmail}</Text>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

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

export default HomeScreen;
