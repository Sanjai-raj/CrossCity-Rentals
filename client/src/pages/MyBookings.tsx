
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../constants';
import type { Booking, Car } from '../types';
import { Loader, Calendar, Clock, Car as CarIcon, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MyBookings: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/bookings/user/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        }
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
        <Link 
          to="/search" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm"
        >
          Book a New Car
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <CarIcon className="w-8 h-8 text-gray-400" />
           </div>
           <h3 className="text-lg font-semibold text-gray-900">No trips yet</h3>
           <p className="text-gray-500 mt-2">You haven't booked any cars with us yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
             // Check if carId is a populated object
             const car = (booking.carId && typeof booking.carId === 'object') ? (booking.carId as Car) : null;
             
             if (!car) {
                return (
                  <div key={booking._id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center gap-4 text-gray-500">
                    <AlertCircle className="w-5 h-5" />
                    <span>Car data unavailable for booking ID: {booking._id}</span>
                  </div>
                );
             }

             const isCancelled = booking.status === 'cancelled';
             const isConfirmed = booking.status === 'confirmed';
             
             let statusColor = 'bg-gray-100 text-gray-600';
             if (isConfirmed) statusColor = 'bg-blue-100 text-blue-700';
             if (isCancelled) statusColor = 'bg-red-100 text-red-700';

             // Mongoose populated objects have _id. Our transformed objects have id.
             // We need to robustly get the ID.
             const carId = car._id || car.id;

             return (
               <div key={booking._id || booking.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                 <div className="flex flex-col md:flex-row">
                   {/* Car Image */}
                   <div className="md:w-64 h-48 md:h-auto relative bg-gray-100">
                      {car.image ? (
                        <img 
                          src={car.image} 
                          alt={`${car.make} ${car.model}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Car+Image'}}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <CarIcon className="w-8 h-8" />
                        </div>
                      )}
                   </div>
                   
                   {/* Details */}
                   <div className="flex-1 p-6">
                      <div className="flex flex-col h-full justify-between">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <h3 className="text-xl font-bold text-gray-900">{car.make} {car.model}</h3>
                               <p className="text-gray-500 text-sm">{car.year} • {car.transmission} • {car.fuel}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusColor}`}>
                               {booking.status}
                            </div>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                               <Calendar className="w-4 h-4 text-gray-400" />
                               <div>
                                  <p className="text-xs text-gray-400 uppercase">Start Date</p>
                                  <p className="font-medium text-gray-900">
                                    {booking.startDate ? new Date(booking.startDate).toLocaleString() : 'N/A'}
                                  </p>
                               </div>
                            </div>
                            <div className="flex items-center gap-2">
                               <Clock className="w-4 h-4 text-gray-400" />
                               <div>
                                  <p className="text-xs text-gray-400 uppercase">End Date</p>
                                  <p className="font-medium text-gray-900">
                                    {booking.endDate ? new Date(booking.endDate).toLocaleString() : 'N/A'}
                                  </p>
                               </div>
                            </div>
                         </div>

                         <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div>
                               <p className="text-xs text-gray-500">Total Amount</p>
                               <p className="text-lg font-bold text-gray-900">₹{booking.totalPrice?.toLocaleString() || '0'}</p>
                            </div>
                            {carId ? (
                              <Link 
                                to={`/car/${carId}`} 
                                className="text-blue-600 font-semibold text-sm hover:text-blue-700 hover:underline"
                              >
                                View Car Details
                              </Link>
                            ) : (
                              <span className="text-gray-400 text-sm cursor-not-allowed">Details Unavailable</span>
                            )}
                         </div>
                      </div>
                   </div>
                 </div>
               </div>
             );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
