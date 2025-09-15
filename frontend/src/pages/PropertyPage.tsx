import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ApiService } from '../services/api';
import { NormalizedReview } from '../types/review';
import '../styles/PropertyDetails.css';
import { Navbar } from '../components/layout';

interface PropertyDetailsProps {
  propertyId?: string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ propertyId: propPropertyId }) => {
  const { propertyId: urlPropertyId } = useParams<{ propertyId: string }>();
  // Use the propertyId from props or URL params, defaulting to "128652"
  const propertyId = propPropertyId || urlPropertyId || "128652";
  
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [selectedDates, setSelectedDates] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch approved reviews for this property
  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all approved reviews
        const approvedReviews = await ApiService.fetchApprovedReviews();
        
        // For demo purposes, show all approved reviews
        // In a real app, you'd filter by actual property ID or name
        const propertyReviews = approvedReviews;
        
        console.log('Approved reviews:', approvedReviews.length);
        console.log('Property names:', approvedReviews.map(r => r.propertyName));
        
        setReviews(propertyReviews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
        console.error('Error fetching approved reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedReviews();
  }, [propertyId]);

  const amenities = [
    { name: 'Cable TV', icon: '📺' },
    { name: 'Kitchen', icon: '🍳' },
    { name: 'Hair Dryer', icon: '💨' },
    { name: 'Internet', icon: '��' },
    { name: 'Washing Machine', icon: '🧺' },
    { name: 'Heating', icon: '🔥' },
    { name: 'Wireless', icon: '📶' },
    { name: 'Elevator', icon: '🛗' },
    { name: 'Smoke Detector', icon: '🚨' },
    { name: 'Air Conditioning', icon: '❄️' },
    { name: 'Parking', icon: '🅿️' },
    { name: 'Balcony', icon: '🏞️' }
  ];

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "Airbnb":
        return "text-blue-500";
      case "VRBO":
        return "text-green-500";
      case "Booking.com":
        return "text-purple-500";
      case "Expedia":
        return "text-red-500";
      case "Direct":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 9);

  const handleReadMore = () => {
    // Handle read more functionality
    console.log('Read more clicked for property:', propertyId);
  };

  return (
    <div className="property-details-page">
      {/* Consistent Navbar */}
      <Navbar variant="public" propertyId={propertyId} />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          {/* Left Column - Property Details */}
          <div className="left-column">
            {/* About this property */}
            <div className="property-card">
              <h2 className="card-title">About this property</h2>
              <p className="property-description">
                This spacious and bright apartment is located in the heart of Chelsea Harbour, 
                offering top-quality amenities and a peaceful environment. The property is 
                perfectly positioned close to shops, restaurants, and the beautiful river, 
                making it an ideal choice for both business and leisure travelers. The 
                modern interior design and high-end finishes create a luxurious atmosphere 
                that ensures a comfortable stay...
              </p>
              <button onClick={handleReadMore} className="read-more-link">
                Read more
              </button>
            </div>

            {/* Amenities */}
            <div className="property-card">
              <div className="amenities-header">
                <h2 className="card-title">Amenities</h2>
                <button 
                  className="view-all-btn"
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                >
                  View all amenities →
                </button>
              </div>
              <div className="amenities-grid">
                {visibleAmenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-icon">{amenity.icon}</span>
                    <span className="amenity-name">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="property-card">
              <h2 className="card-title">Guest Reviews</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Loading reviews...</div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-500">Error loading reviews: {error}</div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">No approved reviews available for this property.</div>
                </div>
              ) : (
                <div className="reviews-container">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="review-guest">
                          <span className="guest-name">{review.guestName}</span>
                          <div className="review-rating">
                            {(() => {
                              const rating = review.overallRating;
                              if (rating === null || rating === undefined) {
                                return <span className="text-gray-500">No rating</span>;
                              }
                              return (
                                <>
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}>
                                      ⭐
                                    </span>
                                  ))}
                                  <span className="rating-number">({rating.toFixed(1)})</span>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                        <div className="review-meta">
                          <span className="review-date">
                            {new Date(review.submittedAt).toLocaleDateString()}
                          </span>
                          <span className={`review-channel ${getChannelColor(review.channel)}`}>
                            {review.channel}
                          </span>
                        </div>
                      </div>
                      <p className="review-text">"{review.publicReview}"</p>
                      {review.categories.length > 0 && (
                        <div className="category-ratings">
                          <div className="category-title">Category Ratings:</div>
                          <div className="category-list">
                            {review.categories.map((category, index) => (
                              <span key={index} className="category-item">
                                {category.category.replace('_', ' ')}: {category.rating}/5
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stay Policies */}
            <div className="property-card">
              <h2 className="card-title">Stay Policies</h2>
              
              <div className="policy-section">
                <h3 className="policy-title">
                  <span className="policy-icon">🕐</span>
                  Check-in & Check-out
                </h3>
                <div className="time-boxes">
                  <div className="time-box">
                    <label>Check-in Time</label>
                    <div className="time-value">3:00 PM</div>
                  </div>
                  <div className="time-box">
                    <label>Check-out Time</label>
                    <div className="time-value">10:00 AM</div>
                  </div>
                </div>
              </div>

              <div className="policy-section">
                <h3 className="policy-title">
                  <span className="policy-icon">🛡️</span>
                  House Rules
                </h3>
                <div className="rules-list">
                  <div className="rule-item">
                    <span className="rule-icon">🚫</span>
                    No smoking
                  </div>
                  <div className="rule-item">
                    <span className="rule-icon">🐾</span>
                    No pets
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="right-column">
            <div className="booking-widget">
              <h2 className="booking-title">Book Your Stay</h2>
              <p className="booking-subtitle">Select dates to see prices</p>
              
              <div className="booking-form">
                <div className="form-group">
                  <div className="input-wrapper">
                    <span className="input-icon">📅</span>
                    <input
                      type="text"
                      placeholder="Select dates"
                      value={selectedDates}
                      onChange={(e) => setSelectedDates(e.target.value)}
                      className="booking-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value))}
                      className="booking-input"
                    />
                    <span className="dropdown-arrow">▼</span>
                  </div>
                </div>

                <button className="check-availability-btn">
                  <span className="btn-icon">📅</span>
                  Check availability
                </button>

                <button className="send-inquiry-btn">
                  <span className="btn-icon">💬</span>
                  Send Inquiry
                </button>

                <div className="instant-booking">
                  <span className="instant-icon">✓</span>
                  Instant booking confirmation
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* WhatsApp Button */}
      <div className="whatsapp-button">
        <span className="whatsapp-icon">💬</span>
      </div>
    </div>
  );
};

export default PropertyDetails;
