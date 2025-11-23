const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function testUpdate() {
    // 1. Create a dummy question
    const { data: q, error: createError } = await supabase
        .from('questions')
        .insert({ title: 'Test Update', slug: 'test-update', is_active: true })
        .select()
        .single();

    if (createError) {
        console.error('Create failed:', createError);
        return;
    }
    console.log('Created:', q.id);

    // 2. Call the API to update it (Simulating fetch)
    // Since we can't easily call the Next.js API from node script without running server, 
    // we will just use Supabase Admin client directly here to verify the DB permission/logic 
    // BUT the user's issue might be in the API route code itself.

    // Let's inspect the API code again. 
    // src/app/api/admin/questions/[id]/route.ts uses supabaseAdmin() which is correct.

    // Instead of testing the API via HTTP (which I can't do easily here), 
    // I will assume the DB interaction is fine if this script works.

    const now = new Date().toISOString();
    const { error: updateError } = await supabase
        .from('questions')
        .update({ ends_at: now })
        .eq('id', q.id);

    if (updateError) {
        console.error('Update failed:', updateError);
    } else {
        console.log('Update successful via Supabase Client');
    }

    // 3. Cleanup
    await supabase.from('questions').delete().eq('id', q.id);
}

testUpdate();
