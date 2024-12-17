import { StyleSheet, Text, View, Button, Pressable } from 'react-native'
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.pressButton}
        onPress={() => navigation.navigate('ShowWallet')}>
        <Text style={styles.smallText}>Show Wallet Balace</Text>
      </Pressable>
      <Pressable
      style={styles.pressButton}
      onPress={()=>navigation.navigate('AddTransaction')}>
      <Text style={styles.smallText}>Add Transaction</Text>
      </Pressable>
      <Pressable
      style={styles.pressButton}
      onPress={()=>navigation.navigate('TransactionHistory')}>
        <Text style={styles.smallText}>Transaction History</Text>
      </Pressable>
      <Pressable
      style={styles.pressButton}
      onPress={()=>navigation.navigate('Buy')}>
        <Text style={styles.smallText}>Buy</Text>
      </Pressable>
      <Pressable
      style={styles.logout}
      onPress={async ()=>{
        AsyncStorage.clear()
        navigation.navigate('Login')
      }
        }>
        <Text style={styles.smallText}>Logout</Text>
      </Pressable>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressButton: {
    justifyContent:'center',
    alignItems:'center',
    width: 160,
    height: 45,
    backgroundColor: '#6A89CC',
    borderRadius:10,
    margin:15,
  },
  smallText: {
    color: '#ffffff',
    fontSize:18,
    fontWeight:'bold',
  },
  logout:{
    justifyContent:'center',
    alignItems:'center',
    width: 160,
    height: 45,
    backgroundColor: 'red',
    borderRadius:10,
    margin:15,
  }
})