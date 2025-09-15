# **👉 [VISIT LIVE SITE](https://flexliving-1.onrender.com/) 👈**

---

# Flex Living Reviews Dashboard

A comprehensive review management system for Flex Living properties, featuring analytics, trend analysis, and recurring issue detection.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flex
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run build
   npm run dev
   ```
   Backend runs on `http://localhost:3001`

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on `http://localhost:3000`

4. **Access the Application**
   - Dashboard: `http://localhost:3000`

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Language**: TypeScript 5.3+
- **Testing**: Jest with Supertest
- **Logging**: Winston
- **HTTP Client**: Axios
- **CORS**: cors middleware
- **Environment**: dotenv

### Frontend
- **Framework**: React 19.1+ with TypeScript
- **Routing**: React Router DOM 7.9+
- **Styling**: Tailwind CSS 3.4+
- **Charts**: Recharts 3.2+
- **HTTP Client**: Axios
- **Build Tool**: Create React App
- **Testing**: React Testing Library

### Development Tools
- **Backend**: nodemon, ts-node, ts-jest
- **Frontend**: react-scripts, web-vitals
- **Type Checking**: TypeScript strict mode
- **Code Quality**: ESLint (React app config)

## 🏗️ Architecture & Design Decisions

### 1. **Modular Architecture**
- **Backend**: Clean separation of concerns with controllers, services, repositories, and utilities
- **Frontend**: Component-based architecture with clear separation between pages, components, and services

### 2. **Data Normalization Strategy**
- All review data is normalized to a consistent `INormalizedReview` format regardless of source
- Unified interface allows easy integration of multiple review sources (Hostaway, Google, etc.)
- Backward compatibility maintained with legacy type aliases

### 3. **Review Approval System**
- **Manager Control**: Reviews require approval before public display
- **Status Tracking**: Published/pending/rejected workflow
- **Public Safety**: Only approved reviews shown to website visitors

### 4. **Analytics & Filtering**
- **Comprehensive Metrics**: Total reviews, average ratings, category averages, channel breakdowns
- **Advanced Filtering**: Multi-criteria filtering (rating ranges, channels, properties, dates)
- **Trend Analysis**: 30-day review trends with count and average rating tracking
- **Recurring Issues Detection**: Automated pattern recognition for common complaints

### 5. **Mock Data Implementation**
- **Hostaway API Limitation**: Sandbox environment has no reviews
- **Realistic Mock Data**: Comprehensive mock data mirroring real API structure
- **Graceful Fallback**: System falls back to mock data if API calls fail

## 🔍 Google Reviews Integration Analysis

### Integration Challenges

Google Reviews integration presents several technical and business challenges that make it difficult to implement for Flex Living.

#### 1. Google Places API Limitations
- Limited to only 5 reviews per request
- No control over which reviews are returned
- Reviews are sorted by Google's algorithm, not by date or rating
- Cannot paginate to get more reviews

#### 2. Google My Business API Requirements
- Requires business ownership verification
- Complex application process (2-4 weeks approval time)
- Must have "approved business purpose"
- Only works for businesses you own/manage

#### 3. Technical Implementation Issues
- CORS restrictions when calling from frontend
- Requires proxy backend to avoid CORS errors
- API rate limits and billing requirements
- Complex authentication flow

#### 4. Business Model Conflicts
- Flex Living manages multiple properties, not individual businesses
- Each property would need separate Google Business Profile
- Reviews would be scattered across multiple listings
- Difficult to aggregate reviews for dashboard view

Requires significant development effort, business verification, and ongoing maintenance.

## 🔌 API Documentation

### Core Endpoints

#### Reviews API (`/api/reviews`)
- `GET /api/reviews` - Fetch all reviews with analytics
- `GET /api/reviews/approved` - Get only approved reviews for public display
- `GET /api/reviews/dashboard` - Get dashboard data with comprehensive analytics
- `GET /api/reviews/property/:propertyName` - Get reviews for specific property
- `POST /api/reviews/:reviewId/approve` - Approve/reject review for public display
- `GET /api/reviews/filter` - Get filtered reviews with query parameters

#### Health & Utility
- `GET /api/health` - Server health status
- `GET /api/hostaway` - Fetch and normalize reviews from Hostaway

### Request/Response Examples

**Get Dashboard Data**
```bash
GET /api/reviews/dashboard
```
```json
{
  "success": true,
  "data": {
    "overallStats": {
      "totalReviews": 150,
      "averageRating": 4.2,
      "ratingDistribution": { "5": 45, "4": 60, "3": 30, "2": 10, "1": 5 },
      "categoryAverages": { "cleanliness": 4.1, "communication": 4.5 },
      "channelBreakdown": { "Airbnb": 80, "Booking.com": 70 },
      "recentTrends": [
        { "date": "2024-01-01", "count": 5, "avgRating": 4.2 }
      ],
      "recurringIssues": [
        {
          "issue": "WiFi connectivity problems",
          "category": "amenities",
          "count": 12,
          "severity": "medium",
          "trend": "stable"
        }
      ]
    },
    "propertyPerformance": [...],
    "totalReviews": 150
  }
} 
```
