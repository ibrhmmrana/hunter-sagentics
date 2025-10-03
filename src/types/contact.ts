/**
 * Contact types for lead contacts from public.lead_contacts table
 */

export interface LeadContact {
  place_id: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  seniority: string | null;
  department: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  company_name: string | null;
  source?: string | null;
  created_at?: string | null;
}
