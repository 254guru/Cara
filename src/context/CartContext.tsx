'use client';

import { createContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { CartItem, Product } from '@/types';
import { getDefaultProductUnit } from '@/lib/productUnits';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  syncing: boolean;
}

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: { product: Product; size: string } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'UPDATE_SIZE'; payload: { id: number; size: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_SYNCING'; payload: boolean };

export interface CartContextType {
  state: CartState;
  addItem: (product: Product, size?: string) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  updateSize: (id: number, size: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: number;
  itemCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'cara-cart';

function loadLocalCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* quota exceeded, ignore */ }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload, syncing: false };
    case 'ADD_ITEM': {
      const exists = state.items.find((item) => item.id === action.payload.product.id);
      if (exists) return state;
      return {
        ...state,
        items: [...state.items, { ...action.payload.product, quantity: 1, size: action.payload.size }],
      };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };
    case 'UPDATE_SIZE':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, size: action.payload.size } : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'SET_SYNCING':
      return { ...state, syncing: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.id;

  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false, syncing: false });

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  // Load cart: from server if logged in, from localStorage if guest
  useEffect(() => {
    if (isLoggedIn) {
      dispatch({ type: 'SET_SYNCING', payload: true });
      fetch('/api/cart')
        .then((r) => r.json())
        .then((data) => {
          if (data.items) {
            const mapped: CartItem[] = data.items.map((ci: { product: Product; quantity: number; size: string }) => ({
              ...ci.product,
              quantity: ci.quantity,
              size: ci.size,
            }));
            dispatch({ type: 'SET_ITEMS', payload: mapped });
          }
        })
        .catch(() => dispatch({ type: 'SET_SYNCING', payload: false }));
    } else {
      dispatch({ type: 'SET_ITEMS', payload: loadLocalCart() });
    }
  }, [isLoggedIn]);

  // Persist guest cart to localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      saveLocalCart(state.items);
    }
  }, [state.items, isLoggedIn]);

  // Server sync helper
  const syncToServer = useCallback(
    async (action: 'add' | 'remove' | 'update' | 'clear', payload?: Record<string, unknown>) => {
      if (!isLoggedIn) return;
      try {
        if (action === 'add' || action === 'update') {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } else if (action === 'remove') {
          await fetch(`/api/cart?id=${payload?.cartItemId}`, { method: 'DELETE' });
        } else if (action === 'clear') {
          await fetch('/api/cart?clear=true', { method: 'DELETE' });
        }
      } catch { /* silent fail — local state is still correct */ }
    },
    [isLoggedIn],
  );

  const addItem = useCallback(
    (product: Product, size?: string) => {
      const resolvedSize = size || getDefaultProductUnit(product);
      dispatch({ type: 'ADD_ITEM', payload: { product, size: resolvedSize } });
      syncToServer('add', { productId: product.id, quantity: 1, size: resolvedSize });
    },
    [syncToServer],
  );

  const removeItem = useCallback(
    (id: number) => {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
      syncToServer('remove', { cartItemId: id.toString() });
    },
    [syncToServer],
  );

  const updateQuantity = useCallback(
    (id: number, quantity: number) => {
      const existing = state.items.find((item) => item.id === id);
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
      syncToServer('update', { productId: id, quantity, size: existing?.size || 'Standard' });
    },
    [state.items, syncToServer],
  );

  const updateSize = useCallback(
    (id: number, size: string) => {
      const existing = state.items.find((item) => item.id === id);
      dispatch({ type: 'UPDATE_SIZE', payload: { id, size } });
      syncToServer('update', { productId: id, quantity: existing?.quantity || 1, size });
    },
    [state.items, syncToServer],
  );

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    syncToServer('clear');
    saveLocalCart([]);
  }, [syncToServer]);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        updateSize,
        clearCart,
        openCart: () => dispatch({ type: 'OPEN_CART' }),
        closeCart: () => dispatch({ type: 'CLOSE_CART' }),
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
