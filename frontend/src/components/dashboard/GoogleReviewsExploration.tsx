import React, { useState } from 'react';

const GoogleReviewsExploration: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Google Reviews Integration</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {isExpanded ? 'Hide Details' : 'View Findings'}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-yellow-600 text-xl mr-3">⚠️</div>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">Integration Challenges</h4>
                <p className="text-yellow-700 text-sm">
                  Google Reviews integration presents several technical and business challenges that make it difficult to implement for Flex Living.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">1. Google Places API Limitations</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Limited to only 5 reviews per request</li>
                <li>• No control over which reviews are returned</li>
                <li>• Reviews are sorted by Google's algorithm, not by date or rating</li>
                <li>• Cannot paginate to get more reviews</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">2. Google My Business API Requirements</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Requires business ownership verification</li>
                <li>• Complex application process (2-4 weeks approval time)</li>
                <li>• Must have "approved business purpose"</li>
                <li>• Only works for businesses you own/manage</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">3. Technical Implementation Issues</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• CORS restrictions when calling from frontend</li>
                <li>• Requires proxy backend to avoid CORS errors</li>
                <li>• API rate limits and billing requirements</li>
                <li>• Complex authentication flow</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">4. Business Model Conflicts</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Flex Living manages multiple properties, not individual businesses</li>
                <li>• Each property would need separate Google Business Profile</li>
                <li>• Reviews would be scattered across multiple listings</li>
                <li>• Difficult to aggregate reviews for dashboard view</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Alternative Recommendations</h4>
              <div className="text-sm text-blue-700 space-y-2">
                <p><strong>1. Focus on Hostaway Integration:</strong> Continue using Hostaway as the primary review source since it's already integrated and provides comprehensive review data.</p>
                <p><strong>2. Manual Google Review Curation:</strong> Manually curate and display select Google reviews by copying them (with permission) to showcase social proof.</p>
                <p><strong>3. Review Aggregation Service:</strong> Consider using third-party services like Featurable that specialize in Google review aggregation.</p>
                <p><strong>4. Encourage Cross-Platform Reviews:</strong> Direct guests to leave reviews on both Hostaway channels and Google, then manually highlight the best ones.</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Implementation Complexity Score</h4>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 ${i < 4 ? 'text-red-500' : 'text-gray-300'}`}
                    >
                      ⭐
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">4/5 - High Complexity</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Requires significant development effort, business verification, and ongoing maintenance
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleReviewsExploration;
