# Adopt Me Live Weekly Pets Update & Live Value Checker - Enhanced Features Prompt

## Project Overview
Build an enhanced Adopt Me value checker website that provides live pet values from multiple sources, manual inventory management for users, and weekly pet updates following the Adopt Me content schedule.

## Tech Stack
- **Framework**: Next.js 16.2.4 (App Router)
- **Database**: Supabase (already configured)
- **State Management**: Zustand
- **UI Components**: Radix UI, Tailwind CSS, Framer Motion
- **Search**: Fuse.js
- **Date Utilities**: date-fns

---

## Core Features to Implement

### 1. Manual Inventory Management System

#### User Inventory Features
- **Add Pets to Inventory**
  - Searchable pet database with autocomplete
  - Select pet variants (Normal, Neon, Mega, Fly, Ride)
  - Add multiple quantities of same pet
  - Upload/screenshot inventory from Roblox (optional OCR feature)

- **Inventory Dashboard**
  - View all owned pets in a grid/list view
  - Filter by rarity, value tier, pet type
  - Sort by name, value, date added
  - Total portfolio value calculation

- **Inventory Actions**
  - Edit pet details (change variant, quantity)
  - Remove pets from inventory
  - Export inventory as JSON/CSV
  - Share inventory link (public/private)

- **Inventory Persistence**
  - Store inventory in Supabase database
  - User authentication (Supabase Auth)
  - Sync across devices
  - Offline support with local storage

#### Database Schema (Supabase)
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inventories table
CREATE TABLE inventories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inventory items
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id UUID REFERENCES inventories(id),
  pet_name TEXT NOT NULL,
  variant TEXT DEFAULT 'normal', -- normal, neon, mega, fly, ride, mega_fly, mega_ride, mega_fly_ride
  quantity INTEGER DEFAULT 1,
  added_at TIMESTAMP DEFAULT NOW()
);
```

---

### 2. Multi-Source Live Value Checking

#### Value Data Sources (Minimum 3)
Fetch and aggregate values from these websites:

1. **Adopt Me True Values** (adoptmetruevalues.com)
   - True, Shark, and Frost value systems
   - Updates every few minutes
   - No sign-up required

2. **Adopt From Me** (adoptfrom.me)
   - Tracks live trades and marketplace activity
   - Cookies value system
   - Real-time player data

3. **Elvebredd** (elvebredd.com)
   - WFL (Win/Fair/Lose) calculator
   - Community-driven values

4. **Optional Additional Sources**:
   - Adopt Me Trading Values (adoptmetradingvalues.com)
   - AMVGG (amvgg.com)

#### Value Aggregation Logic
- **Fetch Strategy**: 
  - Fetch from all sources every 5-10 minutes
  - Cache results in Supabase with timestamp
  - Use cron job or Next.js API routes for scheduled fetching

- **Value Calculation**:
  - Calculate average value across sources
  - Show min/max values for transparency
  - Display confidence score based on source agreement
  - Flag values with high variance between sources

- **Display Format**:
  ```
  Pet: Shadow Dragon
  Average Value: 45,000 Cookies
  Range: 40,000 - 50,000 Cookies
  Sources: 3/3 agree (High confidence)
  Last Updated: 2 minutes ago
  ```

#### API Implementation
```typescript
// Value fetching service
interface PetValue {
  petName: string;
  source: string;
  value: number;
  currency: string; // cookies, shark, frost
  timestamp: Date;
}

interface AggregatedValue {
  petName: string;
  averageValue: number;
  minValue: number;
  maxValue: number;
  sources: PetValue[];
  confidence: 'high' | 'medium' | 'low';
  lastUpdated: Date;
}

// Fetch from multiple sources
async function fetchAllSources(): Promise<PetValue[]> {
  const sources = [
    fetchFromAdoptMeTrueValues(),
    fetchFromAdoptFromMe(),
    fetchFromElvebredd()
  ];
  return Promise.all(sources);
}
```

#### Web Scraping Considerations
- Respect robots.txt
- Use rate limiting (1 request per second per source)
- Cache responses to minimize API calls
- Handle errors gracefully (if one source fails, continue with others)
- Consider official APIs if available

---

### 3. Weekly Pet Updates System

#### Update Schedule Tracking
- **Monitor Official Sources**:
  - Play Adopt Me news (playadopt.me/news)
  - Play Adopt Me countdown (playadopt.me/countdown)
  - Adopt Me Twitter/X official account
  - Roblox Adopt Me group announcements

- **Update Schedule**:
  - Note: Adopt Me moved from weekly Friday updates to flexible schedule (as of recent changes)
  - Monitor for any new pet releases
  - Track seasonal events, holidays, special themes
  - Update users via notifications when new pets drop

#### Weekly Pet Update Features
- **New Pets Section**:
  - Display newly released pets
  - Show release date and how to obtain
  - Include images/videos of new pets
  - Initial value estimates (when available)

- **Upcoming Updates Countdown**:
  - Countdown timer to next update (if schedule known)
  - Teasers and announcements
  - Speculation community section

- **Pet Rotation Tracker**:
  - Track which pets are leaving/returning to game
  - Limited-time pets alerts
  - Event pets with expiration dates

- **Update History**:
  - Archive of past updates
  - Timeline of pet releases
  - Value trends for pets over time

#### Data Storage for Updates
```sql
-- Pet updates table
CREATE TABLE pet_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  release_date DATE,
  update_type TEXT, -- weekly, event, seasonal, special
  pets_added JSONB, -- array of pet names
  pets_removed JSONB,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- New pets table
