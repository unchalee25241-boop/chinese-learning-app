import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pzgharqrgfudurmgyjvi.supabase.co'
const supabaseKey = 'sb_publishable_JVLIfcvw93g04fvURmc3zg_sfPnVIHR'
export const supabase = createClient(supabaseUrl, supabaseKey)
