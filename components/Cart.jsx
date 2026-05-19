import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from './ProductCard';

export default function Cart({ onBuyNow, onReturn }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadCart = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const cartData = await AsyncStorage.getItem('cart');
      const parsedCart = cartData ? JSON.parse(cartData) : [];

      setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
      setErrorMessage('Unable to load cart items.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemIndex) => {
    try {
      const updatedCart = cartItems.filter((_, index) => index !== itemIndex);

      setCartItems(updatedCart);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error removing cart item:', error);
      setErrorMessage('Unable to remove item from cart.');
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {onReturn ? (
        <TouchableOpacity style={styles.returnButton} onPress={onReturn}>
          <Text style={styles.returnButtonText}>Return</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={styles.heading}>Cart</Text>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#7a3d20" />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      ) : null}

      {errorMessage ? <Text style={styles.notice}>{errorMessage}</Text> : null}

      {!isLoading && cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : null}

      <View style={styles.list}>
        {cartItems.map((product, index) => (
          <View
            key={product?.id ?? product?.serial_number ?? `${product?.brandname ?? 'cart-item'}-${index}`}
            style={styles.cartItem}
          >
            <ProductCard
              product={product}
              addToCartLabel="Remove"
              onAddToCart={() => removeFromCart(index)}
              onBuyNow={onBuyNow ?? (() => {})}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    gap: 12,
    paddingBottom: 24,
    paddingTop: 36,
  },
  returnButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#7a3d20',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  returnButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  heading: {
    color: '#7a3d20',
    fontSize: 24,
    fontWeight: '700',
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#7a3d20',
    fontSize: 16,
  },
  notice: {
    color: '#7a3d20',
    fontSize: 14,
  },
  emptyText: {
    color: '#716a63',
    fontSize: 16,
  },
  list: {
    gap: 15,
  },
  cartItem: {
    gap: 8,
  },
});
