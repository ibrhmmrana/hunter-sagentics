-- Add contacted column to leads table if it doesn't exist
-- This migration is idempotent and safe to run multiple times

DO $$
BEGIN
  -- Check if contacted column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'leads' 
      AND column_name = 'contacted'
  ) THEN
    -- Add the column with default value
    ALTER TABLE public.leads 
    ADD COLUMN contacted boolean NOT NULL DEFAULT false;
    
    -- Create index for efficient filtering
    CREATE INDEX IF NOT EXISTS idx_leads_contacted 
    ON public.leads(contacted) WHERE contacted = true;
    
    -- Log the change
    RAISE NOTICE 'Added contacted column to leads table with index';
  ELSE
    RAISE NOTICE 'contacted column already exists in leads table';
  END IF;
END $$;
