import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const createSupabaseBrowserClient = () => {
	if (!hasSupabaseConfig) {
		throw new Error('Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY environment variables.');
	}

	return createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: true,
		},
	});
};

export const createSupabaseServerClient = () => {
	if (!hasSupabaseConfig) {
		return null;
	}

	return createClient(supabaseUrl, supabaseAnonKey, {
		auth: { persistSession: false },
	});
};

export interface BlogPostRecord {
	id: string;
	slug: string;
	title: string;
	description: string;
	content: string;
	cover_image: string | null;
	author_name: string;
	status: 'draft' | 'published';
	published_at: string | null;
	created_at: string;
	updated_at: string;
}
