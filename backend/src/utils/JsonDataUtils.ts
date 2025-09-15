import * as fs from 'fs';
import * as path from 'path';
import { IHostawayReview } from '../types/review';

export class JsonDataUtils {
  static loadReviewsData(): IHostawayReview[] {
    try {
      // Resolve path to reviews.json in dist directory
      const reviewsPath = path.join(__dirname, '..', 'data', 'reviews.json');
      
      if (fs.existsSync(reviewsPath)) {
        const data = fs.readFileSync(reviewsPath, 'utf8');
        const parsedData = JSON.parse(data);
        // Extract the reviews array from the JSON object
        return parsedData.reviews || [];
      } else {
        console.error(`Reviews JSON file not found at: ${reviewsPath}`);
        return [];
      }
    } catch (error) {
      console.error(`Error loading reviews data: ${error}`);
      return [];
    }
  }

  static getAllReviews(reviewsData: IHostawayReview[]): IHostawayReview[] {
    return [...reviewsData]; // Return copy to prevent mutation
  }
}
