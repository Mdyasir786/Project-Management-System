
import { createClient } from "@supabase/supabase-js"
const supabaseUrl = "https://fywvagakagyirqipmixc.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5d3ZhZ2FrYWd5aXJxaXBtaXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5ODM4NTQsImV4cCI6MjA1MDU1OTg1NH0.fql5jtJg0osm0qjXHchs0keFPUNdNC9kGYnr9s_SQkY"
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;
