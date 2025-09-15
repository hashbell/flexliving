import axios from 'axios';
import { IHostawayReview, INormalizedReview } from '../types/review';
import { Review } from '../entities/Review';
import { JsonDataUtils } from '../utils/JsonDataUtils';
import { ConfigurationService } from '../services/ConfigurationService';
import { LoggerService } from '../services/LoggerService';

export class HostawayReviewRepository {
  private readonly config: any;
  private reviewsData: IHostawayReview[] = [];
  private approvalStatus: Map<number, boolean> = new Map();

  constructor(
    private configurationService: ConfigurationService,
    private logger: LoggerService
  ) {
    this.config = this.configurationService.getHostawayConfig();
    this.loadReviewsData();
    this.initializeDefaultApprovals();
  }

  private loadReviewsData(): void {
    this.logger.info('Loading reviews data', 'HostawayReviewRepository');
    this.reviewsData = JsonDataUtils.loadReviewsData();
    this.logger.info(`Loaded ${this.reviewsData.length} reviews`, 'HostawayReviewRepository');
  }

  private initializeDefaultApprovals(): void {
    // Set some reviews as approved by default for demo purposes
    // In a real implementation, this would come from a database
    const defaultApprovedIds = [7454, 7455, 7460, 7461, 7464, 7467, 7469, 7473, 7479, 7480, 7485, 7490, 7491, 7492, 7493, 7495, 7499, 7503, 7504, 7509, 7510, 7511, 7512, 7513, 7514, 7515, 7516, 7517, 7519, 7520, 7521, 7525, 7526, 7527, 7529, 7531, 7532, 7533, 7534, 7535, 7537, 7538, 7539, 7540, 7541, 7542, 7546, 7549, 7551, 7552, 7553, 7554, 7555, 7558, 7559, 7560, 7561, 7562, 7563, 7564, 7568, 7569, 7571, 7573, 7574, 7576, 7578, 7579, 7580, 7581, 7582];
    
    defaultApprovedIds.forEach(id => {
      this.approvalStatus.set(id, true);
    });
    
    this.logger.info(`Initialized ${defaultApprovedIds.length} reviews as approved by default`, 'HostawayReviewRepository');
  }

  async fetchReviews(): Promise<IHostawayReview[]> {
    try {
      // Since the API is sandboxed with no reviews, we'll use mock data
      // In a real implementation, this would make the actual API call:
      /*
      const response = await axios.get(`${this.config.baseUrl}/reviews`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          accountId: this.config.accountId
        }
      });
      
      return response.data.result || [];
      */
      
      // For now, return loaded data
      this.logger.info('Fetching reviews from loaded data', 'HostawayReviewRepository');
      return JsonDataUtils.getAllReviews(this.reviewsData);
    } catch (error) {
      this.logger.error('Error fetching reviews from Hostaway', 'HostawayReviewRepository');
      // Fallback to loaded data in case of API errors
      return JsonDataUtils.getAllReviews(this.reviewsData);
    }
  }

  async normalizeReviews(): Promise<INormalizedReview[]> {
    const reviews = await this.fetchReviews();
    this.logger.info(`Normalizing ${reviews.length} reviews`, 'HostawayReviewRepository');
    return reviews.map(review => {
      const reviewEntity = new Review(review);
      const isApproved = this.approvalStatus.get(review.id) || false;
      return reviewEntity.normalize(isApproved);
    });
  }

  async getAllReviews(): Promise<INormalizedReview[]> {
    this.logger.info('Getting all normalized reviews', 'HostawayReviewRepository');
    return await this.normalizeReviews();
  }

  async getReviewsByProperty(propertyName?: string): Promise<INormalizedReview[]> {
    this.logger.info(`Getting reviews for property: ${propertyName || 'all'}`, 'HostawayReviewRepository');
    const reviews = await this.normalizeReviews();
    if (!propertyName) return reviews;
    
    return reviews.filter(review => 
      review.propertyName.toLowerCase().includes(propertyName.toLowerCase())
    );
  }

  async getApprovedReviews(): Promise<INormalizedReview[]> {
    this.logger.info('Getting approved reviews', 'HostawayReviewRepository');
    const reviews = await this.normalizeReviews();
    return reviews.filter(review => review.isApproved);
  }

  async updateReviewApproval(reviewId: number, isApproved: boolean): Promise<boolean> {
    this.logger.info(`Updating review ${reviewId} approval to ${isApproved}`, 'HostawayReviewRepository');
    this.approvalStatus.set(reviewId, isApproved);
    this.logger.info(`Review ${reviewId} approval status updated successfully`, 'HostawayReviewRepository');
    return true;
  }
}