CREATE TABLE new_pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  update_id UUID REFERENCES pet_updates(id),
  rarity TEXT,
  how_to_obtain TEXT,
  image_url TEXT,
  initial_value_estimate INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## User Interface Design

### Homepage Layout
```
┌─────────────────────────────────────────────────┐
│  Header: Logo | Search | Inventory | Login      │
├─────────────────────────────────────────────────┤
│  Hero: Live Value Checker                       │
│  [Search Pet]                                   │
│                                                 │
│  Quick Stats:                                   │
│  - Total Pets in Database: 1,234               │
│  - Last Update: 2 minutes ago                   │
│  - New Pets This Week: 5                        │
├─────────────────────────────────────────────────┤
│  Section: Latest Weekly Updates                 │
│  [Pet Cards with new releases]                  │
├─────────────────────────────────────────────────┤
│  Section: Trending/Popular Pets                 │
│  [Value trending pets]                          │
├─────────────────────────────────────────────────┤
│  Section: Value Checker                         │
│  [Search and check pet values]                  │
└─────────────────────────────────────────────────┘
```

### Inventory Page
```
┌─────────────────────────────────────────────────┐
│  My Inventory                                   │
│  [Add Pet] [Export] [Share]                     │
├─────────────────────────────────────────────────┤
│  Filters: [All] [Pets] [Vehicles] [Toys]       │
│  Sort: [Name] [Value] [Date Added]              │
├─────────────────────────────────────────────────┤
│  Total Value: 1,250,000 Cookies                │
│                                                 │
│  [Pet Grid with thumbnails]                     │
│  - Pet Name                                     │
│  - Variant badge                                │
│  - Current value                                │
│  - Quick actions (edit, remove)                 │
└─────────────────────────────────────────────────┘
```

### Value Checker Page
```
┌─────────────────────────────────────────────────┤
│  Pet Value Checker                              │
│  [Search Input with Autocomplete]              │
├─────────────────────────────────────────────────┤
│  Results:                                       │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Shadow Dragon                            │   │
│  │ [Image]                                  │   │
│  │                                         │   │
│  │ Average: 45,000 Cookies                 │   │
│  │ Range: 40,000 - 50,000                  │   │
│  │                                         │   │
│  │ Sources:                                │   │
│  │ ✓ Adopt Me True Values: 45,000         │   │
│  │ ✓ Adopt From Me: 43,000                │   │
│  │ ✓ Elvebredd: 47,000                     │   │
│  │                                         │   │
│  │ Confidence: High (3/3 agree)            │   │
│  │ Last Updated: 2 min ago                 │   │
│  │                                         │   │
│  │ [Add to Inventory] [Compare Trade]     │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## API Routes Structure

### Next.js API Routes
```
/api/
├── auth/
│   ├── login
│   ├── logout
│   └── register
├── inventory/
│   ├── GET /api/inventory - Get user's inventory
│   ├── POST /api/inventory - Add item to inventory
│   ├── PUT /api/inventory/[id] - Update inventory item
│   └── DELETE /api/inventory/[id] - Remove item
├── values/
│   ├── GET /api/values/[petName] - Get aggregated value
│   ├── GET /api/values/refresh - Force refresh values
│   └── GET /api/values/sources - Get all source values
├── updates/
│   ├── GET /api/updates/latest - Get latest updates
│   ├── GET /api/updates/upcoming - Get upcoming updates
│   └── GET /api/updates/history - Get update history
└── pets/
    ├── GET /api/pets/search - Search pets
    └── GET /api/pets/[id] - Get pet details
```

---

## Implementation Priority

### Phase 1: Core Infrastructure
1. Set up Supabase database schema
2. Implement authentication system
3. Create basic inventory CRUD operations
4. Build UI components for inventory management

### Phase 2: Value Checking System
1. Implement web scraping for 3 value sources
2. Create value aggregation logic
3. Build caching system
4. Create value checker UI
5. Set up scheduled value refresh

### Phase 3: Weekly Updates
1. Implement update monitoring system
2. Create new pets database
3. Build weekly updates UI
4. Set up notification system for new updates

### Phase 4: Polish & Enhancements
1. Add trade comparison feature
2. Implement OCR for inventory screenshots
3. Add sharing features
4. Performance optimization
5. Mobile responsiveness

---

## Technical Considerations

### Web Scraping Ethics
- Always check robots.txt before scraping
- Implement rate limiting
- Cache responses aggressively
- Provide attribution to data sources
- Consider reaching out to sites for official API access

### Performance
- Use Next.js ISR (Incremental Static Regeneration) for pet pages
- Implement Redis caching for value data
- Use Supabase edge functions for data fetching
- Optimize images with Next.js Image component

### Error Handling
- Graceful degradation if sources are unavailable
- Show last known values with timestamp
- Display confidence scores
- Allow users to report incorrect values

### Security
- Protect user inventory data
- Implement rate limiting on API routes
- Sanitize all user inputs
- Use Supabase RLS (Row Level Security) policies

---

## Success Metrics
- Number of active users with inventories
- Value data freshness (target: <10 minutes old)
- Uptime of value fetching (target: 99%)
- User satisfaction with value accuracy
- Weekly update coverage (target: 100% of new pets)

---

## Future Enhancements
- Trade fair calculator (WFL system)
- Community value voting
- Price prediction ML model
- Discord/Telegram bot integration
- Mobile app (React Native)
- Real-time trade feed from Adopt From Me API
