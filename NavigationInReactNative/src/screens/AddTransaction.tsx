import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTransaction = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('saving'); // Default value
  const [amount, setAmount] = useState(''); // To store the entered amount
  console.log(selectedCategory , amount);

  const handleAddTransaction = async () => {
    if (!amount) {
      Alert.alert('Validation Error', 'Please enter an amount!');
      return;
    }
    Alert.alert(
      'Transaction Added',
      `Category: ${selectedCategory}\nAmount: ₹${amount}`
    );
    const token = await AsyncStorage.getItem("token");
    if (!token) {
        console.error("Token not found!");
        throw new Error("Authentication token is missing.");
      }
      const type = 'Credit';
    const res = await fetch("http://192.168.1.4:7000/wallet/addtowallet",{
        method:'POST',
        headers:{
            "x-access-token":token,
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({type , amount ,category:selectedCategory}),
        credentials: 'include', 
    })
    const data = await res.json();
    if(res.status!==201){
        Alert.alert(data.error);
        return;
    }
    Alert.alert(data.message);
    setAmount('');
    setSelectedCategory('saving');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Transaction</Text>

      {/* Dropdown to select the category */}
      <Text style={styles.label}>Select Category:</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Saving" value="saving" />
        <Picker.Item label="Salary" value="salary" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      {/* Input field for the amount */}
      <Text style={styles.label}>Enter Amount:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric" // Ensures numeric input
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />

      {/* Add Transaction Button */}
      <Button title="Add Transaction" onPress={handleAddTransaction} />
    </View>
  );
};

export default AddTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    marginBottom: 20,
    backgroundColor: '#e8e8e8',
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});
