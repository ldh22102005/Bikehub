import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState([]);

  useEffect(() => {
    const loadFavs = async () => {
      try {
        const stored = await AsyncStorage.getItem('favoriteItems');
        if (stored) setFavoriteItems(JSON.parse(stored));
      } catch (e) {
        console.log(e);
      }
    };
    loadFavs();
  }, []);

  const toggleFavorite = useCallback((product) => {
    if (!product) return;
    setFavoriteItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      const next = exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
      AsyncStorage.setItem('favoriteItems', JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const isFavorite = useCallback((productId) => {
    return favoriteItems.some((p) => p.id === productId);
  }, [favoriteItems]);

  const value = useMemo(() => ({ favoriteItems, toggleFavorite, isFavorite }), [favoriteItems, toggleFavorite, isFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};