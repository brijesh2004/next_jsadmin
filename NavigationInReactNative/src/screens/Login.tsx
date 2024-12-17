import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Pressable } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}:any) => {
//   const navigate = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
     if (!email || !password) {
       Alert.alert('Validation Error', 'All fields are required!');
       return;
     }
   
     try {
         const response = await fetch('http://192.168.1.4:7000/user/login', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({email, password}),
         credentials: 'include', 
       });
   
       if (response.status!==201) {
         const errorData = await response.json();
         Alert.alert('Registration Error', errorData.error || 'Something went wrong!');
         return;
       }
   
       const data = await response.json();
       console.log(data);
       const token = data.token;
       console.log("Token:",token);
       await AsyncStorage.setItem("token" , token);
       const tk = await AsyncStorage.getItem("token");
       console.log("tk" , tk);
       
       Alert.alert('Registration Successful', `Welcome, ${email}!`);

        navigation.replace('Home');
     } catch (error) {
       console.error('Registration Error:', error);
       Alert.alert('Error', 'Unable to register. Please try again later.');
     }
   };


   
  useEffect(()=>{
    const isLogin=async ()=>{
        const token = await AsyncStorage.getItem("token");
        if(token){
            navigation.replace('Home');
        }
       }
       isLogin();
  },[]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email or username"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don't have an account? 
        <Pressable onPress={()=>navigation.replace('Register')}>
            <Text  style={styles.linkText}>Sign up</Text>
        </Pressable>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    color: '#666',
    fontSize: 14,
  },
  linkText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default Login;
