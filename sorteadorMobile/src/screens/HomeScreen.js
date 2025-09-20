import React from 'react';
import { View, Text, Button, Image, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width; // pega a largura da tela

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      
      {/* Topo: imagem */}
      <View style={styles.top}>
        <Image
          source={require('../../assets/roleta.png')} // imagem na pasta assets
          style={styles.roleta}
          resizeMode="contain"
        />
      </View>

      {/* Meio: título + botão */}
      <View style={styles.middle}>
        <Text style={styles.title}>Sorteador Mobile</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Iniciar"
            onPress={() => navigation.navigate('Sorteio')}
          />
        </View>
      </View>

      {/* Rodapé: desenvolvedores */}
      <View style={styles.bottom}>
        <Text style={styles.footer}>Desenvolvido por Anderson, Marconi, Eduardo e Ytallo </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  top: {
  height: 450, // bloco menor, aproxima do meio
  justifyContent: 'flex-end', // empurra a imagem para baixo do bloco
  alignItems: 'center',
},
  middle: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleta: {
  width: screenWidth * 0.9, // 70% da largura da tela
  height: undefined,
  aspectRatio: 1, // mantém proporção quadrada
  bottom: -50,
},
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '50%',
  },
  footer: {
    fontSize: 12,
    color: 'gray',
  },
});
