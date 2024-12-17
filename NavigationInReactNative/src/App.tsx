import { StyleSheet, Text, View } from 'react-native'
import React from 'react'


// Navigation 
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens 
import Home from './screens/Home';
import Details from './screens/Details';
import Login from './screens/Login';
import Register from './screens/Register';
import ShowWallet from './screens/ShowWallet';
import AddTransaction from './screens/AddTransaction';
import Buy from './screens/Buy';
import TransactionHistory from './screens/TransactionHistory';
// export type RootStackParamList ={
//   Home:undefined,
//   Details:{productId:string}
// }

const Stack = createNativeStackNavigator()
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
         <Stack.Screen
         name='Login'
         component={Login}
         options={{
          title:"Login Page"
         }}/>

          <Stack.Screen
         name='Register'
         component={Register}
         options={{
          title:"Register Page"
         }}/>
          <Stack.Screen
         name='Home'
         component={Home}
         options={{
          title:"Welcome Page"
         }}/>
          <Stack.Screen
         name='ShowWallet'
         component={ShowWallet}
         options={{
          title:"Wallet Page"
         }}/>
          <Stack.Screen
         name='AddTransaction'
         component={AddTransaction}
         options={{
          title:"Add Money to Wallet"
         }}/>
          <Stack.Screen
         name='Buy'
         component={Buy}
         options={{
          title:"Buy"
         }}/>
          <Stack.Screen
         name='TransactionHistory'
         component={TransactionHistory}
         options={{
          title:"History"
         }}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  }
})