import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import Home from './Home';
import Cart from './Cart';
import BuyNow from './BuyNow';
import AsyncStorage from '@react-native-async-storage/async-storage';

const hasValue = (value) => value !== null && value !== undefined && value !== '';

const isSameProduct = (firstProduct, secondProduct) => {
  if (hasValue(firstProduct?.id) && hasValue(secondProduct?.id)) {
    return String(firstProduct.id) === String(secondProduct.id);
  }

  if (hasValue(firstProduct?.serial_number) && hasValue(secondProduct?.serial_number)) {
    return String(firstProduct.serial_number) === String(secondProduct.serial_number);
  }

  return false;
};

export default function MainScreen() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [selectedProduct, setSelectedProduct] = useState(null);


  const addToCart = async (product) => {
    try {
      const existingCart = await AsyncStorage.getItem('cart');
      const parsedCart = existingCart ? JSON.parse(existingCart) : [];
      const cart = Array.isArray(parsedCart) ? parsedCart : [];

      const isAlreadyInCart = cart.some((cartProduct) => isSameProduct(cartProduct, product));

      if (isAlreadyInCart) {
        Alert.alert('Already Added', 'This product is already in your cart.');
        setCurrentScreen('Cart');
        return;
      }
    
      cart.push(product);
    
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      setCurrentScreen('Cart');
    
      console.log('Product added to cart:', product);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  }

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setCurrentScreen('BuyNow');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <Home onAddToCart={addToCart} onBuyNow={handleBuyNow} />;
      case 'Cart':
        return <Cart onBuyNow={handleBuyNow} onReturn={() => setCurrentScreen('Home')} />;
      case 'BuyNow':
        return <BuyNow product={selectedProduct} onReturn={() => setCurrentScreen('Home')} />;
      default:
        return <Home onAddToCart={addToCart} onBuyNow={handleBuyNow} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
    </View>
  );
};
