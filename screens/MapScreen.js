
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Hospital } from 'lucide-react-native';


export default function MapScreen() {


    const [location, setLocation] = useState(null);
    const [trackUser, setTrackUser] = useState(true);
    const [hospitals, setHospitals] = useState([]);

    const mapRef = useRef(null);
    const trackUserRef = useRef(true);

    useEffect(() => {
        let locationSubscription;

        async function getHospitals(latitude, longitude) {
            try {
                const query = `
                    [out:json][timeout:60];
                    (
                        nwr(around:20000,${latitude},${longitude})["amenity"="hospital"];
                        nwr(around:20000,${latitude},${longitude})["healthcare"="hospital"];
                        nwr(around:20000,${latitude},${longitude})["healthcare"="dermatology"];
                    );
                    out center;
                `;

                const response = await fetch(
                    'https://ovp.dresel.systems/api/interpreter',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: `data=${encodeURIComponent(query)}`,
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error  ${response.status}`);
                }

                const json = await response.json();

                console.log('Overpass elements:', json.elements);

                const results = json.elements
                    .filter(element => {
                        const name = element.tags?.name || '';

                        return !/afsnit|fødeafsnit|sengeafsnit|department|ward|clinic/i.test(name);
                    })
                    .filter(element =>
                        element.lat != null || element.center?.lat != null
                    )
                    .map(element => ({
                        id: element.id,
                        name: element.tags?.name || 'Hospital',
                        latitude: element.lat ?? element.center.lat,
                        longitude: element.lon ?? element.center.lon,
                    }));

                setHospitals(results);

                console.log('Hospitals run:', results.length);

            } catch (error) {
                console.error('Hospital query failed ', error);
            }
        }
        function getTestHospitals() {
            return [
                {
                    id: 1,
                    name: 'Aarhus Universitetshospital',
                    latitude: 56.1896,
                    longitude: 10.1833,
                },
                {
                    id: 2,
                    name: 'Odense Universitetshospital',
                    latitude: 55.3984,
                    longitude: 10.3883,
                },
                {
                    id: 3,
                    name: 'Rigshospitalet',
                    latitude: 55.6963,
                    longitude: 12.5683,
                },
                {
                    id: 4,
                    name: 'Herlev Hospital',
                    latitude: 55.7347,
                    longitude: 12.4402,
                },
                {
                    id: 5,
                    name: 'Aalborg Universitetshospital',
                    latitude: 57.0140,
                    longitude: 9.8990,
                },
                {
                    id: 6,
                    name: 'Esbjerg Sygehus',
                    latitude: 55.4765,
                    longitude: 8.4594,
                },
            ];
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
            const testHospitals = getTestHospitals();
            setHospitals(testHospitals);

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

        // Actual GPS location (my location)
        getLocation();

        // Test location: Odense
        // setLocation({
        //     latitude: 55.4038,
        //     longitude: 10.4024
        // });
        // getHospitals(55.4038, 10.4024);

        // Test location: Aarhus
        // setLocation({
        //     latitude: 56.1629,
        //     longitude: 10.2039
        // });
        // getHospitals(56.1629, 10.2039);

        // Test location: Varde
        // setLocation({
        //     latitude: 55.6211,
        //     longitude: 8.4807
        // });
        // getHospitals(55.6211, 8.4807);

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

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={initialRegion}
                onPanDrag={handlePanDrag}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {hospitals.map(hospital => (
                <Marker
                    key={hospital.id}
                    coordinate={{
                        latitude: hospital.latitude,
                        longitude: hospital.longitude,
                    }}
                    title={hospital.name}
                >
                    <View style={{
                        backgroundColor: 'white',
                        padding: 6,
                        borderRadius: 20,
                    }}>
                        <Hospital size={32} color="red" />
                    </View>
                </Marker>
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
});
