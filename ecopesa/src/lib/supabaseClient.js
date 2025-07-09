import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gesdiixetrljwjfquihm.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlc2RpaXhldHJsandqZnF1aWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NjgxNjAsImV4cCI6MjA2NTI0NDE2MH0.AwHyzcSNZRiZcqUmaJNI65lS6NLgtpg35TAzZgm-ngI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
