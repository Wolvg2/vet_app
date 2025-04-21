import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  initializeAuth, 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  UserCredential,
  getReactNativePersistance } from "firebase/auth";


import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where
} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);
const auth = getAuth(app);

const db = getFirestore(app);

onAuthStateChanged(
    auth,
    user => {
      if (user){
        console.log("User is validated " + user.email);
      } else {
        console.log("logged out");
      }
    }
  );

export default function App() {
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TextInput
      placeholder='email'
      onChangeText={text =>{
        setEmail(text);
      }}/>

      <TextInput
      placeholder='password'
      onChangeText={text => {
        setPassword (text);
      }}
      />
      <Button
      title="Registrarse"
      onPress={() => {
        createUserWithEmailAndPassword(auth,email,password).then((userCredential: UserCredential)=>{
          console.log("Usuario registrado: "+userCredential.user.email);
        })
        .catch(error => {
          if(error.code == "auth/password")
            alert("Ponle password");

          console.log("Error"+error.message + "" +error.code); 
        });
        
      }}
      />
      <Button
      title="Entrar"
      onPress={() => {
        signInWithEmailAndPassword(auth,email,password).then((userCredential: UserCredential)=>{
          console.log("Usuario validado: "+ userCredential.user.email);
        })
        .catch(error => {
          console.log("Error: "+ error);
        })
      }}
      />
      <Button
      title="Salir"
      onPress={() => {
        auth.signOut();
      }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderBlockColor: '#65CEB9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
