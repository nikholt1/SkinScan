import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { HeartPulse } from 'lucide-react-native';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';

import { auth } from '../firebase.js'; 

export default function LoginScreen({ navigation }) {

    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return unsubscribe;
    }, []);

    async function logIn() {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Login failed:', error.code, error.message);
        }
    }

    return (
    <View style={styles.container}>
      <HeartPulse size={60} color="#DC4545" />
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Adgangskode"  value={password} onChangeText={setPassword} secureTextEntry />
      <Pressable style={styles.button} role="button"  testID="logind" onPress={logIn}>
        <Text style={styles.buttonText}>Log ind</Text>
      </Pressable>
    </View>
    );
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        padding: 25,
        backgroundColor: '#F4F7FA',
        gap: 18,
    },

    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1769AA',
        marginBottom: 15,
        textAlign: 'center',
    },

    input: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DCE3EA',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 15,
        fontSize: 16,
        color: '#202833',
    },

    button: {
        alignSelf: 'center',
        backgroundColor: '#1769AA',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 12,
        minWidth: 180,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});