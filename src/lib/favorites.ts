import { useState, useEffect } from 'react';

const STORAGE_KEY = 'primenest_saved_favorites';

export function getSavedFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getSavedFavorites());
  }, []);

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId];
      saveFavorites(next);
      return next;
    });
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  return { favorites, toggleFavorite, isFavorite };
}
