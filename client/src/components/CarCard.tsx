// src/components/CarCard.tsx (updated)
import type { Car } from '../types';
import { Link, useSearchParams } from 'react-router-dom';
import { Users, Fuel, Gauge, Star } from 'lucide-react';

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  const [searchParams] = useSearchParams();
  const searchString = searchParams.toString() ? `?${searchParams.toString()}` : '';

  // Defensive id extraction: prefer Mongo-style _id, fallback to id
  const rawId = (car as any)?._id ?? (car as any)?.id ?? '';
  // Ensure it's a string and strip any accidental query/hash parts
  const id = String(rawId).split(/[?#]/)[0];

  // FINAL path used for linking (adjust to '/api' or different base only if your routes require it)
  const detailsPath = `/cars/${encodeURIComponent(id)}${searchString}`;

  // temporary debug - remove this console.log in production
  // It helps confirm the final URL that will be requested
  if (import.meta.env.MODE !== 'production') {
  console.debug('CarCard: details link ->', detailsPath);
}

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
      <div className="relative h-48">
        <img 
          src={car.image} 
          alt={`${car.make} ${car.model}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-gray-800 shadow-sm">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          {car.rating}
        </div>
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {car.trips} trips
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{car.make} {car.model}</h3>
            <p className="text-gray-500 text-sm">{car.type} • {car.year}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 my-3 text-sm text-gray-600">
          <div className="flex items-center gap-1.5" title="Transmission">
            <Gauge className="w-4 h-4 text-gray-400" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Fuel Type">
            <Fuel className="w-4 h-4 text-gray-400" />
            <span>{car.fuel}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Seats">
            <Users className="w-4 h-4 text-gray-400" />
            <span>{car.seats} Seats</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div>
            <span className="block text-xs text-gray-500">Price from</span>
            <div className="flex items-baseline gap-1">
               <span className="text-lg font-bold text-gray-900">₹{car.pricePerHour}</span>
               <span className="text-gray-500 text-xs">/hr</span>
            </div>
          </div>

          <Link 
            to={detailsPath}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            aria-label={`View details for ${car.make} ${car.model}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
