import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardData, NormalizedReview } from '../types/review';
import { ApiService } from '../services/api';
import { LoadingSpinner } from '../components/common';
import { Navbar } from '../components/layout';
import { ReviewFilters, ReviewList } from '../components/reviews';
import GoogleReviewsExploration from '../components/dashboard/GoogleReviewsExploration';
import PropertyPerformance from '../components/dashboard/PropertyPerformance';
import StatsOverview from '../components/dashboard/StatsOverview';


const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [filteredReviews, setFilteredReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    minRating: undefined as number | undefined,
    maxRating: undefined as number | undefined,
    channel: '',
    propertyName: '',
    dateFrom: '',
    dateTo: '',
    status: ''
  });

  const applyFilters = useCallback(async () => {
    if (!dashboardData) return;

    try {
      const result = await ApiService.fetchFilteredReviews(filters);
      setFilteredReviews(result.reviews);
    } catch (err) {
      console.error('Failed to apply filters:', err);
      // Fallback to showing all reviews
      const allReviews = dashboardData.propertyPerformance.flatMap(p => p.reviews);
      setFilteredReviews(allReviews);
    }
  }, [dashboardData, filters]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (dashboardData) {
      applyFilters();
    }
  }, [dashboardData, applyFilters]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.fetchDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleReviewApprovalChange = async (reviewId: number, isApproved: boolean) => {
    try {
      await ApiService.updateReviewApproval(reviewId, isApproved);
      
      // Update local state instead of reloading all data
      setDashboardData(prevData => {
        if (!prevData) return prevData;
        
        return {
          ...prevData,
          propertyPerformance: prevData.propertyPerformance.map(property => ({
            ...property,
            reviews: property.reviews.map(review => 
              review.id === reviewId 
                ? { ...review, isApproved }
                : review
            )
          }))
        };
      });
      
      // Update filtered reviews as well
      setFilteredReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
            ? { ...review, isApproved }
            : review
        )
      );
      
    } catch (err) {
      console.error('Failed to update review approval:', err);
      // Optionally show a toast notification here
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadDashboardData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">No data available</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Consistent Navbar */}
      <Navbar variant="dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reviews Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage guest reviews across all properties</p>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={dashboardData.overallStats} />

        {/* Property Performance */}
        <div className="mt-8">
          <PropertyPerformance properties={dashboardData.propertyPerformance} />
        </div>

        {/* Google Reviews Exploration */}
        <div className="mt-8">
          <GoogleReviewsExploration />
        </div>

        {/* Filters and Reviews */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ReviewFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>
          <div className="lg:col-span-3">
            <ReviewList 
              reviews={filteredReviews}
              onApprovalChange={handleReviewApprovalChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
