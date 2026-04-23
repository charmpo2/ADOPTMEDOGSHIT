export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      pets: {
        Row: {
          id: string;
          name: string;
          rarity: string;
          type: string;
          status: string;
          image_url: string | null;
          release_date: string | null;
          is_neon_available: boolean;
          is_mega_available: boolean;
        };
        Insert: {
          id: string;
          name: string;
          rarity: string;
          type: string;
          status: string;
          image_url?: string | null;
          release_date?: string | null;
          is_neon_available?: boolean;
          is_mega_available?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          rarity?: string;
          type?: string;
          status?: string;
          image_url?: string | null;
          release_date?: string | null;
          is_neon_available?: boolean;
          is_mega_available?: boolean;
        };
      };
      inventory_items: {
        Row: {
          id: string;
          user_id: string;
          pet_id: string;
          variant: string;
          quantity: number;
          added_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pet_id: string;
          variant: string;
          quantity?: number;
          added_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          pet_id?: string;
          variant?: string;
          quantity?: number;
          added_at?: string;
        };
      };
      weekly_updates: {
        Row: {
          id: string;
          title: string;
          release_date: string;
          new_pets: string[];
          description: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          release_date: string;
          new_pets: string[];
          description?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          release_date?: string;
          new_pets?: string[];
          description?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
