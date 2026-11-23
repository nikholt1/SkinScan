
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, Text, TextInput, Pressable } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { Hospital } from 'lucide-react-native';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

export default function MapScreen() {


    const [location, setLocation] = useState(null);
    const [trackUser, setTrackUser] = useState(true);
    const [hospitals, setHospitals] = useState([]);
    const [moles, setMoles] = useState([]);
    const mapRef = useRef(null);
    const trackUserRef = useRef(true);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);

    const [showNewArea, setShowNewArea] = useState(false);
    const [newAreaCoordinates, setNewAreaCoordinates] = useState(null);
    const [newAreaName, setNewAreaName] = useState('');
    const [newAreaRadius, setNewAreaRadius] = useState('100');

    useEffect(() => {
        let locationSubscription;

        async function getHospitals() {
            try {
                const snapshot = await getDocs(collection(db, 'hospitals'));

                const hospitalList = snapshot.docs.map(doc => {
                    const data = doc.data();

                    return {
                        id: doc.id,
                        name: data.name,
                        latitude: data.latitude,
                        longitude: data.longitude,
                    };
                });

                setHospitals(hospitalList);

            } catch (error) {
                console.error('Error fetching hospitals:', error);
            }
        }

        async function getRegisteredMoles() {
            try {
                const snapshot = await getDocs(collection(db, 'moles'));

                const moleList = snapshot.docs.map(doc => {
                    const data = doc.data();

                    return {
                        id: doc.id,
                        reportedBy: data.reportedBy,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        verdict: (data.verdict * 100).toFixed(0),
                    };
                });

                setMoles(moleList);

            } catch (error) {
                console.error('Error fetching moles:', error);
            }
        }
        async function getAreas() {
            try {
                const snapshot = await getDocs(collection(db, 'areas'));

                const areaList = snapshot.docs.map(doc => {
                    const data = doc.data();

                    return {
                        id: doc.id,
                        latitude: Number(data.latitude),
                        longitude: Number(data.longitude),
                        radius: Number(data.radius),
                    };
                });


                setAreas(areaList);
            } catch (error) {
                console.error('Error fetching areas:', error);
            }
            
        }
        

        async function getLocation() {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location permission is required.');
                return;
            }

            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const initialLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };

            setLocation(initialLocation);

            // await getHospitals(
            //     initialLocation.latitude,
            //     initialLocation.longitude
            // );
            await getHospitals();
            await getRegisteredMoles();
            await getAreas();

            locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 2000,
                    distanceInterval: 0.1,
                },
                (position) => {
                    const newLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    setLocation(newLocation);

                    if (trackUserRef.current) {
                        mapRef.current?.animateToRegion({
                            ...newLocation,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }, 500);
                    }
                }
            );
        }

        
        getLocation();

        

        return () => {
            locationSubscription?.remove();
        };
    }, []);

    const handlePanDrag = () => {
        trackUserRef.current = false;
        setTrackUser(false);
    };

    const initialRegion = {
        latitude: 55.6761,
        longitude: 12.5683,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };


    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000; // Earth radius in meters

        const toRad = (degrees) => degrees * Math.PI / 180;

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function getMedian(values) {
        if (values.length === 0) return null;

        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);

        return sorted.length % 2 !== 0
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    function getAreaDisplay(area) {

        
        const areaMoles = moles.filter(mole => {
            const distance = getDistance(
                area.latitude,
                area.longitude,
                mole.latitude,
                mole.longitude
            );

            return distance <= area.radius;
        });

        
        const verdicts = areaMoles.map(mole => mole.verdict);

       
        const median = getMedian(verdicts);

        if (median === null) return "No data";

        return `${median}%`;
    }
    function handleLongPress(event) {
        const { coordinate } = event.nativeEvent;

        setNewAreaCoordinates(coordinate);
        setNewAreaName('');
        setNewAreaRadius('100');
        setShowNewArea(true);
    }

    async function saveNewArea() {
        const radius = Number(newAreaRadius) * 1000;

        if (!newAreaName.trim()) {
            Alert.alert('Error', 'Enter an area name.');
            return;
        }

        if (!Number.isFinite(radius) || radius <= 0) {
            Alert.alert('Error', 'Enter a valid radius.');
            return;
        }

        const newArea = {
            name: newAreaName.trim(),
            latitude: newAreaCoordinates.latitude,
            longitude: newAreaCoordinates.longitude,
            radius,
        };

        try {
            const docRef = await addDoc(collection(db, 'areas'), newArea);

            setAreas(prevAreas => [
                ...prevAreas,
                {
                    id: docRef.id,
                    ...newArea,
                }
            ]);

            setShowNewArea(false);

        } catch (error) {
            console.error('Error saving area:', error);
            Alert.alert('Error', 'Could not save area.');
        }
    }


    return (
        <View style={styles.container}>

            {showNewArea && (
                <View style={styles.newAreaContainer}>
                    <Text style={styles.newAreaText}>Add new Area</Text>

                    <TextInput
                        style={styles.newAreaInput}
                        placeholder="Enter area name"
                        value={newAreaName}
                        onChangeText={setNewAreaName}
                    />

                    <TextInput
                        style={styles.newAreaInput}
                        placeholder="Enter area radius"
                        keyboardType="numeric"
                        value={newAreaRadius}
                        onChangeText={setNewAreaRadius}
                    />

                    <Pressable
                        style={styles.newAreaButton}
                        onPress={saveNewArea}
                    >
                        <Text style={styles.newAreaButtonText}>Save Area</Text>
                    </Pressable>

                    <Pressable onPress={() => setShowNewArea(false)}>
                        <Text style={{ textAlign: 'center', marginTop: 10 }}>
                            Cancel
                        </Text>
                    </Pressable>
                </View>
            )}

            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={initialRegion}
                onPanDrag={handlePanDrag}
                showsUserLocation={true}
                showsMyLocationButton={true}
                onLongPress={handleLongPress}
                
            >
            {hospitals.map((hospital) => (
                <Marker
                    key={hospital.id}
                    coordinate={{
                        latitude: Number(hospital.latitude),
                        longitude: Number(hospital.longitude),
                    }}
                    title={hospital.name}
                    description="Hospital"
                >
                    <View style={{
                        backgroundColor: 'white',
                        padding: 6,
                        borderRadius: 20,
                        elevation: 5,
                    }}>
                        <Hospital size={32} color="red" />
                    </View>
                </Marker>
            ))}
            {moles.map((mole) => (
                <Marker
                    key={mole.id}
                    coordinate={{
                        latitude: Number(mole.latitude),
                        longitude: Number(mole.longitude),
                    }}
                    title={mole.reportedBy}
                    description={`Verdict: ${mole.verdict}%`}
                />
            ))}
            {areas.map((area) => (
        <React.Fragment key={area.id}>
            <Circle
                center={{
                    latitude: area.latitude,
                    longitude: area.longitude,
                }}
                radius={area.radius}
                strokeColor="rgba(0, 120, 255, 0.9)"
                fillColor="rgba(0, 120, 255, 0.15)"
                strokeWidth={2}
            />

            <Marker
                coordinate={{
                    latitude: area.latitude + (area.radius / 111320),
                    longitude: area.longitude,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
            >
                <Text style={{ fontWeight: 'bold', color: 'blue' }}>
                    {getAreaDisplay(area)}
                </Text>
            </Marker>
        </React.Fragment>
    ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    newAreaContainer: {
        position: 'absolute',
        top: 50,
        alignSelf: 'center',
        width: '90%',
        maxWidth: 400,
        zIndex: 100,
        elevation: 10,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 16,
        gap: 12,
    },

    newAreaText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#202833',
        marginBottom: 5,
    },

    newAreaInput: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DCE3EA',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 15,
        fontSize: 16,
        color: '#202833',
    },

    newAreaButton: {
        backgroundColor: '#0078FF',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },

    newAreaButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
