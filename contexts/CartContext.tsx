import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { CartItem, CustomMeal } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (meal: CustomMeal) => void;
  removeFromCart: (mealId: number) => void;
  updateQuantity: (mealId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (meal: CustomMeal) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === meal.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...meal, quantity: 1 }];
    });
  };

  const removeFromCart = (mealId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== mealId));
  };
  
  const updateQuantity = (mealId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(mealId);
    } else {
      setCart(prevCart => prevCart.map(item =>
        item.id === mealId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};