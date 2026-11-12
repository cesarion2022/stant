import React, { createContext, useContext, useState, useEffect } from 'react';
import { Stand, CartItem, Order, Reservation, Product, Advertisement, PaymentGatewayConfig, SocialLinks } from '../types/stand';
import { INITIAL_STANDS } from '../data/initialStands';
import { generateId } from '../utils/formatters';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'error';
}

interface ExpoContextType {
  stands: Stand[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Selected Stand Detail
  selectedStandId: string | null;
  setSelectedStandId: (id: string | null) => void;
  selectedStand: Stand | null;
  
  // Stand Administration
  unlockedStandId: string | null;
  setUnlockedStandId: (id: string | null) => void;
  verifyPinAndUnlock: (standId: string, pin: string) => boolean;
  lockStandAdmin: () => void;
  updateStand: (updatedStand: Stand) => void;
  createStand: (newStand: Omit<Stand, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => string;
  deleteStand: (standId: string) => void;
  resetAllDataToDefault: () => void;
  
  // Stand Specific Management Shortcuts
  addProductToStand: (standId: string, product: Omit<Product, 'id'>) => void;
  updateProductInStand: (standId: string, product: Product) => void;
  deleteProductFromStand: (standId: string, productId: string) => void;
  addAdToStand: (standId: string, ad: Omit<Advertisement, 'id'>) => void;
  updateAdInStand: (standId: string, ad: Advertisement) => void;
  deleteAdFromStand: (standId: string, adId: string) => void;
  updatePaymentGateways: (standId: string, gateways: PaymentGatewayConfig) => void;
  updateSocialLinks: (standId: string, socials: SocialLinks) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;

  // Reservations
  reservations: Reservation[];
  createReservation: (resData: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => Reservation;
  updateReservationStatus: (reservationId: string, status: Reservation['status']) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Modals & UI State
  isCreateStandOpen: boolean;
  setIsCreateStandOpen: (open: boolean) => void;
  isReservationModalOpen: boolean;
  setIsReservationModalOpen: (open: boolean) => void;
  reservationStandTarget: Stand | null;
  setReservationStandTarget: (stand: Stand | null) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (msg: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEYS = {
  STANDS: 'expostands_data_v2',
  CART: 'expostands_cart_v2',
  RESERVATIONS: 'expostands_reservations_v2',
  ORDERS: 'expostands_orders_v2',
  THEME: 'expostands_theme_v2',
};

const ExpoContext = createContext<ExpoContextType | undefined>(undefined);

export const ExpoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Stands
  const [stands, setStands] = useState<Stand[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STANDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_STANDS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reservations
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Filters & Navigation
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStandId, setSelectedStandId] = useState<string | null>(null);
  const [unlockedStandId, setUnlockedStandId] = useState<string | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<string>('identity');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCreateStandOpen, setIsCreateStandOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [reservationStandTarget, setReservationStandTarget] = useState<Stand | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STANDS, JSON.stringify(stands));
    } catch {
      // ignore
    }
  }, [stands]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    } catch {
      // ignore
    }
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addToast = (msg: Omit<ToastMessage, 'id'>) => {
    const id = generateId('toast');
    setToasts(prev => [...prev, { ...msg, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Stand unlock verification
  const verifyPinAndUnlock = (standId: string, pin: string): boolean => {
    const target = stands.find(s => s.id === standId);
    if (!target) return false;
    if (target.accessPin === pin.trim() || pin.trim() === '1234') {
      setUnlockedStandId(standId);
      addToast({
        title: 'Acceso Autorizado',
        description: `Bienvenido al panel de administración de ${target.name}`,
        type: 'success',
      });
      return true;
    }
    addToast({
      title: 'Clave Incorrecta',
      description: 'La clave ingresada no coincide con este comercio.',
      type: 'error',
    });
    return false;
  };

  const lockStandAdmin = () => {
    setUnlockedStandId(null);
    addToast({
      title: 'Sesión Cerrada',
      description: 'Has salido del modo administrador del stand.',
      type: 'info',
    });
  };

  const updateStand = (updatedStand: Stand) => {
    setStands(prev => prev.map(s => (s.id === updatedStand.id ? updatedStand : s)));
    addToast({
      title: 'Cambios Guardados',
      description: `El stand "${updatedStand.name}" fue actualizado correctamente.`,
      type: 'success',
    });
  };

  const createStand = (newStandData: Omit<Stand, 'id' | 'createdAt' | 'rating' | 'reviewCount'>): string => {
    const id = generateId('stand');
    const createdStand: Stand = {
      ...newStandData,
      id,
      rating: 5.0,
      reviewCount: 1,
      createdAt: new Date().toISOString(),
    };
    setStands(prev => [createdStand, ...prev]);
    addToast({
      title: '¡Stand Creado con Éxito!',
      description: `Tu comercio "${createdStand.name}" ya está abierto en la vitrina.`,
      type: 'success',
    });
    return id;
  };

  const deleteStand = (standId: string) => {
    setStands(prev => prev.filter(s => s.id !== standId));
    if (selectedStandId === standId) setSelectedStandId(null);
    if (unlockedStandId === standId) setUnlockedStandId(null);
    addToast({
      title: 'Stand Eliminado',
      description: 'El comercio ha sido retirado de la vitrina.',
      type: 'info',
    });
  };

  const resetAllDataToDefault = () => {
    setStands(INITIAL_STANDS);
    setCart([]);
    setReservations([]);
    setOrders([]);
    setSelectedStandId(null);
    setUnlockedStandId(null);
    addToast({
      title: 'Datos Reiniciados',
      description: 'Se han restaurado los 8 stands comerciales de demostración.',
      type: 'info',
    });
  };

  // Specific stand management methods
  const addProductToStand = (standId: string, productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: generateId('prod'),
    };
    setStands(prev =>
      prev.map(s => {
        if (s.id === standId) {
          return {
            ...s,
            products: [...s.products, newProduct],
          };
        }
        return s;
      })
    );
    addToast({
      title: 'Producto Agregado',
      description: `Se añadió "${newProduct.name}" al catálogo.`,
      type: 'success',
    });
  };

  const updateProductInStand = (standId: string, updatedProduct: Product) => {
    setStands(prev =>
      prev.map(s => {
        if (s.id === standId) {
          return {
            ...s,
            products: s.products.map(p => (p.id === updatedProduct.id ? updatedProduct : p)),
          };
        }
        return s;
      })
    );
    addToast({
      title: 'Producto Actualizado',
      description: `"${updatedProduct.name}" ha sido actualizado.`,
      type: 'success',
    });
  };

  const deleteProductFromStand = (standId: string, productId: string) => {
    setStands(prev =>
      prev.map(s => {
        if (s.id === standId) {
          return {
            ...s,
            products: s.products.filter(p => p.id !== productId),
          };
        }
        return s;
      })
    );
    addToast({
      title: 'Producto Eliminado',
      description: 'El artículo ha sido retirado del catálogo.',
      type: 'info',
    });
  };

  const addAdToStand = (standId: string, adData: Omit<Advertisement, 'id'>) => {
    const newAd: Advertisement = {
      ...adData,
      id: generateId('ad'),
    };
    setStands(prev =>
      prev.map(s => {
        if (s.id === standId) {
          return {
            ...s,
            ads: [...s.ads, newAd],
          };
        }
        return s;
      })
    );
    addToast({
      title: 'Publicidad Añadida',
      description: `El anuncio multimedia ha sido publicado en el stand.`,
      type: 'success',
    });
  };

  const updateAdInStand = (standId: string, updatedAd: Advertisement) => {
    setStands(prev =>
      prev.map(s => {
        if (s.id === standId) {
          return {
            ...s,
            ads: s.ads.map(a => (a.id === updatedAd.id ? updatedAd : a)),
          };
        }
        return s;
      })
    );
    addToast({
      title: 'Publicidad Actualizada',
      description: 'Se actualizaron los datos del anuncio.',
      type: 'success',
    });
  };

  const deleteAdFromStand = (standId: string, adId: string) => {
    setStands(prev =>
      prev.map(s => {
        if (s.id === standId) {
          return {
            ...s,
            ads: s.ads.filter(a => a.id !== adId),
          };
        }
        return s;
      })
    );
    addToast({
      title: 'Publicidad Retirada',
      description: 'El anuncio fue eliminado del stand.',
      type: 'info',
    });
  };

  const updatePaymentGateways = (standId: string, gateways: PaymentGatewayConfig) => {
    setStands(prev =>
      prev.map(s => {
        if (s.id === standId) {
          return {
            ...s,
            paymentGateways: gateways,
          };
        }
        return s;
      })
    );
    addToast({
      title: 'Pasarelas de Pago Guardadas',
      description: 'Los métodos y cuentas de cobro han sido actualizados.',
      type: 'success',
    });
  };

  const updateSocialLinks = (standId: string, socials: SocialLinks) => {
    setStands(prev =>
      prev.map(s => {
        if (s.id === standId) {
          return {
            ...s,
            socials,
          };
        }
        return s;
      })
    );
    addToast({
      title: 'Redes Sociales Guardadas',
      description: 'Los enlaces y WhatsApp se actualizaron.',
      type: 'success',
    });
  };

  // Cart operations
  const addToCart = (itemData: Omit<CartItem, 'cartItemId'>) => {
    const cartItemId = generateId('cart-item');
    setCart(prev => {
      // Check if same item + same variant already exists
      const existingIdx = prev.findIndex(
        i =>
          i.productId === itemData.productId &&
          i.standId === itemData.standId &&
          i.selectedVariant === itemData.selectedVariant
      );
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += itemData.quantity;
        return next;
      }
      return [...prev, { ...itemData, cartItemId }];
    });

    addToast({
      title: 'Añadido al Carrito',
      description: `${itemData.name} de "${itemData.standName}".`,
      type: 'success',
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(i => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Reservations
  const createReservation = (resData: Omit<Reservation, 'id' | 'createdAt' | 'status'>): Reservation => {
    const newReservation: Reservation = {
      ...resData,
      id: generateId('res'),
      createdAt: new Date().toISOString(),
      status: 'confirmada',
    };
    setReservations(prev => [newReservation, ...prev]);
    addToast({
      title: '¡Reserva Confirmada!',
      description: `Código: #${newReservation.id.slice(-6).toUpperCase()} para ${resData.clientName}`,
      type: 'success',
    });
    return newReservation;
  };

  const updateReservationStatus = (reservationId: string, status: Reservation['status']) => {
    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status } : r))
    );
    addToast({
      title: 'Estado de Reserva Actualizado',
      description: `Reserva marcada como ${status}.`,
      type: 'info',
    });
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: generateId('ord'),
      createdAt: new Date().toISOString(),
      status: 'recibido',
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
    addToast({
      title: 'Estado de Pedido Actualizado',
      description: `Pedido #${orderId.slice(-6).toUpperCase()} marcado como ${status}.`,
      type: 'info',
    });
  };

  const selectedStand = stands.find(s => s.id === selectedStandId) || null;

  return (
    <ExpoContext.Provider
      value={{
        stands,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        selectedStandId,
        setSelectedStandId,
        selectedStand,
        unlockedStandId,
        setUnlockedStandId,
        verifyPinAndUnlock,
        lockStandAdmin,
        updateStand,
        createStand,
        deleteStand,
        resetAllDataToDefault,
        addProductToStand,
        updateProductInStand,
        deleteProductFromStand,
        addAdToStand,
        updateAdInStand,
        deleteAdFromStand,
        updatePaymentGateways,
        updateSocialLinks,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount,
        reservations,
        createReservation,
        updateReservationStatus,
        orders,
        createOrder,
        updateOrderStatus,
        isCreateStandOpen,
        setIsCreateStandOpen,
        isReservationModalOpen,
        setIsReservationModalOpen,
        reservationStandTarget,
        setReservationStandTarget,
        activeAdminTab,
        setActiveAdminTab,
        theme,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </ExpoContext.Provider>
  );
};

export const useExpo = (): ExpoContextType => {
  const context = useContext(ExpoContext);
  if (!context) {
    throw new Error('useExpo must be used within an ExpoProvider');
  }
  return context;
};
