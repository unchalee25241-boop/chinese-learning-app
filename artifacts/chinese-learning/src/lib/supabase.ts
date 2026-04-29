import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pzgharqrgfudurmgyjvi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6Z2hhcnFyZ2Z1ZHVybWd5anZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0Mzg0OTksImV4cCI6MjA5MzAxNDQ5OX0.v_qQmKQ6y5QHZGhqE1s54wl_IwX1bQjuL9snTDGjNYQ'
export const supabase = createClient(supabaseUrl, supabaseKey)
