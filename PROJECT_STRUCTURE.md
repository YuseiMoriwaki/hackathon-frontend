# Flea Market App - Project Structure

## Overview
This is a Next.js-based flea market application with a feature-based architecture, using SWR for data fetching and mock APIs for backend simulation.

## Architecture Principles

### 1. **Slim App Router Pages**
Pages in `src/app` are minimal (5-15 lines), only handling routing, metadata, and composition of feature components.

### 2. **Feature Encapsulation**
Each feature in `src/features` is self-contained with:
- Types
- Mock API functions
- SWR hooks for data fetching and mutations
- Internal components
- Page-level components
- Public API exports via `index.ts`

### 3. **Data Fetching with SWR**
- Read operations: `useSWR`
- Write operations: `useSWRMutation`
- Automatic revalidation and caching

## Directory Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public routes (no auth required)
│   │   ├── items/           # Item listing and details
│   │   └── users/           # Public user profiles
│   ├── (private)/           # Protected routes (auth required)
│   │   ├── home/            # Dashboard
│   │   ├── sell/            # Create/edit listings
│   │   └── user/            # User profile management
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── layout.tsx           # Root layout with Providers
│   └── providers.tsx        # SWR configuration
│
├── components/              # Shared UI components
│   ├── ui/                  # Basic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   └── layouts/             # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Container.tsx
│
├── features/                # Feature modules (encapsulated)
│   ├── auth/
│   │   ├── api/             # Mock authentication API
│   │   ├── components/      # Login/Register forms, AuthGuard
│   │   ├── hooks/           # useAuth, useLogin, useRegister, useLogout
│   │   ├── types/
│   │   └── index.ts         # Public exports
│   │
│   ├── items/
│   │   ├── api/             # Mock items CRUD API
│   │   ├── components/      # ItemCard, ItemDetail, ItemForm, etc.
│   │   ├── hooks/           # useItems, useItem, useCreateItem, etc.
│   │   ├── pages/           # ItemListPage, ItemDetailPage, ItemFormPage
│   │   ├── types/
│   │   ├── constants/
│   │   └── index.ts
│   │
│   ├── purchase/
│   │   ├── api/             # Mock purchase API
│   │   ├── components/      # PurchaseModal
│   │   ├── hooks/           # usePurchase, usePurchaseHistory
│   │   ├── types/
│   │   └── index.ts
│   │
│   └── user/
│       ├── api/             # Mock user API
│       ├── components/      # UserProfile, ProfileEditForm
│       ├── hooks/           # useUser, useUpdateUser, useUserListings
│       ├── pages/           # UserProfilePage, UserListingsPage
│       ├── types/
│       └── index.ts
│
└── lib/                     # Shared utilities
    └── swr/
        └── config.ts        # SWR global configuration
```

## Features

### 1. Authentication (`features/auth`)
- Login/Register with mock authentication
- Session persistence via localStorage
- AuthGuard component for protected routes
- Test credentials: `test@example.com` / `password`

### 2. Items (`features/items`)
- Browse items with filters (category, price, search)
- View item details
- Create/edit/delete listings (authenticated users)
- Image upload support (URL-based)
- Full CRUD with SWR mutations

### 3. Purchase (`features/purchase`)
- Multi-step purchase flow modal
- Shipping address collection
- Payment method selection
- Purchase history tracking

### 4. User Profile (`features/user`)
- View/edit user profile
- User's item listings
- Purchase history
- Public profile pages

## Key Files

### Feature Exports Example
```typescript
// features/items/index.ts
export { ItemListPage } from './pages/ItemListPage';
export { ItemDetailPage } from './pages/ItemDetailPage';
export { ItemFormPage } from './pages/ItemFormPage';
export { ItemCard } from './components/ItemCard';
export type { Item, ItemFormData, ItemFilters } from './types';
```

### SWR Hook Example
```typescript
// Read hook
export function useItems(filters?: ItemFilters) {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/items',
    () => getItems(filters)
  );
  return { items: data, isLoading, isError: error, mutate };
}

// Write hook
export function useCreateItem() {
  const { trigger, isMutating } = useSWRMutation(
    '/api/items',
    async (_, { arg }) => createItem(arg),
    { onSuccess: () => mutate('/api/items') }
  );
  return { createItem: trigger, isCreating: isMutating };
}
```

### Mock API Example
```typescript
// features/items/api/itemsApi.ts
let mockItems: Item[] = [/* mock data */];

export async function getItems(): Promise<Item[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockItems), 500);
  });
}

export async function createItem(data: ItemFormData): Promise<Item> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem = { ...data, id: Date.now().toString() };
      mockItems = [newItem, ...mockItems];
      resolve(newItem);
    }, 500);
  });
}
```

## Backend Integration

When ready to connect to a real backend:

1. Update API functions in `features/*/api/*.ts`
2. Replace mock implementations with actual fetch calls
3. No changes needed to hooks or components!

```typescript
// Before (mock)
export async function getItems(): Promise<Item[]> {
  return new Promise(resolve => {
    setTimeout(() => resolve(mockItems), 500);
  });
}

// After (real backend)
export async function getItems(): Promise<Item[]> {
  const response = await fetch('http://api.example.com/items');
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}
```

## Routes

### Public Routes
- `/` - Redirects to items list
- `/items` - Browse all items
- `/items/[id]` - Item details
- `/users/[id]` - Public user profile
- `/login` - Login page
- `/register` - Register page

### Private Routes (require authentication)
- `/home` - User dashboard
- `/sell` - Create new listing
- `/sell/[id]` - Edit existing listing
- `/user` - Own profile
- `/user/listings` - User's listings
- `/user/purchases` - Purchase history

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Technologies
- **Next.js 15** - App Router
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **SWR** - Data fetching and caching
- **Mock APIs** - Backend simulation

## Notes
- All data is stored in memory (mock APIs)
- Authentication uses localStorage for persistence
- Images use placeholder URLs (placehold.co)
- Ready for backend integration with minimal changes

