import React, { useState } from 'react';
import '../../styles/ReviewList.css';
import { NormalizedReview } from '../../types/review';

interface ReviewListProps {
  reviews: NormalizedReview[];
  onApprovalChange: (reviewId: number, isApproved: boolean) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onApprovalChange }) => {
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'property' | 'channel' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [updatingReviews, setUpdatingReviews] = useState<Set<number>>(new Set());

  const getRatingStars = (rating: number | null) => {
    if (rating === null) return 'N/A';
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '⭐' : '');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'airbnb': return 'bg-pink-100 text-pink-800';
      case 'booking.com': return 'bg-blue-100 text-blue-800';
      case 'vrbo': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        break;
      case 'rating':
        comparison = (a.overallRating || 0) - (b.overallRating || 0);
        break;
      case 'property':
        comparison = a.propertyName.localeCompare(b.propertyName);
        break;
      case 'channel':
        comparison = a.channel.localeCompare(b.channel);
        break;
      case 'category':
        // Sort by the highest category rating for each review
        const aMaxCategory = a.categories.length > 0 ? Math.max(...a.categories.map((c: any) => c.rating)) : 0;
        const bMaxCategory = b.categories.length > 0 ? Math.max(...b.categories.map((c: any) => c.rating)) : 0;
        comparison = aMaxCategory - bMaxCategory;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleApprovalToggle = async (reviewId: number, currentApproval: boolean) => {
    setUpdatingReviews(prev => new Set(prev).add(reviewId));
    try {
      await onApprovalChange(reviewId, !currentApproval);
    } finally {
      setUpdatingReviews(prev => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
    }
  };

  return (
    <div className="bg-white rounded-lg card-shadow border">
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Reviews ({reviews.length})
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'rating' | 'property' | 'channel' | 'category')}
                className="text-sm border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="date">Time</option>
                <option value="rating">Rating</option>
                <option value="property">Property</option>
                <option value="channel">Channel</option>
                <option value="category">Category</option>
              </select>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Reviews Container */}
      <div className="reviews-scroll-container">
        <div className="divide-y divide-gray-200">
          {sortedReviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Review Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="font-semibold text-gray-900">{review.guestName}</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getChannelColor(review.channel)}`}>
                      {review.channel}
                    </span>
                    {review.overallRating && (
                      <div className="text-sm text-gray-600">
                        {getRatingStars(review.overallRating)} ({review.overallRating.toFixed(1)})
                      </div>
                    )}
                  </div>

                  {/* Property and Date */}
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">{review.propertyName}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(review.submittedAt).toLocaleDateString()}</span>
                  </div>

                  {/* Review Text */}
                  <div className="text-gray-900 mb-4">
                    "{review.publicReview}"
                  </div>

                  {/* Category Ratings */}
                  {review.categories.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Category Ratings:</div>
                      <div className="flex flex-wrap gap-2">
                        {review.categories.map((category: any, index: any) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {category.category.replace('_', ' ')}: {category.rating}/5
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Approval Controls */}
                <div className="ml-4 flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Public Display:</span>
                    <button
                      onClick={() => handleApprovalToggle(review.id, review.isApproved)}
                      disabled={updatingReviews.has(review.id)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                        review.isApproved
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } ${updatingReviews.has(review.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {updatingReviews.has(review.id) 
                        ? '⏳ Updating...' 
                        : review.isApproved 
                          ? '✓ Approved' 
                          : '✗ Not Approved'
                      }
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {review.type === 'guest-to-host' ? 'Guest Review' : 'Host Review'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No reviews match the current filters</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
