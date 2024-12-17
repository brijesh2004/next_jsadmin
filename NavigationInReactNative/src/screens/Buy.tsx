import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Buy = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('food'); // Default category
    const [amount, setAmount] = useState(''); // Amount entered by the user

    const handleBuy = async () => {
        if (!amount) {
            Alert.alert('Validation Error', 'Please enter an amount!');
            return;
        }
        Alert.alert(
            'Purchase Details',
            `Category: ${selectedCategory}\nAmount: ₹${amount}`
        );

        const token = await AsyncStorage.getItem("token");
        const type = "Debit";
        if (!token) {
            console.error("Token not found!");
            throw new Error("Authentication token is missing.");
        }
        const res = await fetch("http://192.168.1.4:7000/transaction/buy", {
            method: 'POST',
            headers: {
                "x-access-token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ type, amount, category: selectedCategory }),
            credentials: 'include',
        })

        const data = await res.json();
        if (res.status !== 201) {
            Alert.alert(data.error);
            return;
        }
        Alert.alert(data.message);
        setAmount('');
        setSelectedCategory('food');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Buy</Text>

            {/* Dropdown for selecting a category */}
            <Text style={styles.label}>Select Category:</Text>
            <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Food" value="food" />
                <Picker.Item label="Clothes" value="clothes" />
                <Picker.Item label="Other" value="other" />
            </Picker>

            {/* Input field for entering the amount */}
            <Text style={styles.label}>Enter Amount:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => setAmount(text)}
            />

            {/* Button to submit the transaction */}
            <Button title="Submit" onPress={handleBuy} />
        </View>
    );
};

export default Buy;

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
