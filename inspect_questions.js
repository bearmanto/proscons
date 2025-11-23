const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(url, key);

async function inspect() {
    const { data, error } = await supabase
        .from('questions')
        .select('id, title, is_active, starts_at, ends_at, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    console.log('Current Server Time (UTC):', new Date().toISOString());

    if (error) {
        console.error('Error selecting from questions:', error.message);
    } else {
        console.log('Active Questions:', JSON.stringify(data, null, 2));
    }
}

inspect();
