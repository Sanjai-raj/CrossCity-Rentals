// src/components/CarCard.tsx (updated)
import type { Car } from '../types';
import { Link, useSearchParams } from 'react-router-dom';
import { Users, Fuel, Gauge, Star, ArrowRight } from 'lucide-react';

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
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1">
      <div className="relative h-52 overflow-hidden">
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-gray-800 shadow-sm">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
          {car.rating}
        </div>
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-lg">
          {car.trips} trips
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{car.make} {car.model}</h3>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mt-1">{car.type} • {car.year}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 my-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md" title="Transmission">
            <Gauge className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md" title="Fuel Type">
            <Fuel className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium">{car.fuel}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md" title="Seats">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium">{car.seats} Seats</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase font-bold text-gray-400">Price from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-blue-600">₹{car.pricePerHour}</span>
              <span className="text-gray-500 text-xs font-medium">/hr</span>
            </div>
          </div>

          <Link
            to={detailsPath}
            className="group/btn relative overflow-hidden bg-gray-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2"
            aria-label={`View details for ${car.make} ${car.model}`}
          >
            <span className="relative z-10">Details</span>
            <ArrowRight className="w-4 h-4 relative z-10 transform group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
