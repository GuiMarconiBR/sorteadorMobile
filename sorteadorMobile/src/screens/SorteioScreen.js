import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
  Animated,
  Dimensions,
  Easing,
  Switch,
  KeyboardAvoidingView,
  Platform
} from "react-native";

const screenWidth = Dimensions.get('window').width;

export default function SorteioScreen() {
  const [quantidade, setQuantidade] = useState("");
  const [minimo, setMinimo] = useState("");
  const [maximo, setMaximo] = useState("");
  const [resultado, setResultado] = useState([]);
  const [permitirRepetidos, setPermitirRepetidos] = useState(false);
  const [focusInput, setFocusInput] = useState("");

  const scrollRef = useRef(null);
  const rotate = useRef(new Animated.Value(0)).current;

  const quantidadeRef = useRef(null);
  const minimoRef = useRef(null);
  const maximoRef = useRef(null);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      if (focusInput) scrollToInput(focusInput);
    });

    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {});

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [focusInput]);

  const scrollToInput = (inputName) => {
    let ref;
    if (inputName === "quantidade") ref = quantidadeRef;
    else if (inputName === "minimo") ref = minimoRef;
    else if (inputName === "maximo") ref = maximoRef;

    setTimeout(() => {
      ref.current?.measureLayout(
        scrollRef.current,
        (x, y) => {
          scrollRef.current.scrollTo({ y: y - 20, animated: true });
        }
      );
    }, 100);
  };

  const handleFocus = (inputName) => {
    setFocusInput(inputName);
    scrollToInput(inputName);
  };

  const girarRoleta = () => {
    rotate.setValue(0);
    Animated.timing(rotate, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleSorteio = () => {
    Keyboard.dismiss();
    const qtd = parseInt(quantidade);
    const min = parseInt(minimo);
    const max = parseInt(maximo);

    if (isNaN(qtd) || isNaN(min) || isNaN(max) || qtd <= 0 || min >= max) {
      alert("Preencha os campos corretamente!");
      return;
    }

    if (qtd > 20) {
      alert("O número máximo de números sorteados é 20.");
      return;
    }

    if (!permitirRepetidos && qtd > (max - min + 1)) {
      alert(`O número de sorteios não pode ser maior que a quantidade de números disponíveis no intervalo (${max - min + 1}).\nPara permitir sorteios maiores, marque a opção "Permitir números repetidos".`);
      return;
    }

    girarRoleta();

    const numeros = [];
    while (numeros.length < qtd) {
      const sorteado = Math.floor(Math.random() * (max - min + 1)) + min;
      if (permitirRepetidos) {
        numeros.push(sorteado);
      } else if (!numeros.includes(sorteado)) {
        numeros.push(sorteado);
      }
    }

    setResultado(numeros);
    setQuantidade('');
    setMinimo('');
    setMaximo('');
  };

  const getBoxColor = (index) => {
    const colors = ["#FFD700", "#FF6347", "#40E0D0", "#90EE90", "#FFB6C1"];
    return colors[index % colors.length];
  };

  const getInputStyle = (inputName) => [
    styles.input,
    focusInput === inputName && styles.inputFocused
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>🎲 Sorteador Mobile 🎲</Text>

        <Animated.Image
          source={require('../../assets/roleta.png')}
          style={{
            width: screenWidth * 0.6,
            height: undefined,
            aspectRatio: 1,
            marginBottom: 20,
            transform: [{
              rotate: rotate.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })
            }]
          }}
          resizeMode="contain"
        />

        <Text style={styles.label}>Quantos números deseja sortear?</Text>
        <TextInput
          ref={quantidadeRef}
          style={getInputStyle("quantidade")}
          keyboardType="numeric"
          value={quantidade}
          onChangeText={setQuantidade}
          placeholder="Ex: 5"
          autoCorrect={false}
          showSoftInputOnFocus={true}
          onFocus={() => handleFocus("quantidade")}
          onBlur={() => setFocusInput("")}
        />

        <Text style={styles.label}>Intervalo de números</Text>
        <View style={styles.row}>
          <TextInput
            ref={minimoRef}
            style={[getInputStyle("minimo"), styles.smallInput]}
            keyboardType="numeric"
            value={minimo}
            onChangeText={setMinimo}
            placeholder="De"
            autoCorrect={false}
            showSoftInputOnFocus={true}
            onFocus={() => handleFocus("minimo")}
            onBlur={() => setFocusInput("")}
          />
          <TextInput
            ref={maximoRef}
            style={[getInputStyle("maximo"), styles.smallInput]}
            keyboardType="numeric"
            value={maximo}
            onChangeText={setMaximo}
            placeholder="Até"
            autoCorrect={false}
            showSoftInputOnFocus={true}
            onFocus={() => handleFocus("maximo")}
            onBlur={() => setFocusInput("")}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <Text style={styles.checkboxLabel}>Permitir números repetidos</Text>
          <Switch
            value={permitirRepetidos}
            onValueChange={setPermitirRepetidos}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSorteio}>
          <Text style={styles.buttonText}>Sortear Agora</Text>
        </TouchableOpacity>

        {resultado.length > 0 && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Resultado do Sorteio:</Text>
            <View style={styles.numerosContainer}>
              {resultado.map((num, index) => (
                <View key={index} style={[styles.numeroBox, { backgroundColor: getBoxColor(index) }]}>
                  <Text style={styles.numeroText}>{num}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.info}>
              Quantidade sorteada: {resultado.length}{"\n"}
              Intervalo: {Math.min(...resultado)} até {Math.max(...resultado)}
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: "100%",
    fontSize: 16,
    textAlign: "center",
  },
  inputFocused: {
    borderColor: "#007BFF",
    borderWidth: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  smallInput: {
    width: "48%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultBox: {
    marginTop: 30,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
    width: "100%",
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  numerosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 15,
  },
  numeroBox: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
  },
  numeroText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  info: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});
