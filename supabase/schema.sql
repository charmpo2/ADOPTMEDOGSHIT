-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventories table
CREATE TABLE inventories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Inventory',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory items table
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id UUID NOT NULL REFERENCES inventories(id) ON DELETE CASCADE,
  pet_name TEXT NOT NULL,
  variant TEXT NOT NULL DEFAULT 'normal' CHECK (variant IN ('normal', 'neon', 'mega', 'fly', 'ride', 'mega_fly', 'mega_ride', 'mega_fly_ride')),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pet values cache table
CREATE TABLE pet_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_name TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('adoptmetruevalues', 'adoptfromme', 'elvebredd', 'adoptmetradingvalues', 'amvgg')),
  variant TEXT NOT NULL DEFAULT 'normal' CHECK (variant IN ('normal', 'neon', 'mega', 'fly', 'ride', 'mega_fly', 'mega_ride', 'mega_fly_ride')),
  value DECIMAL(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'cookies' CHECK (currency IN ('cookies', 'shark', 'frost')),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pet_name, source, variant)
);

-- Aggregated values table
CREATE TABLE aggregated_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_name TEXT NOT NULL,
  variant TEXT NOT NULL DEFAULT 'normal' CHECK (variant IN ('normal', 'neon', 'mega', 'fly', 'ride', 'mega_fly', 'mega_ride', 'mega_fly_ride')),
  average_value DECIMAL(12, 2) NOT NULL,
  min_value DECIMAL(12, 2) NOT NULL,
  max_value DECIMAL(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'cookies' CHECK (currency IN ('cookies', 'shark', 'frost')),
  confidence TEXT NOT NULL DEFAULT 'medium' CHECK (confidence IN ('high', 'medium', 'low')),
  sources_count INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pet_name, variant)
);

-- Pet updates table
CREATE TABLE pet_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  release_date DATE NOT NULL,
  update_type TEXT NOT NULL DEFAULT 'weekly' CHECK (update_type IN ('weekly', 'event', 'seasonal', 'special')),
  pets_added JSONB DEFAULT '[]',
  pets_removed JSONB DEFAULT '[]',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- New pets table
CREATE TABLE new_pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  update_id UUID REFERENCES pet_updates(id) ON DELETE CASCADE,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'ultra-rare', 'legendary')),
  how_to_obtain TEXT,
  image_url TEXT,
  initial_value_estimate DECIMAL(12, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_inventory_items_inventory_id ON inventory_items(inventory_id);
CREATE INDEX idx_inventory_items_pet_name ON inventory_items(pet_name);
CREATE INDEX idx_pet_values_pet_name ON pet_values(pet_name);
CREATE INDEX idx_pet_values_source ON pet_values(source);
CREATE INDEX idx_pet_values_last_updated ON pet_values(last_updated);
CREATE INDEX idx_aggregated_values_pet_name ON aggregated_values(pet_name);
CREATE INDEX idx_aggregated_values_last_updated ON aggregated_values(last_updated);
CREATE INDEX idx_pet_updates_release_date ON pet_updates(release_date);
CREATE INDEX idx_new_pets_update_id ON new_pets(update_id);
CREATE INDEX idx_new_pets_name ON new_pets(name);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventories_updated_at BEFORE UPDATE ON inventories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pet_updates_updated_at BEFORE UPDATE ON pet_updates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can view their own inventories
CREATE POLICY "Users can view own inventories" ON inventories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own inventories" ON inventories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventories" ON inventories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventories" ON inventories
  FOR DELETE USING (auth.uid() = user_id);

-- Public inventories can be viewed by anyone
CREATE POLICY "Public inventories can be viewed" ON inventories
  FOR SELECT USING (is_public = true);

-- Users can view items in their own inventories
CREATE POLICY "Users can view own inventory items" ON inventory_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM inventories 
      WHERE inventories.id = inventory_items.inventory_id 
      AND inventories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create items in own inventories" ON inventory_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM inventories 
      WHERE inventories.id = inventory_items.inventory_id 
      AND inventories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own inventory items" ON inventory_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM inventories 
      WHERE inventories.id = inventory_items.inventory_id 
      AND inventories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own inventory items" ON inventory_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM inventories 
      WHERE inventories.id = inventory_items.inventory_id 
      AND inventories.user_id = auth.uid()
    )
  );

-- Public inventory items can be viewed by anyone
CREATE POLICY "Public inventory items can be viewed" ON inventory_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM inventories 
      WHERE inventories.id = inventory_items.inventory_id 
      AND inventories.is_public = true
    )
  );

-- Pet values and aggregated values are public (no RLS needed for read access)
-- Pet updates and new pets are public (no RLS needed for read access)
