import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ReviewStats } from '../../types/review';

interface StatsOverviewProps {
  stats: ReviewStats;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const ratingDistributionData = Object.entries(stats.ratingDistribution).map(([rating, count]) => ({
    rating: `${rating}★`,
    count
  }));

  const channelData = Object.entries(stats.channelBreakdown).map(([channel, count]) => ({
    channel,
    count
  }));

  const categoryData = Object.entries(stats.categoryAverages).map(([category, average]) => ({
    category: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    average: Math.round(average * 10) / 10
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Overview Statistics</h2>
      </div>
      
      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalReviews}</div>
            <div className="text-sm text-blue-800">Total Reviews</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.averageRating.toFixed(1)}</div>
            <div className="text-sm text-green-800">Average Rating</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(stats.channelBreakdown).length}</div>
            <div className="text-sm text-purple-800">Channels</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{Object.keys(stats.categoryAverages).length}</div>
            <div className="text-sm text-orange-800">Categories</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rating Distribution */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ratingDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Breakdown */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4">Reviews by Channel</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Averages */}
        <div className="mt-8">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Category Averages</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryData.map((item) => (
              <div key={item.category} className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-lg font-semibold text-gray-900">{item.average}</div>
                <div className="text-sm text-gray-600">{item.category}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trends */}
        {stats.recentTrends.length > 0 && (
          <div className="mt-8">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Recent Trends (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.recentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="count" stroke="#3b82f6" name="Reviews" />
                <Line yAxisId="right" type="monotone" dataKey="avgRating" stroke="#10b981" name="Avg Rating" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsOverview;
