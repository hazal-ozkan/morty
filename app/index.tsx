import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Button } from 'react-native';

export default function Index() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'all', species: 'all' });
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState(null);

  useEffect(() => {
    fetch('https://rickandmortyapi.com/api/character')
      .then(response => response.json())
      .then(data => {
        setCharacters(data.results);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const filterCharacters = () => {
    return characters.filter(character => {
      if (filter.status !== 'all' && character.status.toLowerCase() !== filter.status) {
        return false;
      }
      if (filter.species !== 'all' && character.species.toLowerCase() !== filter.species) {
        return false;
      }
      return true;
    });
  };

  const openModal = (type) => {
    setFilterType(type);
    setModalVisible(true);
  };

  const applyFilter = (type, value) => {
    setFilter({ ...filter, [type]: value });
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => openModal('status')} style={styles.filterButton}>
          <Text style={styles.filterText}>Status: {filter.status}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openModal('species')} style={styles.filterButton}>
          <Text style={styles.filterText}>Species: {filter.species}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filterCharacters().map(character => (
          <View key={character.id} style={styles.card}>
            <Image source={{ uri: character.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.text}>{character.name}</Text>
              <Text style={styles.subText}>{character.status} - {character.species}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select {filterType}</Text>
            <TouchableOpacity onPress={() => applyFilter(filterType, 'all')} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>All</Text>
            </TouchableOpacity>
            {filterType === 'status' && (
              <>
                <TouchableOpacity onPress={() => applyFilter(filterType, 'alive')} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Alive</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => applyFilter(filterType, 'dead')} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Dead</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => applyFilter(filterType, 'unknown')} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Unknown</Text>
                </TouchableOpacity>
              </>
            )}
            {filterType === 'species' && (
              <>
                <TouchableOpacity onPress={() => applyFilter(filterType, 'human')} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Human</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => applyFilter(filterType, 'alien')} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Alien</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => applyFilter(filterType, 'unknown')} style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Unknown</Text>
                </TouchableOpacity>
              </>
            )}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  filterText: {
    color: '#333',
  },
  scrollContainer: {
    padding: 10,
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    marginLeft: 10,
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
  subText: {
    color: '#ccc',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  modalButtonText: {
    color: '#333',
  },
});
