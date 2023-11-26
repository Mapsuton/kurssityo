import { React, useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Image, TextInput } from 'react-native';
import { Input } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

const db = SQLite.openDatabase('koirat.db');

export default function DogScreen({ navigation }) {

    const [hasCameraPermission, setPermission] = useState(null);
    const [photoName, setPhotoName] = useState('');
    const [photoBase64, setPhotoBase64] = useState('');
    const camera = useRef(null);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();


    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [info, setInfo] = useState('');
    const [photo, setPic] = useState('');
    const [koirat, setKoirat] = useState([]);

    useEffect(() => {
        askCameraPermission();
    }, []);
    const askCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setPermission(status == 'granted');
    };

    // const onPressHandler = () => {
    //     navigation.navigate(koirat.db);
    // }

    const snap = async () => {
        if (camera) {
            const photo = await camera.current.takePictureAsync({ base64: true });
            setPhotoName(photo.uri);
            setPhotoBase64(photo.base64);
            // const source = photo.uri;
            // cam.pausePreview();
            // await handleSave(source);
            // cam.resumePreview();
        }
    };

    // const handleSave = async (photo) => {
    //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //     if (status === "granted") {
    //       const assert = await MediaLibrary.createAssetAsync(photo);
    //       await MediaLibrary.createAlbumAsync("Koirat", assert);
    //     } else {
    //       console.log("Ei medialupaa");
    //     }
    //   };

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('create table if not exists koirat (id integer primary key not null, name text, description text, info text, photo text);');
        }, () => console.error("Error when creating DB"), updateList);
    }, []);

    const saveItem = () => {
        db.transaction(tx => {
            tx.executeSql('insert into koirat (name, description, info, photo) values (?, ?, ?, ?);',
                [name, description, info, photoName]);
        }, null, updateList)
        console.log(koirat)
    }

    const updateList = () => {
        db.transaction(tx => {
        tx.executeSql('select * from koirat;', [], (_, { rows }) =>
        setKoirat(rows._array)
        );
        }, null, null);
        }

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 16}}>Lisää koiran kuva ja tiedot</Text>
            <Input style={styles.input}
                placeholder='Nimi'
                onChangeText={name => setName(name)}
                value={name} />
            <Input style={styles.input}
                placeholder='Kuvaus'
                onChangeText={description => setDescription(description)}
                value={description} />
            <Input style={styles.input}
                placeholder='Tiedot'
                onChangeText={info => setInfo(info)}
                value={info} />
            {hasCameraPermission ? (
                <View style={styles.cam}>
                    <Camera style={styles.cam} ref={camera} />
                    <Button title="Ota kuva" onPress={snap} />
                    <View style={{ flex: 1 }}>
                        <Image style={styles.cam} source={{ uri: `data:image/gif;base64,${photoBase64}` }} onChangeText={photo => setPic(photo)}/>
                    </View>
                    <Button title="Tallenna" onPress={saveItem} />

                </View>
            ) : (
                <Text>No access to camera</Text>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        fontSize: 14,
    },
    cam: {
        flex: 1,
        minWidth: '90%',
        borderRadius: 20,
        overflow: 'hidden',
    }
});