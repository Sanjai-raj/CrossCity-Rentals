
export interface City {
  id: string;
  name: string;
}

export interface Branch {
  id: string;
  cityId: string;
  name: string;
  address: string;
}

export interface Car {
  _id?: string; // MongoDB ID (present in populated docs)
  id: string;   // Frontend transformed ID
  make: string;
  model: string;
  year: number;
  type: 'Hatchback' | 'Sedan' | 'SUV' | 'Luxury';
  transmission: 'Manual' | 'Automatic';
  fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
  seats: number;
  pricePerHour: number;
  pricePerDay: number;
  image: string;
  rating: number;
  trips: number;
  features: string[];
  branchId: string;
  status: 'active' | 'maintenance' | 'booked';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface Booking {
  _id: string;
  id?: string;
  carId: Car | string; // Can be ID string or populated Car object
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'confirmed' | 'completed' | 'cancelled';
}
