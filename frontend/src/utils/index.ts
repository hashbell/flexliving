// Utility functions
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

export const formatRating = (rating: number | null): string => {
  if (rating === null) return 'N/A';
  return rating.toFixed(1);
};

export const getRatingStars = (rating: number | null): string => {
  if (rating === null) return 'N/A';
  return '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '⭐' : '');
};

export const getChannelColor = (channel: string): string => {
  switch (channel.toLowerCase()) {
    case 'airbnb': return 'bg-pink-100 text-pink-800';
    case 'booking.com': return 'bg-blue-100 text-blue-800';
    case 'vrbo': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'published': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}; 