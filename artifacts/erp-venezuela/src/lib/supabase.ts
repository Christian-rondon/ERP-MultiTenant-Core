import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvwqezjeqpgxszhjbugt.supabase.co';
const supabaseAnonKey = 'sb_publishable_ASL06SqCR4WaTLx-8OFtJQ_hCli7OUe';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
