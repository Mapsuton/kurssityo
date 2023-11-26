import {React, useState, useEffect} from 'react';
import { View, Text, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { ListItem, Icon, Avatar } from '@rneui/themed';
import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {koirat} from './DogScreen';

const db = SQLite.openDatabase('koirat.db');

export default function InfoScreen() {

  const [koirat, setKoirat] = useState([]);
console.log(koirat);

useEffect(() => {
  db.transaction(tx => {
    tx.executeSql('create table if not exists koirat (id integer primary key not null, name text, description text, info text, photo text);');
  }, () => console.error("Error when creating DB"), updateList);
}, []);

const updateList = () => {
  db.transaction(tx => {
    tx.executeSql('select * from koirat;', [], (_, { rows }) =>
      setKoirat(rows._array)
    );
  }, null, null);
};

const deleteItem = (id) => {
  db.transaction(
    tx => tx.executeSql('delete from koirat where id = ?;', [id]),
      null,
      updateList);
};

    renderItem = ({ item }) => (
        <ListItem  bottomDivider>
        <ListItem.Content style={styles.list}> 
        <Avatar rounded source={{uri: item.photo}} />
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
        <ListItem.Subtitle>{item.info}</ListItem.Subtitle>
        </ListItem.Content>
        <Icon
          name={"delete"}
          type={"material-community"}
          color={"red"}
          onPress={() => deleteItem(item.id)}
        />
        </ListItem>
        );

return (
    <View>
        <FlatList 
      data={koirat}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      />
    </View>
);
};

const styles = StyleSheet.create({
    list: {
      flexdirection: 'row',
      backgroundColor: '#fff',


    },
  });
  