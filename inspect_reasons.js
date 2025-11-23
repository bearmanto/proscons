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
        .from('reasons')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error selecting from reasons:', error.message);
    } else {
        console.log('Reasons data:', data);
    }
}

inspect();
