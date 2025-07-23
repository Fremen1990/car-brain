# Car-Brain App

## Architecture Decision: Pseudo-Monorepo

**Using separate standalone apps in one repository** - Here's why:
- Latest versions of all technologies (React Native 0.76+, Next.js 15, React 19)
- No monorepo tooling complexity
- Simple development workflow for solo developer
- Easy to share types via a shared folder
- Can evolve to full monorepo later if needed

### 🚀 Repository Structure

```
car-brain/
├── mobile/                  # Standalone Expo React Native app
├── web/                     # Standalone Next.js app (when needed)
├── shared/                  # Shared types and utilities
│   ├── types/
│   ├── schemas/            # Zod validation schemas
│   └── constants/
├── .gitignore
└── README.md
```

## Car-Brain Development Plan

### 🎯 Project Overview

**Tech Stack:**
- **Mobile**: Expo React Native 0.76+, TypeScript, Tamagui, NativeWind
- **Web**: Next.js 15, React 19, TypeScript, Tailwind CSS (future)
- **State**: Zustand (global store)
- **Forms**: React Hook Form + Zod
- **Backend**: Appwrite (Auth, Database, Storage)
- **Build**: EAS Build (mobile), Vercel (web)
- **Runtime**: Bun
- **Architecture**: Clean Architecture, Offline-first

### 📁 Mobile App Structure

```
car-brain/mobile/
├── app/                     # Expo Router screens
├── components/              # UI components
├── features/                # Feature modules
│   ├── auth/
│   ├── cars/
│   ├── services/
│   └── drivers/
├── services/               # API and external services
├── store/                  # Zustand store
├── hooks/                  # Custom React hooks
├── utils/                  # Utilities
├── metro.config.js         # Metro configuration
├── package.json
├── app.json               # Expo configuration
└── eas.json               # EAS Build configuration
```

---

## 📋 Stage 1: Foundation & Setup (Week 1-2)

### Goals
- Complete development environment setup
- Basic app structure with navigation
- Authentication flow
- Offline-first architecture

### Tasks

#### 1.1 Project Initialization
```bash
# Create project structure
mkdir car-brain && cd car-brain
mkdir shared mobile

# Initialize mobile app with latest Expo
cd mobile
bunx create-expo-app@latest . --template blank-typescript

# Install core dependencies
bun add expo@~51.0.0 react-native@0.76.5
bun add zustand react-hook-form zod
bun add @tamagui/core @tamagui/config @tamagui/animations-react-native
bun add @react-native-async-storage/async-storage
bun add expo-router expo-image expo-camera
bun add appwrite
```

#### 1.2 Shared Types Setup
```bash
cd ../shared
mkdir types schemas constants

# Create shared types structure
touch types/index.ts types/user.types.ts types/car.types.ts
touch schemas/index.ts schemas/car.schema.ts
```

#### 1.3 Metro Configuration for Shared Folder
```javascript
// mobile/metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add shared folder to watchFolders
config.watchFolders = [
  path.resolve(__dirname, '../shared')
];

module.exports = config;
```

#### 1.4 Core Types Setup
```typescript
// shared/types/user.types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  authProvider: 'email' | 'google' | 'apple';
  createdAt: Date;
}

// shared/types/car.types.ts
export interface Car {
  id: string;
  userId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  imageUrl?: string;
  localImageUri?: string; // For offline support
  details?: CarDetails;
  createdAt: Date;
  updatedAt: Date;
  syncStatus: 'synced' | 'pending' | 'error';
}

// mobile/.env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
EXPO_PUBLIC_POLAND_VIN_API=https://api.cepik.gov.pl/
```

#### 1.5 Authentication Setup
- Implement Appwrite SDK wrapper
- Create auth service with offline queue
- Build login/signup screens with Tamagui
- Set up secure token storage

#### 1.6 Offline-First Architecture
```typescript
// mobile/services/offline-queue.ts
export class OfflineQueue {
  private queue: QueuedAction[] = [];
  
  async addToQueue(action: QueuedAction) {
    // Store in AsyncStorage
    // Process when online
  }
}
```

