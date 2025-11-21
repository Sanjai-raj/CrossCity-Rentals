import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CITIES, BRANCHES } from '../constants';
import type { Car } from '../types';
import CarCard from '../components/CarCard';
import { Filter, SlidersHorizontal, Loader } from 'lucide-react';
import { apiGet } from '../api';   // ⭐ IMPORTANT: use your API helper

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const cityId = searchParams.get('city') || 'blr';

  const selectedBranch = searchParams.get('branch') || 'all';
  const selectedType = searchParams.get('type') || 'all';
  const selectedTransmission = searchParams.get('transmission') || 'all';

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all') newParams.delete(key);
    else newParams.set(key, value);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('branch');
    newParams.delete('type');
    newParams.delete('transmission');
    setSearchParams(newParams);
  };

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();
        params.append('cityId', cityId);

        if (selectedBranch !== 'all') params.append('branchId', selectedBranch);
        if (selectedType !== 'all') params.append('type', selectedType);
        if (selectedTransmission !== 'all')
          params.append('transmission', selectedTransmission);

        // ⭐ Now using API helper: BASE + /api/cars
        const data = await apiGet(`/api/cars?${params.toString()}`);

        setCars(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch cars:', err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [cityId, selectedBranch, selectedType, selectedTransmission]);

  const currentCityName =
    CITIES.find((c) => c.id === cityId)?.name || 'Unknown City';
  const cityBranches = BRANCHES.filter((b) => b.cityId === cityId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Available Cars in {currentCityName}
        </h1>
        <p className="text-gray-500 mt-2">
          Select a vehicle that suits your journey.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-900">Filters</h2>
            </div>

            {/* Branch Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Pick-up Location
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="branch"
                    checked={selectedBranch === 'all'}
                    onChange={() => updateFilter('branch', 'all')}
                    className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Anywhere in {currentCityName}
                  </span>
                </label>
                {cityBranches.map((branch) => (
                  <label key={branch.id} className="flex items-center">
                    <input
                      type="radio"
                      name="branch"
                      checked={selectedBranch === branch.id}
                      onChange={() => updateFilter('branch', branch.id)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {branch.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Car Type
              </h3>
              <div className="space-y-2">
                {['all', 'Hatchback', 'Sedan', 'SUV', 'Luxury'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      checked={selectedType === type}
                      onChange={() => updateFilter('type', type)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-600 capitalize">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Transmission
              </h3>
              <div className="space-y-2">
                {['all', 'Automatic', 'Manual'].map((trans) => (
                  <label key={trans} className="flex items-center">
                    <input
                      type="radio"
                      name="transmission"
                      checked={selectedTransmission === trans}
                      onChange={() => updateFilter('transmission', trans)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-600 capitalize">
                      {trans}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car, index) => (
                <CarCard key={car.id || index} car={car} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No cars found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your filters or selecting a different city.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 text-blue-600 font-semibold hover:text-blue-700 text-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
