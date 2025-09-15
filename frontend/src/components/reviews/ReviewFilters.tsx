import React from 'react';

interface ReviewFiltersProps {
  filters: {
    minRating: number | undefined;
    maxRating: number | undefined;
    channel: string;
    propertyName: string;
    dateFrom: string;
    dateTo: string;
    status: string;
  };
  onFilterChange: (filters: ReviewFiltersProps['filters']) => void;
}

const ReviewFilters: React.FC<ReviewFiltersProps> = ({ filters, onFilterChange }) => {
  const handleInputChange = (field: keyof typeof filters, value: string | number | undefined) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      minRating: undefined,
      maxRating: undefined,
      channel: '',
      propertyName: '',
      dateFrom: '',
      dateTo: '',
      status: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== ''
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Rating Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="1"
              max="5"
              step="0.1"
              placeholder="Min"
              value={filters.minRating || ''}
              onChange={(e) => handleInputChange('minRating', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <input
              type="number"
              min="1"
              max="5"
              step="0.1"
              placeholder="Max"
              value={filters.maxRating || ''}
              onChange={(e) => handleInputChange('maxRating', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Channel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Channel
          </label>
          <select
            value={filters.channel}
            onChange={(e) => handleInputChange('channel', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Channels</option>
            <option value="Airbnb">Airbnb</option>
            <option value="Booking.com">Booking.com</option>
            <option value="VRBO">VRBO</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        {/* Property Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Name
          </label>
          <input
            type="text"
            placeholder="Search properties..."
            value={filters.propertyName}
            onChange={(e) => handleInputChange('propertyName', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleInputChange('dateFrom', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleInputChange('dateTo', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Filters
          </label>
          <div className="space-y-2">
            <button
              onClick={() => handleInputChange('minRating', 4)}
              className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100"
            >
              ⭐ 4+ Stars
            </button>
            <button
              onClick={() => handleInputChange('status', 'pending')}
              className="w-full text-left px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100"
            >
              ⏳ Pending Reviews
            </button>
            <button
              onClick={() => {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                handleInputChange('dateFrom', thirtyDaysAgo.toISOString().split('T')[0]);
              }}
              className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
            >
              📅 Last 30 Days
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewFilters;