#### 1.7 Navigation Structure
- Implement Expo Router with typed routes
- Create auth guard for protected routes
- Set up tab navigation structure

#### 1.8 EAS Build Configuration
```json
// mobile/eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "prebuildCommand": "cp -r ../shared ./src/shared-types"
    },
    "production": {
      "prebuildCommand": "cp -r ../shared ./src/shared-types"
    }
  }
}
```

### Deliverables
- Working authentication (Google, Apple, Email)
- Basic navigation structure
- Offline queue system
- Clean architecture foundation
- Shared types working between future apps

---

## 📋 Stage 2: Core Car Management (Week 3-4)

### Goals
- VIN lookup integration
- Car CRUD operations
- Image upload functionality
- Driver management

### Tasks

#### 2.1 VIN Lookup Service
```typescript
// mobile/services/vin-service.ts
import { CarDetails } from '../../shared/types';

export class VINService {
  async lookupVIN(vin: string): Promise<CarDetails> {
    // Integrate with Polish government API
    // Cache results locally
    // Handle offline scenarios
  }
}
```

#### 2.2 Car Management
- Create car list screen
- Add car form with VIN lookup
- Image capture/upload with compression
- Implement 2-car limit for free tier

#### 2.3 Zustand Store Setup
```typescript
// mobile/store/index.ts
import { Car, Driver } from '../../shared/types';

interface AppState {
  user: User | null;
  cars: Car[];
  drivers: Driver[];
  isOffline: boolean;
  
  // Actions
  addCar: (car: Car) => void;
  updateCar: (id: string, updates: Partial<Car>) => void;
  deleteCar: (id: string) => void;
}
```

#### 2.4 Image Management
- Camera integration
- Image picker
- Compression before upload
- Appwrite bucket integration

#### 2.5 Driver Management
- Add/edit/delete drivers
- Assign drivers to cars
- Driver profile management

### Deliverables
- Complete car management flow
- VIN lookup working
- Image upload functional
- Driver management ready

---

## 🌐 Future Web App Integration

When ready to add web app:

```bash
# From root directory
cd car-brain
mkdir web && cd web

# Create Next.js app with latest versions
bunx create-next-app@latest . --typescript --tailwind --app

# Web will import shared types
import { Car, User } from '../../shared/types';
```

---

## 📊 Development Workflow

### For Mobile Development:
```bash
cd car-brain/mobile
bun install
bun run ios     # iOS Simulator
bun run android # Android Emulator
```

### For Shared Types:
- Edit files in `shared/` folder
- Changes automatically reflected in mobile app
- No build step required

### Git Workflow:
```bash
# Work on main branch (solo developer advantage)
git add .
git commit -m "feat: add car management"
git push

# Feature branches for experiments only
git checkout -b experiment/new-ui
```

---

## 🚀 Deployment

### Mobile App:
```bash
cd mobile
eas build --platform all
eas submit
```

### Web App (Future):
```bash
cd web
vercel deploy
```

---

## 📋 Subsequent Stages

[Keep stages 3-8 as they were, but update import paths to use shared folder]

---

## 🛠️ Development Best Practices

### Code Standards
```typescript
// Use shared types across apps
import { Car, User } from '../../shared/types';
import { CreateCarSchema } from '../../shared/schemas';

// Clean, testable service example
export class CarService {
  constructor(
    private readonly storage: StorageService,
    private readonly api: APIService,
    private readonly queue: OfflineQueue
  ) {}

  async createCar(data: CreateCarDto): Promise<Car> {
    const validated = CreateCarSchema.parse(data);
    const car = await this.storage.saveCar(validated);
    this.queue.addToQueue({
      type: 'CREATE_CAR',
      data: car,
      retry: true
    });
    return car;
  }
}
```

### Solo Developer Advantages:
- Direct commits to main branch
- Rapid prototyping
- Easy refactoring
- No merge conflicts
- Full control over architecture decisions

This plan provides a clear path from MVP to full-featured app while maintaining clean architecture and the flexibility to add a web app when needed. The pseudo-monorepo structure keeps things simple while allowing code sharing through the shared folder.
