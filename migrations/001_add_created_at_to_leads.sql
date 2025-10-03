-- Add created_at column to leads table if it doesn't exist
-- This migration is idempotent and safe to run multiple times

DO $$
BEGIN
  -- Check if created_at column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'leads' 
      AND column_name = 'created_at'
  ) THEN
    -- Add the column with default value
    ALTER TABLE public.leads 
    ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
    
    -- Create index for efficient sorting
    CREATE INDEX IF NOT EXISTS idx_leads_created_at 
    ON public.leads(created_at DESC);
    
    -- Log the change
    RAISE NOTICE 'Added created_at column to leads table with index';
  ELSE
    RAISE NOTICE 'created_at column already exists in leads table';
  END IF;
END $$;
