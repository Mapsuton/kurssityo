import {React, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, Pressable, Alert } from 'react-native';
import { API_KEY } from '@env';
import * as Location from 'expo-location';

export default function HomeScreen() {

    const [modalVisible, setModalVisible] = useState(false);
    const [location, setLocation] = useState(null);
    const [saa, setSaa] = useState('');
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');

    useEffect(() => {
      (async () => {
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        } else {
          let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        setLat(loc.coords.latitude);
        setLon(loc.coords.longitude);
        
        }
        getSaa();
        
      })();
    }, []);

    // useEffect(() => {
    //   setLat(location.coords.latitude);
    //   setLon(location.coords.longitude);
    // }, [location]);

    const getSaa = () => {
      console.log(lat);
      const KEY = process.env.API_KEY;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${KEY}`)
        .then(response => response.json())
        .then(responseJson => setSaa(responseJson.weather[0].main))
        .catch(error => {
        Alert.alert('Error', error.message);
        });
        console.log(saa);
        }

    return (
        <View>
            <Text style={styles.header}>Tervetuloa Koirasovellukseen!
            </Text>
            <Text style={styles.body}>Voit lisätä uuden koiran ja sille tietoja profiiliin alavalikosta. Pääset tarkastelemaan ja muokkaamaan syöttämiäsi tietoja Tiedot-sivulta.
            </Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{saa}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {setModalVisible(!modalVisible)}}>
                <Text style={styles.textStyle}>Piilota sää</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.textStyle}>Kehtaako lähteä ulos? Katso sää!</Text>
        </Pressable>
      </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginLeft: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        color: 'black',
        marginLeft: 30,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      button: {
        borderRadius: 20,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        elevation: 2,
      },
      buttonOpen: {
        backgroundColor: '#1f36a0',
      },
      buttonClose: {
        backgroundColor: '#2196F3',
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
});