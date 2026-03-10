import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
const storageBucket = import.meta.env.PUBLIC_SUPABASE_STORAGE_BUCKET ?? 'blog-images';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
		return new Response(JSON.stringify({ error: 'Faltan variables de entorno de Supabase.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const authHeader = request.headers.get('authorization') || '';
	const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
	if (!token) {
		return new Response(JSON.stringify({ error: 'No autorizado.' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const anonClient = createClient(supabaseUrl, supabaseAnonKey);
	const { data: userData, error: userError } = await anonClient.auth.getUser(token);
	if (userError || !userData.user) {
		return new Response(JSON.stringify({ error: 'Sesion invalida o expirada.' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const formData = await request.formData();
	const file = formData.get('file');
	if (!(file instanceof File)) {
		return new Response(JSON.stringify({ error: 'No se recibio archivo.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
	const filePath = `featured/${Date.now()}-${safeName}`;
	const fileBuffer = Buffer.from(await file.arrayBuffer());

	const adminClient = createClient(supabaseUrl, serviceRoleKey);
	const { error: uploadError } = await adminClient.storage.from(storageBucket).upload(filePath, fileBuffer, {
		upsert: true,
		contentType: file.type || 'application/octet-stream',
	});

	if (uploadError) {
		return new Response(JSON.stringify({ error: uploadError.message }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const { data } = adminClient.storage.from(storageBucket).getPublicUrl(filePath);

	return new Response(JSON.stringify({ url: data.publicUrl }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
};
