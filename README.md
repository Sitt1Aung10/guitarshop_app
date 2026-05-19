# Guitar Shop Mobile App

A React Native + Expo mobile application for browsing guitars, adding products to cart, and placing orders through a Laravel API backend.

## Features

- Browse guitar products
- Product detail and Buy Now flow
- Add to Cart with duplicate prevention
- Persistent cart using AsyncStorage
- Order placement through API
- Voucher generation and saving
- Mobile-first UI using React Native

## Tech Stack

- React Native
- Expo
- JavaScript
- AsyncStorage
- Laravel API Backend

## Installation

Clone the repository:

bash
git clone https://github.com/yourusername/guitarshop-expo-app.git

Install dependencies:

npm install

Start Expo server:

npx expo start
Required Packages
npm install @react-native-async-storage/async-storage

If using media saving:

npx expo install expo-media-library expo-file-system
Project Structure
components/
screens/
assets/
App.js
MainScreen.js
Home.js
Cart.js
BuyNow.js

Development Notes

Expo Go has limited Android media permissions on newer Android versions.

For full media-library functionality, use an Expo Development Build.

Future Improvements
User authentication
Payment integration
Order history
Search and filtering
Admin dashboard
Cloud image storage
License

This project is for educational purposes.
