import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShowWallet = ({navigation}:any) => {
  const [currentAmount , setCurrentAmount] = useState<number>(0);
  const [errorMessage , setErrorMessage] = useState<string>('');

  const fetchCurrentAmount = async ()=>{
    const token = await AsyncStorage.getItem("token");
    if (!token) {
        console.error("Token not found!");
        throw new Error("Authentication token is missing.");
      }
    const res = await fetch('http://192.168.1.4:7000/wallet/checkWallet' , {
        method:'GET',
        headers:{
            "x-access-token":token
        },
    })
    const data = await res.json();
    if(res.status!=200){
        setErrorMessage(data.error);
        return;
    }
    console.log("data ",data);
    console.log("amount ",data.amount);
    setCurrentAmount(data.amount);
  }

  useEffect(()=>{
    fetchCurrentAmount();
  } , []);
  return (
    <View style={styles.container}>
      <Text> ShowWallet </Text>
       <Text style={styles.errorMessage}> {errorMessage} </Text>
       <Text>Current Amount: {currentAmount} Rs</Text>
    </View>
  )
}

export default ShowWallet

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    errorMessage:{
     fontSize:22,
     color:'red',
     fontWeight:600,
    }
})