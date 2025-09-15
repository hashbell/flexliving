import { AnalyticsUtils } from '../AnalyticsUtils';
import { INormalizedReview } from '../../types/review';

describe('AnalyticsUtils', () => {
  const mockReviews: INormalizedReview[] = [
    {
      id: 1,
      guestName: 'John Doe',
      overallRating: 4.5,
      propertyName: 'Test Property 1',
      channel: 'Airbnb',
      status: 'published',
      isApproved: true,
      type: "guest-to-host",
      submittedAt: new Date('2024-01-01'),
      publicReview: 'Great stay!',
      categories: [{ category: 'cleanliness', rating: 4.5 }]
    },
    {
      id: 2,
      guestName: 'Jane Smith',
      overallRating: 3.8,
      propertyName: 'Test Property 1',
      channel: 'VRBO',
      status: 'published',
      isApproved: true,
      type: "guest-to-host",
      submittedAt: new Date('2024-01-02'),
      publicReview: 'Good experience',
      categories: [{ category: 'cleanliness', rating: 3.8 }]
    },
    {
      id: 3,
      guestName: 'Bob Wilson',
      overallRating: 2.5,
      propertyName: 'Test Property 2',
      channel: 'Booking.com',
      status: 'published',
      isApproved: false,
      type: "guest-to-host",
      submittedAt: new Date('2024-01-03'),
      publicReview: 'Could be better',
      categories: [{ category: 'cleanliness', rating: 2.5 }]
    }
  ];

  describe('calculateReviewStats', () => {
    it('should calculate correct review statistics', () => {
      const stats = AnalyticsUtils.calculateReviewStats(mockReviews);

      expect(stats.totalReviews).toBe(3);
      expect(stats.averageRating).toBeCloseTo(3.6, 1);
      expect(stats.channelBreakdown).toHaveProperty('Airbnb');
      expect(stats.channelBreakdown).toHaveProperty('VRBO');
      expect(stats.channelBreakdown).toEqual(expect.objectContaining({ "Booking.com": 1 }));
    });

    it('should handle empty reviews array', () => {
      const stats = AnalyticsUtils.calculateReviewStats([]);

      expect(stats.totalReviews).toBe(0);
      expect(stats.averageRating).toBe(0);
      expect(Object.keys(stats.channelBreakdown)).toHaveLength(0);
    });
  });

  describe('getPropertyPerformance', () => {
    it('should group reviews by property', () => {
      const performance = AnalyticsUtils.getPropertyPerformance(mockReviews);

      expect(performance).toHaveLength(2);
      expect(performance[0].propertyName).toBe('Test Property 1');
      expect(performance[0].reviews).toHaveLength(2);
      expect(performance[1].propertyName).toBe('Test Property 2');
      expect(performance[1].reviews).toHaveLength(1);
    });

    it('should calculate property-specific stats', () => {
      const performance = AnalyticsUtils.getPropertyPerformance(mockReviews);
      const property1 = performance.find(p => p.propertyName === 'Test Property 1');

      expect(property1?.stats.totalReviews).toBe(2);
      expect(property1?.stats.averageRating).toBeCloseTo(4.15, 1);
    });
  });
}); 