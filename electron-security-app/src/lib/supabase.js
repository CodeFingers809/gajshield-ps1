import { createClient } from '@supabase/supabase-js';

const supabaseUrl = window.electronAPI.env.SUPABASE_URL;
const supabaseAnonKey = window.electronAPI.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

export const getCurrentUser = async (clerkId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    // .single();

  if (error) throw error;
  return data;
};

export const createOrGetUser = async (clerkUser) => {
  if (!clerkUser) return null;

  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkUser.id)
      // .single();

    if (existingUser) {
      // Update user's last login
      const { data: updatedUser } = await supabase
        .from('users')
        .update({ last_login: new Date() })
        .eq('clerk_id', clerkUser.id)
        .select()
        // .single();
        
      return updatedUser;
    }

    // Create new user if doesn't exist
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        clerk_id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        avatar_url: clerkUser.imageUrl,
        created_at: new Date(),
        last_login: new Date()
      }])
      .select()
      // .single();

    if (insertError) throw insertError;
    return newUser;
  } catch (error) {
    console.error('Error in createOrGetUser:', error);
    throw error;
  }
};

export const fetchScanHistory = async (clerkId) => {
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', clerkId)
    // .single();

  if (!userData) return [];

  const { data, error } = await supabase
    .from('malware_scans')
    .select('*')
    .eq('user_id', userData.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchUserData = async (clerkId) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        malware_scans (
          id,
          file_name,
          scan_status,
          threat_level,
          created_at
        )
      `)
      .eq('clerk_id', clerkId)
      // .single();

    if (userError) throw userError;
    return user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};
