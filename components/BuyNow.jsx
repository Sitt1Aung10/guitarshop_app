import React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import endpoints from '../endpoints/endpoint';

const emptyValue = 'Not set';

const displayValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return emptyValue;
  }

  return String(value);
};

const getNumber = (value) => {
  const amount = typeof value === 'number' ? value : Number.parseFloat(value);

  return Number.isFinite(amount) ? amount : 0;
};

const formatPrice = (value) => {
  const amount = getNumber(value);

  return `$${amount.toFixed(2)}`;
};

export default function BuyNow({ product, onReturn }) {
  const voucherRef = React.useRef(null);
  const [quantity, setQuantity] = React.useState('1');
  const [user_name, setUsername] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const voucherCode = React.useMemo(
    () => `GS-${Date.now().toString(36).toUpperCase()}`,
    []
  );

  const unitPrice = getNumber(product?.price);
  const quantityNumber = Math.max(1, Number.parseInt(quantity, 10) || 1);
  const totalPrice = unitPrice * quantityNumber;
  const voucherDate = new Date().toLocaleString();

  const handleQuantityChange = (value) => {
    setQuantity(value.replace(/[^0-9]/g, ''));
  };

  const saveVoucherToGallery = async () => {
    if (Platform.OS === 'web') {
      throw new Error('Gallery saving is only available on mobile devices.');
    }

    if (!voucherRef.current?.capture) {
      throw new Error('Voucher preview is not ready.');
    }

    const permission = await MediaLibrary.requestPermissionsAsync(true, []);

    if (!permission.granted) {
      throw new Error('Gallery permission was not granted.');
    }

    const voucherUri = await voucherRef.current.capture();
    await MediaLibrary.saveToLibraryAsync(voucherUri);

    return voucherUri;
  };

  const handleBuyNow = async () => {
    if (isSubmitting) {
      return;
    }

    if (!quantity.trim() || quantityNumber < 1) {
      Alert.alert('Missing Quantity', 'Please enter a valid quantity.');
      return;
    }

    if (!user_name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Missing Details', 'Please enter your name, phone, and address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(endpoints.orders, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          guitar_id: product.id,
          quantity: quantityNumber,
          user_name: user_name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          notes: notes.trim(),
          total_price: totalPrice,
          voucher_code: voucherCode,
        }),
      });

      const text = await res.text();
      console.log(text);

      if (!res.ok) {
        Alert.alert('Error', 'Failed to place order. Please try again.');
        return;
      }

      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          Alert.alert(
            'Response Error',
            `Status: ${res.status}, Response: ${text}`
          );
          return;
        }
      }

      console.log('Order response:', data);

      let voucherSaved = false;

      try {
        await saveVoucherToGallery();
        voucherSaved = true;
      } catch (error) {
        console.warn('Voucher save failed:', error);
      }

      Alert.alert(
        'Success',
        voucherSaved
          ? 'Order placed successfully! Voucher saved to your gallery.'
          : 'Order placed successfully, but the voucher could not be saved. Please allow gallery access to save vouchers next time.',
        [{ text: 'OK', onPress: onReturn }]
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
      <TouchableOpacity style={styles.returnButton} onPress={onReturn}>
        <Text style={styles.returnButtonText}>Return</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.stamp}>
            <Text style={styles.stampText}>Priority</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            keyboardType="number-pad"
            value={quantity}
            onChangeText={handleQuantityChange}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={user_name}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Product Details</Text>
        <Image source={{ uri: product?.image_url }} style={styles.productImage} resizeMode="cover" />
        <Text style={styles.product}>{product?.brandname || 'Unknown Product'}</Text>
        <Text style={styles.price}>Price: {formatPrice(product?.price)}</Text>
        <Text style={styles.meta}>Color: {displayValue(product?.color)}</Text>
        <Text style={styles.meta}>Size: {displayValue(product?.size)}</Text>
        <Text style={styles.meta}>Serial No: {displayValue(product?.serial_number)}</Text>
        <Text style={styles.totalPrice}>Total: {formatPrice(totalPrice)}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>Voucher Preview</Text>
        <ViewShot
          ref={voucherRef}
          options={{
            fileName: `guitar-shop-voucher-${voucherCode}`,
            format: 'png',
            quality: 1,
            result: 'tmpfile',
          }}
          style={styles.voucher}
        >
          <View style={styles.voucherHeader}>
            <View>
              <Text style={styles.voucherTitle}>Guitar Shop Voucher</Text>
              <Text style={styles.voucherSubText}>{voucherDate}</Text>
            </View>
            <View style={styles.voucherBadge}>
              <Text style={styles.voucherBadgeText}>ORDER</Text>
            </View>
          </View>

          <View style={styles.voucherCodeBox}>
            <Text style={styles.voucherCodeLabel}>Voucher No</Text>
            <Text style={styles.voucherCode}>{voucherCode}</Text>
          </View>

          <View style={styles.voucherRows}>
            <View style={styles.voucherRow}>
              <Text style={styles.voucherLabel}>Customer</Text>
              <Text style={styles.voucherValue}>{displayValue(user_name.trim())}</Text>
            </View>
            <View style={styles.voucherRow}>
              <Text style={styles.voucherLabel}>Phone</Text>
              <Text style={styles.voucherValue}>{displayValue(phone.trim())}</Text>
            </View>
            <View style={styles.voucherRow}>
              <Text style={styles.voucherLabel}>Address</Text>
              <Text style={styles.voucherValue}>{displayValue(address.trim())}</Text>
            </View>
            <View style={styles.voucherRow}>
              <Text style={styles.voucherLabel}>Product</Text>
              <Text style={styles.voucherValue}>{displayValue(product?.brandname)}</Text>
            </View>
            <View style={styles.voucherRow}>
              <Text style={styles.voucherLabel}>Serial No</Text>
              <Text style={styles.voucherValue}>{displayValue(product?.serial_number)}</Text>
            </View>
            <View style={styles.voucherRow}>
              <Text style={styles.voucherLabel}>Quantity</Text>
              <Text style={styles.voucherValue}>{quantityNumber}</Text>
            </View>
            <View style={styles.voucherRow}>
              <Text style={styles.voucherLabel}>Unit Price</Text>
              <Text style={styles.voucherValue}>{formatPrice(unitPrice)}</Text>
            </View>
          </View>

          {notes.trim() ? (
            <View style={styles.noteBox}>
              <Text style={styles.voucherLabel}>Notes</Text>
              <Text style={styles.noteText}>{notes.trim()}</Text>
            </View>
          ) : null}

          <View style={styles.voucherTotalRow}>
            <Text style={styles.voucherTotalLabel}>Total</Text>
            <Text style={styles.voucherTotalValue}>{formatPrice(totalPrice)}</Text>
          </View>
        </ViewShot>

        <TouchableOpacity
          style={[styles.buyButton, isSubmitting && styles.buyButtonDisabled]}
          onPress={handleBuyNow}
          disabled={isSubmitting}
        >
          <Text style={styles.buyButtonText}>
            {isSubmitting ? 'Buying...' : 'Buy Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f5efe6',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5efe6',
  },
  returnButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#724d32',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 4,
    zIndex: 9,
  },
  returnButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#fff9f0',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#e2d2c1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stamp: {
    backgroundColor: '#c06f2f',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#9d5022',
  },
  stampText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  formSection: {
    marginBottom: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1d3c4',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#4f3a2a',
    marginBottom: 12,
  },
  buyButton: {
    backgroundColor: '#8c513a',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 20,
  },
  buyButtonDisabled: {
    opacity: 0.65,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#ebdfd1',
    marginVertical: 18,
  },
  sectionLabel: {
    color: '#8b6f52',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    fontSize: 12,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: '#f0e7de',
  },
  product: {
    fontSize: 20,
    fontWeight: '800',
    color: '#402d1f',
    marginBottom: 8,
  },
  price: {
    fontSize: 17,
    color: '#5e4637',
    marginBottom: 6,
  },
  meta: {
    fontSize: 15,
    color: '#5f4b3e',
    marginBottom: 4,
  },
  totalPrice: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '800',
    color: '#3c2a1f',
  },
  voucher: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbc8b5',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  voucherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  voucherTitle: {
    color: '#3c2a1f',
    fontSize: 20,
    fontWeight: '900',
  },
  voucherSubText: {
    color: '#7e6652',
    fontSize: 12,
    marginTop: 4,
  },
  voucherBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1f7a4d',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  voucherBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  voucherCodeBox: {
    backgroundColor: '#f7efe5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  voucherCodeLabel: {
    color: '#8b6f52',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  voucherCode: {
    color: '#3c2a1f',
    fontSize: 18,
    fontWeight: '900',
  },
  voucherRows: {
    gap: 9,
  },
  voucherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  voucherLabel: {
    color: '#7e6652',
    fontSize: 13,
    fontWeight: '700',
  },
  voucherValue: {
    flex: 1,
    color: '#3f3026',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  noteBox: {
    borderTopWidth: 1,
    borderTopColor: '#ecdccd',
    marginTop: 14,
    paddingTop: 12,
  },
  noteText: {
    color: '#3f3026',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  voucherTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#ecdccd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
  },
  voucherTotalLabel: {
    color: '#3c2a1f',
    fontSize: 17,
    fontWeight: '900',
  },
  voucherTotalValue: {
    color: '#7a3d20',
    fontSize: 20,
    fontWeight: '900',
  },
});
