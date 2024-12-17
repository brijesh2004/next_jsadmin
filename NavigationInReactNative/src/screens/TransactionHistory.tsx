import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]); // State to store fetched transactions
  const [loading, setLoading] = useState(false); // State to manage loader
  const [error, setError] = useState(''); // State to handle errors
  const [selectedDate, setSelectedDate] = useState(''); // State to store selected date

  // Function to fetch transaction history
  const fetchTransactionHistory = async (date = '') => {
    try {
      setLoading(true);
      setError('');
      let url = 'http://192.168.1.4:7000/transaction/history';
      if (date) {
        url += `?date=${date}`;
      }
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token Not found");
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "x-access-token": token
        },
      }

      );
      const data = await response.json();

      if (response.ok) {
        setTransactions(data);
      } else {
        setError(data.error || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError('Network error: Unable to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory(); // Initial fetch with no date
  }, []);

  const handleDateSubmit = () => {
    if (selectedDate.trim()) {
      fetchTransactionHistory(selectedDate);
    } else {
      setError('Please enter a valid date (dd-mm-yyyy)');
    }
  };

  // Render each transaction item
  const renderTransaction = ({ item }: any) => (
    <View style={styles.transactionItem}>
      <Text style={styles.type}>Type: {item.type}</Text>
      <Text style={styles.amount}>Amount: ${item.amount}</Text>
      <Text style={styles.category}>Category: {item.category}</Text>
      <Text>Date: {new Date(item.createdAt).toUTCString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>

      {/* Date Picker Input */}
      <View style={styles.datePickerContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor='black'
          placeholder="Enter date (dd-mm-yyyy)"
          value={selectedDate}
          onChangeText={(text) => setSelectedDate(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleDateSubmit}>
          <Text style={styles.buttonText}>Fetch</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderTransaction}
        />
      )}
    </View>
  );
};

export default TransactionHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    color: 'black',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  transactionItem: {
    backgroundColor: '#ffffff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  amount: {
    fontSize: 14,
    color: '#4caf50',
  },
  category: {
    fontSize: 14,
    color: '#757575',
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
