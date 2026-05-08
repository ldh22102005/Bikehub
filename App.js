import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { ProductsProvider } from './src/context/ProductsContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { useAuth } from './src/hooks/useAuth';
import { useCart } from './src/hooks/useCart';
import { useProducts } from './src/hooks/useProducts';

// screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProductScreen from './src/screens/ProductScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import AddressesScreen from './src/screens/AddressesScreen';
import PaymentMethodsScreen from './src/screens/PaymentMethodsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderSuccessScreen from './src/screens/OrderSuccessScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ChatScreen from './src/screens/ChatScreen';

// admin
import DashboardScreen from './src/admin/DashboardScreen';
import AdminProductsScreen from './src/admin/AdminProductsScreen';
import AddProductScreen from './src/admin/AddProductScreen';
import EditProductScreen from './src/admin/EditProductScreen';
import OrdersManagementScreen from './src/admin/OrdersManagementScreen';
import CategoryManagementScreen from './src/admin/CategoryManagementScreen';

function AppInner() {
  // === 1. KHỞI TẠO STATE & HOOKS ===
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const { user: currentUser, usersByEmail, loading: authLoading, error: authError, clearError, signIn, signUp, signOut, updateProfile, socialSignIn } = useAuth();
  const { cartItems, addToCart, increaseQty, decreaseQty, removeItem, clearCart, replaceCart } = useCart();
  const { applyPurchase } = useProducts();

  // === 2. XỬ LÝ LIFECYCLE (EFFECTS) ===
  // Tự động điều hướng dựa trên trạng thái đăng nhập và phân quyền
  useEffect(() => {
    if (authLoading) return;
    if (!currentUser) {
      setCurrentScreen('Login');
      return;
    }
    setCurrentScreen(currentUser.role === 'admin' ? 'Dashboard' : 'Home');
  }, [authLoading, currentUser]);

  // Tải dữ liệu Đơn hàng và Địa chỉ lưu trong máy khi mở App
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem('orders');
        if (storedOrders) setOrders(JSON.parse(storedOrders));

        const storedAddresses = await AsyncStorage.getItem('addresses');
        if (storedAddresses) {
          setAddresses(JSON.parse(storedAddresses));
        } else {
          // Set default addresses on first time
          const defaultAddresses = [
            { id: '1', label: 'Nhà riêng', address: '123 Đường Điện Biên Phủ, Quận 1', city: 'Hồ Chí Minh', phone: '0901234567', isDefault: true },
            { id: '2', label: 'Công ty', address: 'Tòa nhà Bitexco, 2 Hải Triều, Quận 1', city: 'Hồ Chí Minh', phone: '0901234567', isDefault: false },
          ];
          setAddresses(defaultAddresses);
          await AsyncStorage.setItem('addresses', JSON.stringify(defaultAddresses));
        }
      } catch (error) {
        console.log('Lỗi load dữ liệu:', error);
      }
    };
    loadData();
  }, []);

  // === 3. CÁC HÀM XỬ LÝ LOGIC CHUNG ===
  // Hàm chặn người dùng thường truy cập trang Admin
  const requireAdmin = () => {
    if (currentUser?.role === 'admin') return true;
    Alert.alert('Không có quyền', 'Bạn cần đăng nhập tài khoản admin để truy cập trang này.');
    setCurrentScreen(currentUser ? 'Home' : 'Login');
    return false;
  };

  // === 4. RENDER GIAO DIỆN (ĐIỀU HƯỚNG MÀN HÌNH) ===
  // Hệ thống Switch-Case chuyển đổi hiển thị giữa các trang
  const renderMainContent = () => {
    switch (currentScreen) {
      case 'Login':
        return (
          <LoginScreen
            errorText={authError}
            onLogin={async ({ email, password }) => {
              const normalizedEmail = String(email || '').trim().toLowerCase();
              const normalizedPassword = String(password || '');
              if (!normalizedEmail || !normalizedPassword) return;

              const ok = await signIn({ email: normalizedEmail, password: normalizedPassword });
              if (!ok) return;

              const role = usersByEmail?.[normalizedEmail]?.role || 'user';
              setCurrentScreen(role === 'admin' ? 'Dashboard' : 'Home');
            }}
            onSocialLogin={async (provider) => {
              const ok = await socialSignIn?.(provider);
              if (ok) setCurrentScreen('Home');
            }}
            onNavigateToRegister={() => {
              clearError?.();
              setCurrentScreen('Register');
            }}
          />
        );
      case 'Register':
        return (
          <RegisterScreen
            errorText={authError}
            onRegister={async ({ name, email, password, confirmPassword }) => {
              const normalizedName = String(name || '').trim();
              const normalizedEmail = String(email || '').trim().toLowerCase();
              const normalizedPassword = String(password || '');
              const normalizedConfirm = String(confirmPassword || '');
              if (!normalizedName || !normalizedEmail || !normalizedPassword || !normalizedConfirm) return;

              const ok = await signUp({
                name: normalizedName,
                email: normalizedEmail,
                password: normalizedPassword,
                confirmPassword: normalizedConfirm,
              });
              if (!ok) return;

              Alert.alert('Thành công', 'Đăng ký tài khoản thành công! Vui lòng đăng nhập để tiếp tục.', [
                { text: 'OK', onPress: () => setCurrentScreen('Login') },
              ]);
            }}
            onNavigateToLogin={() => {
              clearError?.();
              setCurrentScreen('Login');
            }}
          />
        );
      case 'Chat':
        return <ChatScreen onBack={() => setCurrentScreen('Home')} />;
      case 'Home':
        return (
          <HomeScreen
            user={currentUser}
            onLogout={() => {
              signOut?.();
              clearError?.();
              setCurrentScreen('Login');
            }}
            onProfile={() => setCurrentScreen('Profile')}
            onOpenProduct={(product) => {
              setSelectedProduct(product);
              setCurrentScreen('ProductDetail');
            }}
            onOpenChat={() => setCurrentScreen('Chat')}
          />
        );
      case 'Dashboard':
        if (!requireAdmin()) return null;
        return (
          <DashboardScreen
            orders={orders}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onLogout={() => {
              signOut?.();
              clearError?.();
              setCurrentScreen('Login');
            }}
          />
        );
      case 'AdminProducts':
        if (!requireAdmin()) return null;
        return (
          <AdminProductsScreen
            onNavigate={(screen) => setCurrentScreen(screen)}
            onLogout={() => {
              signOut?.();
              clearError?.();
              setCurrentScreen('Login');
            }}
            onEditProduct={(product) => {
              setSelectedProduct(product);
              setCurrentScreen('EditProduct');
            }}
          />
        );
      case 'AddProduct':
        if (!requireAdmin()) return null;
        return <AddProductScreen onBack={() => setCurrentScreen('AdminProducts')} />;
      case 'EditProduct':
        if (!requireAdmin()) return null;
        return <EditProductScreen product={selectedProduct} onBack={() => setCurrentScreen('AdminProducts')} />;
      case 'CategoryManagement':
        if (!requireAdmin()) return null;
        return <CategoryManagementScreen onBack={() => setCurrentScreen('AdminProducts')} />;
      case 'OrdersManagement':
        if (!requireAdmin()) return null;
        return (
          <OrdersManagementScreen
            orders={orders}
            onLogout={() => {
              signOut?.();
              clearError?.();
              setCurrentScreen('Login');
            }}
            onUpdateOrderStatus={(orderId, newStatus) => {
              const updatedOrders = orders.map((o) => {
                if (o.id === orderId) {
                  let color = o.color;
                  if (newStatus.includes('xử')) color = '#F59E0B';
                  else if (newStatus.includes('giao')) color = '#22C55E';
                  else if (newStatus.includes('đã')) color = '#0EA5E9';
                  return { ...o, status: newStatus, color };
                }
                return o;
              });
              setOrders(updatedOrders);
              AsyncStorage.setItem('orders', JSON.stringify(updatedOrders)).catch(() => {});
            }}
          />
        );
      case 'Search':
        return <SearchScreen onBackHome={() => setCurrentScreen('Home')} onProfile={() => setCurrentScreen('Profile')} />;
      case 'Product':
        return (
          <ProductScreen
            onBack={() => setCurrentScreen('Home')}
            onNavigateToCart={() => setCurrentScreen('Cart')}
            onOpenProduct={(product) => {
              setSelectedProduct(product);
              setCurrentScreen('ProductDetail');
            }}
          />
        );
      case 'ProductDetail':
        return (
          <ProductDetailScreen
            product={selectedProduct}
            onBack={() => setCurrentScreen('Product')}
            onAddToCart={({ product, size, color }) => {
              addToCart({ product, size, color });
              setCurrentScreen('Cart');
            }}
          />
        );
      case 'Cart':
        return (
          <CartScreen
            cartItems={cartItems}
            onDecreaseQty={(key) => decreaseQty(key)}
            onIncreaseQty={(key) => increaseQty(key)}
            onRemoveItem={(key) => removeItem(key)}
            onNavigateToCheckout={() => setCurrentScreen('Checkout')}
          />
        );
      case 'Checkout':
        return (
          <CheckoutScreen
            onBack={() => setCurrentScreen('Cart')}
            cartItems={cartItems}
            onPlaceOrder={(checkoutData) => {
              const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0);
              const total = subtotal + subtotal * 0.08;

              const newOrder = {
                id: 'BW-' + Math.floor(10000 + Math.random() * 90000),
                date: new Date().toLocaleDateString('vi-VN'),
                status: 'Đang xử lý',
                total: '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                items: cartItems.reduce((count, item) => count + (item.quantity || 1), 0),
                color: '#0ea5e9',
                cartItems: [...cartItems],
                customer: checkoutData?.fullName || 'Khách hàng',
                phone: checkoutData?.phone || '',
                street: checkoutData?.street || '',
                city: checkoutData?.city || '',
                postalCode: checkoutData?.postalCode || '',
                paymentMethod: checkoutData?.paymentMethod || 'Card',
              };

              const updatedOrders = [newOrder, ...orders];
              setOrders(updatedOrders);
              AsyncStorage.setItem('orders', JSON.stringify(updatedOrders)).catch(() => {});

              applyPurchase?.(cartItems);
              clearCart?.();
              setCurrentScreen('Success');
            }}
          />
        );
      case 'Success':
        return <OrderSuccessScreen onBackHome={() => setCurrentScreen('Home')} />;
      case 'Profile':
        return (
          <ProfileScreen
            user={currentUser}
            onLogout={() => {
              signOut?.();
              clearError?.();
              setCurrentScreen('Login');
            }}
            onBackHome={() => setCurrentScreen('Home')}
            onOpenSettings={() => setCurrentScreen('Settings')}
            onEditProfile={() => setCurrentScreen('EditProfile')}
            onOpenFavorites={() => setCurrentScreen('Favorites')}
            onOpenOrders={() => setCurrentScreen('Orders')}
            onOpenAddresses={() => setCurrentScreen('Addresses')}
            onOpenPayments={() => setCurrentScreen('PaymentMethods')}
          />
        );
      case 'Settings':
        return <SettingsScreen onBack={() => setCurrentScreen('Profile')} />;
      case 'EditProfile':
        return (
          <EditProfileScreen
            user={currentUser}
            onBack={() => setCurrentScreen('Profile')}
            onSave={async (updatedUser) => {
              if (!currentUser) return;
              const ok = await updateProfile?.(updatedUser);
              if (!ok) return;
              Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
              setCurrentScreen('Profile');
            }}
          />
        );
      case 'Orders':
        return (
          <OrdersScreen
            orders={orders}
            onBack={() => setCurrentScreen('Profile')}
            onCancelOrder={(orderId) => {
              const updatedOrders = orders.map((o) => (o.id === orderId ? { ...o, status: 'Đã hủy', color: '#ef4444' } : o));
              setOrders(updatedOrders);
              AsyncStorage.setItem('orders', JSON.stringify(updatedOrders)).catch(() => {});
            }}
            onEditOrder={(order) => {
              const updatedOrders = orders.filter((o) => o.id !== order.id);
              setOrders(updatedOrders);
              AsyncStorage.setItem('orders', JSON.stringify(updatedOrders)).catch(() => {});
              if (order.cartItems) replaceCart?.(order.cartItems);
              setCurrentScreen('Cart');
            }}
          />
        );
      case 'Addresses':
        return (
          <AddressesScreen
            addresses={addresses}
            onBack={() => setCurrentScreen('Profile')}
            onAddAddress={(addr) => {
              const updated = [...addresses, { ...addr, id: Date.now().toString(), isDefault: addresses.length === 0 }];
              setAddresses(updated);
              AsyncStorage.setItem('addresses', JSON.stringify(updated)).catch(() => {});
            }}
            onDeleteAddress={(id) => {
              const updated = addresses.filter((a) => a.id !== id);
              setAddresses(updated);
              AsyncStorage.setItem('addresses', JSON.stringify(updated)).catch(() => {});
            }}
            onSetDefaultAddress={(id) => {
              const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
              setAddresses(updated);
              AsyncStorage.setItem('addresses', JSON.stringify(updated)).catch(() => {});
            }}
          />
        );
      case 'PaymentMethods':
        return <PaymentMethodsScreen onBack={() => setCurrentScreen('Profile')} />;
      case 'Favorites':
        return (
          <FavoritesScreen
            onBack={() => setCurrentScreen('Profile')}
            onOpenProduct={(product) => {
              setSelectedProduct(product);
              setCurrentScreen('ProductDetail');
            }}
          />
        );
      default:
        return null;
    }
  };

  const shouldShowNav =
    currentScreen !== 'Login' &&
    currentScreen !== 'Register' &&
    currentScreen !== 'Success' &&
    currentScreen !== 'ProductDetail' &&
    currentScreen !== 'Settings' &&
    currentScreen !== 'EditProfile' &&
    currentScreen !== 'Orders' &&
    currentScreen !== 'Favorites' &&
    currentScreen !== 'Addresses' &&
    currentScreen !== 'PaymentMethods' &&
    currentScreen !== 'Chat' &&
    currentScreen !== 'AddProduct' &&
    currentScreen !== 'EditProduct' &&
    currentScreen !== 'CategoryManagement';

  const shouldShowAdminNav = currentScreen === 'Dashboard' || currentScreen === 'OrdersManagement' || currentScreen === 'AdminProducts';

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderMainContent()}</View>

      {shouldShowAdminNav && (
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('Dashboard')}>
            <Ionicons name={currentScreen === 'Dashboard' ? 'pie-chart' : 'pie-chart-outline'} size={24} color={currentScreen === 'Dashboard' ? '#0ea5e9' : '#94a3b8'} />
            <Text style={[styles.navText, currentScreen === 'Dashboard' && styles.activeNavText]}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('AdminProducts')}>
            <Ionicons name={currentScreen === 'AdminProducts' ? 'bicycle' : 'bicycle-outline'} size={24} color={currentScreen === 'AdminProducts' ? '#0ea5e9' : '#94a3b8'} />
            <Text style={[styles.navText, currentScreen === 'AdminProducts' && styles.activeNavText]}>Sản phẩm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('OrdersManagement')}>
            <Ionicons name={currentScreen === 'OrdersManagement' ? 'list' : 'list-outline'} size={24} color={currentScreen === 'OrdersManagement' ? '#0ea5e9' : '#94a3b8'} />
            <Text style={[styles.navText, currentScreen === 'OrdersManagement' && styles.activeNavText]}>Đơn hàng</Text>
          </TouchableOpacity>
        </View>
      )}

      {shouldShowNav && !shouldShowAdminNav && (
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('Home')}>
            <Ionicons name={currentScreen === 'Home' ? 'home' : 'home-outline'} size={24} color={currentScreen === 'Home' ? '#0ea5e9' : '#94a3b8'} />
            <Text style={[styles.navText, currentScreen === 'Home' && styles.activeNavText]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('Product')}>
            <Ionicons name={currentScreen === 'Product' ? 'pricetag' : 'pricetag-outline'} size={24} color={currentScreen === 'Product' ? '#0ea5e9' : '#94a3b8'} />
            <Text style={[styles.navText, currentScreen === 'Product' && styles.activeNavText]}>Sản phẩm</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('Cart')}>
            <View>
              <Ionicons name={currentScreen === 'Cart' || currentScreen === 'Checkout' ? 'cart' : 'cart-outline'} size={24} color={currentScreen === 'Cart' || currentScreen === 'Checkout' ? '#0ea5e9' : '#94a3b8'} />
              {(currentScreen === 'Cart' || currentScreen === 'Checkout') && <View style={styles.activeDot} />}
            </View>
            <Text style={[styles.navText, (currentScreen === 'Cart' || currentScreen === 'Checkout') && styles.activeNavText]}>Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('Profile')}>
            <Ionicons name={currentScreen === 'Profile' ? 'person' : 'person-outline'} size={24} color={currentScreen === 'Profile' ? '#0ea5e9' : '#94a3b8'} />
            <Text style={[styles.navText, currentScreen === 'Profile' && styles.activeNavText]}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <FavoritesProvider>
          <CartProvider>
            <AppInner />
          </CartProvider>
        </FavoritesProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  // ==========================================
  // BỐ CỤC CHÍNH
  // ==========================================
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
  },

  // ==========================================
  // THANH ĐIỀU HƯỚNG DƯỚI (BOTTOM NAV)
  // ==========================================
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 80,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    zIndex: 1000,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
  activeNavText: {
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0ea5e9',
  },
});
