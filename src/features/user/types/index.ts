export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  createdAt: string;
  itemsCount?: number;
  purchasesCount?: number;
}

export interface UserProfileUpdate {
  name?: string;
  avatar?: string;
  bio?: string;
  location?: string;
}
