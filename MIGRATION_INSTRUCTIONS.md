# Database Migration Instructions

## Add Contacted Column to Leads Table

To enable the "Contacted" functionality, you need to run a database migration in your Supabase dashboard.

### Steps:

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to the "SQL Editor" tab

2. **Run the Migration**
   - Copy and paste the following SQL into the SQL Editor:

```sql
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
```

3. **Execute the Migration**
   - Click "Run" to execute the SQL
   - You should see a success message

4. **Verify the Migration**
   - The migration is idempotent, so it's safe to run multiple times
   - All existing leads will have `contacted = false` by default
   - New leads will also default to `contacted = false`

### What This Migration Does:

- ✅ Adds a `contacted` boolean column to the `leads` table
- ✅ Sets default value to `false` for all existing and new leads
- ✅ Creates an index for efficient filtering of contacted leads
- ✅ Is idempotent (safe to run multiple times)
- ✅ Preserves all existing data

### After Migration:

Once the migration is complete, the "Contacted" functionality will work fully:
- Users can mark leads as contacted
- Visual indicators will show contacted status
- Status will be persisted in the database
- Filtering by contacted status will be efficient

### Troubleshooting:

If you encounter any issues:
1. Make sure you have the correct permissions in Supabase
2. Check that the `leads` table exists
3. Verify the migration ran successfully by checking the table schema
4. The app will show helpful error messages if the column is missing
