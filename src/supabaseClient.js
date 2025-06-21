import { createClient } from '@supabase/supabase-js';

// Remplace ces valeurs par celles de ton projet Supabase
const supabaseUrl = 'https://ntuyoabqmkhqfstxietj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50dXlvYWJxbWtocWZzdHhpZXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTUzNjAsImV4cCI6MjA2NjA5MTM2MH0.osqAb9pzvmNFYh6HIJlBXihNCBHX4DLBBv4eQrG06Tw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 