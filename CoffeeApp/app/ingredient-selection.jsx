import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { INGREDIENTS } from '@/constants/ingredients';
import { MENU_ITEMS } from '@/constants/MenuItems';


export default function IngredientSelection() {
    const { itemName } = useLocalSearchParams();
    const [selectedIngredients, setSelectedIngredients] = useState({});
    const [quantity, setQuantity] = useState(1);

    const basePrice = MENU_ITEMS.find(item => item.title === itemName)?.price || 0;
    const totalIngredientCost = Object.entries(selectedIngredients)
        .reduce((sum, [id, qty]) => sum + (INGREDIENTS.find(ing => ing.id == id)?.price || 0) * qty, 0);
    const totalPrice = (basePrice + totalIngredientCost) * quantity;

    const toggleIngredient = (id) => {
        setSelectedIngredients(prev => ({
            ...prev,
            [id]: prev[id] ? prev[id] + 1 : 1
        }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Customize Your {itemName}</Text>
            <Text style={styles.price}>Base Price: ${basePrice.toFixed(2)}</Text>
            
            <FlatList
                data={INGREDIENTS}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Pressable onPress={() => toggleIngredient(item.id)} style={styles.ingredient}>
                        <Text>{item.name} (+${item.price.toFixed(2)})</Text>
                        <Text>Qty: {selectedIngredients[item.id] || 0}</Text>
                    </Pressable>
                )}
            />

            <View style={styles.quantityRow}>
                <Pressable onPress={() => setQuantity(q => Math.max(1, q - 1))} style={styles.button}>
                    <Text>-</Text>
                </Pressable>
                <Text style={styles.quantity}>{quantity}</Text>
                <Pressable onPress={() => setQuantity(q => q + 1)} style={styles.button}>
                    <Text>+</Text>
                </Pressable>
            </View>

            <Text style={styles.total}>Total Price: ${totalPrice.toFixed(2)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold' },
    price: { fontSize: 18, marginVertical: 10 },
    ingredient: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 },
    quantityRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    button: { padding: 10, borderWidth: 1, marginHorizontal: 10 },
    quantity: { fontSize: 18, fontWeight: 'bold' },
    total: { fontSize: 20, fontWeight: 'bold', marginTop: 20, textAlign: 'center' }
});
