import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyPerformance as PropertyPerformanceType } from '../../types/review';

interface PropertyPerformanceProps {
  properties: PropertyPerformanceType[];
}

const PropertyPerformance: React.FC<PropertyPerformanceProps> = ({ properties }) => {
  const navigate = useNavigate();

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-50';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-50';
    if (rating >= 3.0) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Good';
    if (rating >= 3.0) return 'Average';
    return 'Needs Improvement';
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="bg-white rounded-lg card-shadow border">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Property Performance</h2>
        <p className="text-sm text-gray-600 mt-1">Performance metrics for each property - Click property name to view public page</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reviews
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Top Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Channels
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => {
              const topCategory = Object.entries(property.stats.categoryAverages)
                .sort(([,a], [,b]) => b - a)[0];
              const channels = Object.keys(property.stats.channelBreakdown).join(', ');
              
              return (
                <tr key={property.propertyId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handlePropertyClick(property.propertyId)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      {property.propertyName}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {property.stats.totalReviews}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {property.stats.averageRating.toFixed(1)} ⭐
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRatingColor(property.stats.averageRating)}`}>
                      {getRatingText(property.stats.averageRating)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {topCategory ? `${topCategory[0].replace('_', ' ')} (${topCategory[1].toFixed(1)})` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {channels || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handlePropertyClick(property.propertyId)}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                    >
                      View Public Page
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {properties.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">No property data available</div>
        </div>
      )}
    </div>
  );
};

export default PropertyPerformance;
