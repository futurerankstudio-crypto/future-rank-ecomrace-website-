import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, CurrencyCode, StoreNotification } from '../types/index.ts';
import { INITIAL_PRODUCTS } from '../data/initialData.ts';

interface StoreContextType {
  products: Product[];
  isLoadingProducts: boolean;
  cart: CartItem[];
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (pkrAmount: number) => string;
  activeView: 'storefront' | 'shop' | 'product_detail' | 'about' | 'contact' | 'faq' | 'size_guide' | 'admin';
  setActiveView: (view: 'storefront' | 'shop' | 'product_detail' | 'about' | 'contact' | 'faq' | 'size_guide' | 'admin') => void;
  selectedProductId: string | null;
  openProductDetail: (id: string) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, newQty: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  notifications: StoreNotification[];
  refreshNotifications: () => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Conversion rates against PKR base
const CURRENCY_RATES: Record<CurrencyCode, { rate: number; symbol: string; prefix: string }> = {
  PKR: { rate: 1, symbol: 'Rs. ', prefix: 'PKR ' },
  USD: { rate: 0.0036, symbol: '$', prefix: '$' },
  AED: { rate: 0.013, symbol: 'AED ', prefix: 'AED ' },
  GBP: { rate: 0.0028, symbol: '£', prefix: '£' },
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>('PKR');
  const [activeView, setActiveView] = useState<'storefront' | 'shop' | 'product_detail' | 'about' | 'contact' | 'faq' | 'size_guide' | 'admin'>('storefront');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notifications, setNotifications] = useState<StoreNotification[]>([]);

  // Local storage persisted cart & wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('novacart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('novacart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('novacart_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('novacart_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Fetch live products from backend
  const refreshProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          const remoteProducts = data.products as Product[];
          const remoteIds = new Set(remoteProducts.map((product) => product.id));
          const additionalShowcaseProducts = INITIAL_PRODUCTS.filter((product) => Number(product.id.split('-')[1]) >= 7 && !remoteIds.has(product.id));
          setProducts([...remoteProducts, ...additionalShowcaseProducts]);
        }
      }
    } catch (e) {
      console.warn('Using local catalog fallback:', e);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const refreshNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        if (data.notifications) {
          setNotifications(data.notifications);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshProducts();
    refreshNotifications();
  }, []);

  const formatPrice = (pkrAmount: number) => {
    const config = CURRENCY_RATES[currency];
    const converted = pkrAmount * config.rate;
    if (currency === 'PKR') {
      return `Rs. ${Math.round(converted).toLocaleString()}`;
    }
    return `${config.symbol}${converted.toFixed(2)}`;
  };

  const openProductDetail = (id: string) => {
    setSelectedProductId(id);
    setActiveView('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    if (product.stock <= 0) {
      return { success: false, message: 'This item is currently out of stock.' };
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedSize === size && item.selectedColor === color
      );

      const unitPrice = product.salePrice || product.price;

      if (existingIndex > -1) {
        const newQty = prev[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            selectedSize: size,
            selectedColor: color,
            quantity: Math.min(quantity, product.stock),
            unitPrice
          }
        ];
      }
    });

    setIsCartOpen(true);
    return { success: true, message: `Added "${product.name}" to cart.` };
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.selectedSize === size && item.selectedColor === color)
      )
    );
  };

  const updateCartQuantity = (productId: string, size: string, color: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    const currentProd = products.find((p) => p.id === productId);
    const maxStock = currentProd ? currentProd.stock : 99;

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.selectedSize === size && item.selectedColor === color) {
          return {
            ...item,
            quantity: Math.min(newQty, maxStock)
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        isLoadingProducts,
        cart,
        currency,
        setCurrency,
        formatPrice,
        activeView,
        setActiveView,
        selectedProductId,
        openProductDetail,
        quickViewProduct,
        setQuickViewProduct,
        isCartOpen,
        setIsCartOpen,
        isAssistantOpen,
        setIsAssistantOpen,
        wishlist,
        toggleWishlist,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        notifications,
        refreshNotifications,
        refreshProducts
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
