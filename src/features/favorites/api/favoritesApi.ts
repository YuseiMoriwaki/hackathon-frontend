import type { Favorite } from '../types';

// Mock data
let mockFavorites: Favorite[] = [];

export async function getUserFavorites(userId: string): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userFavorites = mockFavorites
        .filter(fav => fav.userId === userId)
        .map(fav => fav.itemId);
      resolve(userFavorites);
    }, 300);
  });
}

export async function addFavorite(userId: string, itemId: string): Promise<Favorite> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFavorite: Favorite = {
        id: Date.now().toString(),
        userId,
        itemId,
        createdAt: new Date().toISOString(),
      };
      mockFavorites = [newFavorite, ...mockFavorites];
      resolve(newFavorite);
    }, 300);
  });
}

export async function removeFavorite(userId: string, itemId: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockFavorites = mockFavorites.filter(
        fav => !(fav.userId === userId && fav.itemId === itemId)
      );
      resolve();
    }, 300);
  });
}

