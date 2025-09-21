import React, { useRef, useEffect } from "react";
import { View, Text, Button, Image, StyleSheet, Dimensions, Animated, Easing } from "react-native";

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen({ navigation }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação contínua da roleta
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 5000, // gira em 5 segundos
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      
      {/* Topo: imagem */}
      <View style={styles.top}>
        <Animated.Image
          source={require('../../assets/roleta.png')}
          style={[styles.roleta, { transform: [{ rotate }] }]}
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
    height: 450,
    justifyContent: 'flex-end',
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
    width: screenWidth * 0.9, // 90% da largura da tela
    height: undefined,
    aspectRatio: 1, // mantém proporção quadrada
    bottom: -20,
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
    fontWeight: 'bold', // agora em negrito
  },
});
