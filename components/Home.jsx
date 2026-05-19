import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import endpoint from '../endpoints/endpoint';
import ProductCard from './ProductCard';
import Cart from './Cart';

const sampleProducts = [
  {
    id: 1,
    brandname: 'Fender Stratocaster',
    price: 1200,
    size: 'Full',
    color: 'Sunburst',
    serial_number: 'SN12345',
  },
];

const normalizeItems = (data) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray(data.items)) return data.items;
  return [];
};

const filters = ['Home', 'New Arrivals', 'Most Expensive', 'Budget', 'Cart' ,  'Shop Location'];

export default function Home({ onAddToCart, onBuyNow }) {
  const [products, setProducts] = useState(sampleProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentFilter, setCurrentFilter] = useState('Home');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const response = await fetch(endpoint.allItems);

        if (!response.ok) {
          throw new Error('Unable to load products');
        }

        const data = await response.json();
        const items = normalizeItems(data);

        if (isMounted && items.length > 0) {
          setProducts(items);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage('Showing sample product until the API is available.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectFilter = (filter) => {
    setCurrentFilter(filter);
    setIsFilterMenuOpen(false);
  };

  const filterButtonsFunction = () => {
    switch (currentFilter) {
      case 'Home':
        return (
          <>
            <Text style={styles.heading}>Guitar Shop</Text>

            {isLoading ? (
              <View style={styles.loading}>
                <ActivityIndicator color="#7a3d20" />
                <Text style={styles.loadingText}>Loading products...</Text>
              </View>
            ) : null}

            {errorMessage ? <Text style={styles.notice}>{errorMessage}</Text> : null}

            <View style={styles.list}>
              {products.map((product, index) => (
                <ProductCard
                  key={product.id ?? product.serial_number ?? `${product.brandname}-${index}`}
                  product={product}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                />
              ))}
            </View>
          </>
        );

        //New arrivals

      case 'New Arrivals':
        const newArrivals = products.filter(product => {
          return product.created_at >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        });
        return (
          <>
            <Text style={styles.heading}>New Arrivals Section</Text>
             <View style={styles.list}>
              {newArrivals.map((product, index) => (
                <ProductCard
                  key={product.id ?? product.serial_number ?? `${product.brandname}-${index}`}
                  product={product}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                />
              ))}
            </View>
          </>
        );

        //Most expensive

      case 'Most Expensive':
          const mostExpensive = products.filter(product => {
            return Number(product.price) >= 50000;
          });
        return (
          <>
            <Text style={styles.heading}>Most Expensive Guitars</Text>
             <View style={styles.list}>
              {mostExpensive.map((product, index) => (
                <ProductCard
                  key={product.id ?? product.serial_number ?? `${product.brandname}-${index}`}
                  product={product}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                />
              ))}
            </View>
            </>
        );


      case 'Budget':
        const budget = products.filter(product => {
          return Number(product.price) <= 100000;
        });
        return (
          <>
          <Text style={styles.heading}>Budget Guitars</Text>
          <View style={styles.list}>
              {budget.map((product, index) => (
                <ProductCard
                  key={product.id ?? product.serial_number ?? `${product.brandname}-${index}`}
                  product={product}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                />
              ))}
            </View>
          </>
        ); 
      case 'Cart':
        return <Cart onBuyNow={onBuyNow} />;

      case 'Shop Location':
        return <Text style={styles.heading}>Shop Location: 123 Music St.</Text>;
      default:
        return <Text style={styles.heading}>Guitar Products</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={styles.hamburgerButton}
            onPress={() => setIsFilterMenuOpen((isOpen) => !isOpen)}
            accessibilityRole="button"
            accessibilityLabel="Toggle filter menu"
          >
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>
          <Text style={styles.currentFilter}>{currentFilter}</Text>
        </View>

        {isFilterMenuOpen ? (
          <View style={styles.filterMenu}>
            {filters.map((filter) => {
              const isActive = filter === currentFilter;

              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterButton, isActive && styles.activeFilterButton]}
                  onPress={() => selectFilter(filter)}
                >
                  <Text style={[styles.filterButtonText, isActive && styles.activeFilterButtonText]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {filterButtonsFunction()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop : 20,
  },
  filterButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 20,
  },
  hamburgerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#7a3d20',
    borderRadius: 5,
  },
  hamburgerLine: {
    width: 22,
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  currentFilter: {
    color: '#7a3d20',
    fontSize: 18,
    fontWeight: '700',
  },
  filterMenu: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6e0d9',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  filterButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ebe5',
  },
  activeFilterButton: {
    backgroundColor: '#7a3d20',
  },
  filterButtonText: {
    color: '#7a3d20',
    fontWeight: '600',
    fontSize: 15,
  },
  activeFilterButtonText: {
    color: '#ffffff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#7a3d20',
  },
  subheading: {
    fontSize: 18,
    marginBottom: 15,
    color: '#7a3d20',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  brand: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#7a3d20',
  },
  spec: {
    fontSize: 16,
    marginBottom: 5,
    color: '#7a3d20',
  },
  timestamps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 14,
    color: '#7a3d20',
  },
  loading
    : {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#7a3d20',
  },
  notice: {
    fontSize: 14,
    color: '#7a3d20',
    marginBottom: 15,
  },
  list: {
    flexDirection: 'column',
    gap: 15,
  },
  endpoint: {
    fontSize: 12,
    color: '#7a3d20',
    marginTop: 10,
  },
}); 
