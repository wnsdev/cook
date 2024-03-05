import { View, Text, ScrollView, Alert } from "react-native";
import { styles } from "./styles";
import { useEffect, useState } from "react";
import { Selected } from "@/components/selected";
import { Ingredient } from "@/components/Ingredient";
import { router } from "expo-router";
import { services } from "@/services";
export default function Index() {
  const [selected, setSelected] = useState<String[]>([]);
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);

  function handleToggleIngredient(value: string) {
    if (selected.includes(value)) {
      return setSelected((state) =>
        state.filter((itemSelected) => itemSelected !== value)
      );
    }

    setSelected((state) => [...state, value]);
  }
  function handleClearSelected() {
    Alert.alert("Limpar", "Deseja limpar tudo?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => setSelected([]) },
    ]);
  }
  function handleSearch() {
    router.navigate("/recipes/" + selected);
  }
  useEffect(() => {
    services.ingredients.findAll().then(setIngredients);
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Escolha {"\n"}
        <Text style={styles.subtitle}>os ingredientes</Text>
      </Text>
      <Text style={styles.message}>
        Descubra receitas com base nos itens que você escolher.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ingredients}
      >
        {ingredients.map((item, key) => (
          <Ingredient
            key={item.id}
            name={item.name}
            image={[services.storage.imagePath, item.image].join("/")}
            selected={selected.includes(item.id)}
            onPress={() => handleToggleIngredient(item.id)}
          />
        ))}
      </ScrollView>
      {selected.length > 0 && (
        <Selected
          quantity={selected.length}
          onClear={handleClearSelected}
          onSearch={handleSearch}
        />
      )}
    </View>
  );
}
