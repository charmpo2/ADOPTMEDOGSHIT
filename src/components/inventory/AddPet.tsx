'use client';

import { useState } from 'react';
import { Variant } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface AddPetProps {
  onAdd: (petName: string, variant: Variant, quantity: number) => Promise<void>;
  isLoading?: boolean;
}

export function AddPet({ onAdd, isLoading }: AddPetProps) {
  const [open, setOpen] = useState(false);
  const [petName, setPetName] = useState('');
  const [variant, setVariant] = useState<Variant>('normal');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim()) return;

    await onAdd(petName.trim(), variant, quantity);
    
    // Reset form
    setPetName('');
    setVariant('normal');
    setQuantity(1);
    setOpen(false);
  };

  const variants: { value: Variant; label: string }[] = [
    { value: 'normal', label: 'Normal' },
    { value: 'neon', label: 'Neon' },
    { value: 'mega', label: 'Mega' },
    { value: 'fly', label: 'Fly' },
    { value: 'ride', label: 'Ride' },
    { value: 'mega_fly', label: 'Mega Fly' },
    { value: 'mega_ride', label: 'Mega Ride' },
    { value: 'mega_fly_ride', label: 'Mega Fly Ride' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Pet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Pet to Inventory</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="petName">Pet Name</Label>
            <Input
              id="petName"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="e.g., Shadow Dragon"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="variant">Variant</Label>
            <Select value={variant} onValueChange={(value: Variant) => setVariant(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {variants.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Pet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
