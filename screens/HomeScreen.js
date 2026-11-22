import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LucideIcon } from '@react-native-vector-icons/lucide';
import { HeartPulse, MapPin, Camera, History, BookOpen } from 'lucide-react-native';
import user from '../processHandlers/userHandler.js';

export default function HomeScreen({ navigation }) {

    let user = user; 

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>SkinScan</Text>
                    <Text style={styles.subtitle}>
                        Welcome to SkinScan, AI-powered skin monitoring
                    </Text>
                    <Text>{user ? user.email : 'Not logged in'}</Text>
                </View>

                <HeartPulse size={30} color="#DC4545" />
            </View>

            <Pressable
                style={styles.scanButton}
                onPress={() => navigation.navigate('Scan')}
            >
                <Camera size={28} color="#FFFFFF" />
                <Text style={styles.scanButtonText}>New Scan</Text>
            </Pressable>

            <View style={styles.secondaryButtons}>

                <Pressable
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('History')}
                >
                    <History size={24} color="#1769AA" />

                    <View style={styles.secondaryTextContainer}>
                        <Text style={styles.secondaryButtonText}>
                            Previous Scans
                        </Text>
                        <Text style={styles.secondarySubtitle}>
                            Your skin health documented over time.
                        </Text>
                    </View>
                </Pressable>

                <Pressable
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('Map')}
                >
                    <MapPin size={24} color="#1769AA" />

                    <View style={styles.secondaryTextContainer}>
                        <Text style={styles.secondaryButtonText}>
                            Hospitals Nearby
                        </Text>
                        <Text style={styles.secondarySubtitle}>
                            Find the nearest hospital.
                        </Text>
                    </View>
                </Pressable>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10,
        paddingTop: 10,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 35,
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#172B45',
    },

    subtitle: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 5,
    },

    scanButton: {
        backgroundColor: '#1769AA',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        gap: 12,
    },

    scanButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    secondaryButtons: {
        flexDirection: 'row',
        gap: 12,
    },

    secondaryButton: {
        backgroundColor: '#F1F3F5',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 15,
        borderRadius: 12,
        gap: 10,
    },

    secondaryTextContainer: {
        flex: 1,
        flexDirection: 'column',
    },

    secondaryButtonText: {
        color: '#263445',
        fontSize: 14,
        fontWeight: 'bold',
    },

    secondarySubtitle: {
        color: '#64748B',
        fontSize: 12,
        marginTop: 4,
    },
});