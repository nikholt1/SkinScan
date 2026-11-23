
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    Pressable
} from 'react-native';

import {
    HeartPulse,
    MapPin,
    Camera,
    History,
    BookOpen
} from 'lucide-react-native';
// import ThreeScene from '../processHandlers/threeSceneHandler.js';
// import { getImages } from '../processHandlers/imageHandler.js';

export default function HistoryScreen( { navigation } ) {

    // TEST IMAGES
    const images = [
        {
            id: 'test1',
            image: 'https://treatcancer.com/wp-content/uploads/2022/08/Normal-mole-2.png',
            timeStamp: '16.11.2026, 15.02.00',
            journal: 'Patient feels mild disconfort and itchiness. Initial observation does not show any signs of melanoma',
            name: 'John Doe', 
            verdict: 0.4,
            reportedBy: 'Dr. Jane Doe'
        },
        {
            id: 'test2',
            image: 'https://patch.com/img/cdn/users/2587664/2014/11/raw/546d5945cd6a9.jpg',
            timeStamp: '17.11.2026, 10.30.00',
            journal: 'Patient feels strong disconfort, itchiness and pain around the skin mold. Initial observation show mild signs of melanoma, with dark edges around the mold reaching out through the initial normal mold edges.',
            name: 'John Doe', 
            verdict: 0.65,
            reportedBy: 'Dr. Jane Doe'
        }
    ];

    // REAL FIREBASE IMAGES
    /*
    const [images, setImages] = useState([]);

    useEffect(() => {
        const unsubscribe = getImages(setImages);

        return () => unsubscribe();
    }, []);
    */ 

    const [expandedJournal, setExpandedJournal] = useState(null);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>

            {images.map((item) => (
                <View key={item.id} style={styles.card}>

                    
                    <Image
                        source={{ uri: item.image }}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                    {/* <ThreeScene /> */}
                    
                    <View style={styles.cardContainer}>

                        <Text style={styles.patientName}>{item.name}</Text>
                        <View style={styles.cardHeader}>

                           
                            <View style={styles.timestampContainer}>
                                <History size={24} color="#1769AA" />
                                
                                <Text style={styles.cardTimeStamp}>
                                    {item.timeStamp}
                                </Text>
                            </View>

                            
                            <View style={styles.verdictHeader}>

                                <Text style={styles.verdictLabel}>
                                    AI-Verdict
                                </Text>

                                <Text style={styles.verdictNumber}>
                                    {(item.verdict * 100).toFixed(0)}%
                                </Text>

                                <HeartPulse
                                    size={35}
                                    color="#dc4545"
                                />

                            </View>

                        </View>

                        
                        <View style={styles.cardFooter}>
                            <Pressable
                                style={styles.journal}
                                onPress={() => setExpandedJournal(
                                    expandedJournal === item.id ? null : item.id
                                )}
                            >
                                <View style={styles.journalHeader}>
                                    <Text style={styles.journalPress}>Journal</Text>
                                </View>

                                {expandedJournal === item.id && (
                                    <Text style={styles.journalText}>
                                        {item.journal}
                                    </Text>
                                )}
                            </Pressable>
                            
                            <Text style={styles.verdictDescription}>
                                {item.verdict > 0.5
                                    ? 'The AI-scan showed a '+ (item.verdict * 100).toFixed(0) + '% chance of melanoma. The verdict indicates that the skin abnormality must be viewed by a skin professional.'
                                    : 'The AI-scan showed a '+ (item.verdict * 100).toFixed(0) + '%, which is under the abnormality rate, if the patient feels itchyness or pain around the skin abnormality, further inspect or run a new scan.'}
                            </Text>
                            <Text style={styles.reportedBy}>{item.reportedBy}</Text>
                            {item.verdict > 0.5 && (
                                <Pressable
                                    style={styles.actionButton}
                                    onPress={() => navigation.navigate('Map')}
                                >
                                    <Text style={styles.buttonText} >
                                        Hospitals
                                    </Text>
                                </Pressable>
                            )}

                        </View>

                    </View>

                </View>
            ))}

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    scrollContainer: {
        padding: 12,
        gap: 24,
    },

    card: {
        width: '100%',
    },

    cardImage: {
        width: '100%',
        height: 260,
        borderRadius: 14,
        backgroundColor: '#D3D3D3',
    },

    cardContainer: {
        backgroundColor: '#E5E5E5',
        marginTop: -10,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        padding: 16,
        paddingTop: 22,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    timestampContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    cardTimeStamp: {
        color: '#444',
        fontSize: 13,
    },

    verdictHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },

    verdictLabel: {
        color: '#444',
        fontSize: 13,
        fontWeight: '600',
    },

    verdictNumber: {
        fontSize: 23,
        fontWeight: 'bold'
    },

    cardFooter: {
        marginTop: 20,
        alignItems: 'flex-start',
    },
    patientName: {
        fontSize: 23,
        fontWeight: 'bold'
    },
    journal: {
        width: '100%',
        marginBottom: 15,
    },

    journalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },

    journalPress: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#1769AA',
    },


    journalText: {
        display: 'flex',
        fontSize: 13,
        lineHeight: 19,
        color: '#000000',
    },
    verdictDescription: {
        fontSize: 13,
        color: '#555',
        lineHeight: 19,
        marginBottom: 12,
    },
    reportedBy: {
        fontWeight: 'bold',
        marginBottom: 5,
    },

    actionButton: {
        backgroundColor: '#dc4545',
        paddingVertical: 9,
        paddingHorizontal: 16,
        borderRadius: 8,
    },

    buttonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 13,
    },

});
