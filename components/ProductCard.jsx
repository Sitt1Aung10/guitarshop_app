import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity , Image} from 'react-native';

const emptyValue = 'Not set';

const displayValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return emptyValue;
  }

  return String(value);
};

const formatPrice = (price) => {
  const amount = typeof price === 'number' ? price : Number.parseFloat(price);

  if (!Number.isFinite(amount)) {
    return emptyValue;
  }

  return `$${amount.toFixed(2)}`;
};

export default function ProductCard({ product, onAddToCart, onBuyNow, addToCartLabel = 'Add to Cart' }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.brand} numberOfLines={1}>
          {displayValue(product?.brandname)}
        </Text>
        <Text style={styles.price}>{formatPrice(product?.price)}</Text>
      </View>

      <View>
        <Image source={{ uri: product?.image_url }} style={{ width: '100%', height: 200, borderRadius: 8 }} resizeMode="cover" />
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Size</Text>
          <Text style={styles.value}>{displayValue(product?.size)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Color</Text>
          <Text style={styles.value}>{displayValue(product?.color)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Serial</Text>
          <Text style={styles.value}>{displayValue(product?.serial_number)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.value}>{new Date(product.created_at).toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => onAddToCart(product)}>
          <Text style={styles.buttonText}>{addToCartLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => onBuyNow(product)}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e6e0d9',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  brand: {
    flex: 1,
    color: '#1d1a16',
    fontSize: 20,
    fontWeight: '700',
  },
  price: {
    color: '#7a3d20',
    fontSize: 18,
    fontWeight: '700',
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    color: '#716a63',
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    flex: 1,
    color: '#2d2925',
    fontSize: 14,
    textAlign: 'right',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#7a3d20',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
