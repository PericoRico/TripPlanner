export interface Trip {
  origin: string;
  destination: string;
  cost: number;
  duration: number;
  type: 'car' | 'train' | 'flight' | 'bus';
  id: string;
  display_name: string;
}
