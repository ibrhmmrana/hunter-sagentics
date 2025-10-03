/**
 * Types and validation for scrape form submission
 */

import { z } from 'zod';

export const scrapeSchema = z.object({
  location: z.string().min(2, 'Location must be at least 2 characters'),
  businessType: z.array(z.string().min(1, 'Business type cannot be empty')).min(1, 'At least one business type is required'),
  websiteRequirement: z.enum(['with', 'without', 'any']).default('any'),
  leadCount: z.number().int().min(10, 'Minimum 10 leads').max(200, 'Maximum 200 leads').default(50),
});

export type ScrapeForm = z.infer<typeof scrapeSchema>;

export type ScrapePayload = {
  clientQueryId: string;
  location: string;
  businessType: string[];
  websiteRequirement: 'with' | 'without' | 'any';
  leadCount: number;
  userId: string | null;
};
