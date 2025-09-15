import { IHostawayReview, INormalizedReview, IReviewCategory } from '../types/review';

export class Review {
  constructor(private readonly data: IHostawayReview) {}

  getId(): number {
    return this.data.id;
  }

  getType(): string {
    return this.data.type;
  }

  getStatus(): string {
    return this.data.status;
  }

  getRating(): number | null {
    return this.data.rating;
  }

  getPublicReview(): string {
    return this.data.publicReview;
  }

  getCategories(): IReviewCategory[] {
    return this.data.reviewCategory;
  }

  getSubmittedAt(): Date {
    return new Date(this.data.submittedAt);
  }

  getGuestName(): string {
    return this.data.guestName;
  }

  getListingName(): string {
    return this.data.listingName;
  }

  getChannel(): string {
    return this.data.channel || 'unknown';
  }

  getOverallRating(): number | null {
    // Calculate overall rating from categories if not provided
    if (this.data.rating !== null) {
      return this.data.rating;
    }

    if (this.data.reviewCategory.length > 0) {
      const sum = this.data.reviewCategory.reduce((total, cat) => total + cat.rating, 0);
      return Math.round(sum / this.data.reviewCategory.length);
    }

    return null;
  }

  normalize(isApproved: boolean = false): INormalizedReview {
    return {
      id: this.data.id,
      type: this.data.type,
      status: this.data.status,
      overallRating: this.getOverallRating(),
      publicReview: this.data.publicReview,
      categories: this.data.reviewCategory,
      submittedAt: this.getSubmittedAt(),
      guestName: this.data.guestName,
      propertyName: this.data.listingName,
      channel: this.getChannel(),
      isApproved: isApproved
    };
  }
}
