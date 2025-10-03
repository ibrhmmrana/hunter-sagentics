/**
 * Scrape data layer for n8n webhook integration
 * 
 * Testing: The payload is wrapped in { body: payload } so n8n sees it under req.body.body.
 * Use clientQueryId downstream in your Set / Transform nodes to tag both leads and lead_contacts.
 */

import { v4 as uuidv4 } from 'uuid';
import { ScrapeForm, ScrapePayload } from '@/types/scrape';
import { getWebhookUrl } from '@/config/env';
import { getUserId } from '@/lib/auth';

export async function startScrape(form: ScrapeForm): Promise<{ clientQueryId: string }> {
  const clientQueryId = uuidv4();
  const userId = await getUserId();
  
  // Check if user is authenticated
  if (!userId) {
    throw new Error("Please sign in first.");
  }
  
  // Build the exact payload structure expected by n8n
  const payload: ScrapePayload = {
    clientQueryId,
    location: form.location,
    businessType: form.businessType,
    websiteRequirement: form.websiteRequirement,
    leadCount: form.leadCount,
    userId
  };

  try {
    const response = await fetch(getWebhookUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: payload }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to enqueue scrape: ${response.status} ${response.statusText}. ${errorText}`);
    }

    return { clientQueryId };
  } catch (error) {
    console.error('Scrape submission error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to enqueue scrape. Please check your connection and try again.');
  }
}
