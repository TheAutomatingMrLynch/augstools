import 'reflect-metadata';
import '$lib/db';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';
import { appDataSource } from '$lib/server/db/DataSource';
import { User } from '$lib/entities/User';

export const handle: Handle = async ({event, resolve}) => {
	const { session, supabaseClient } = await getSupabase(event);
	event.locals.supabaseClient = supabaseClient;
	event.locals.session = session;

	if (!appDataSource.isInitialized) {
		await appDataSource.initialize();
	}

 	if (event.locals.session) {
		event.locals.user = await User.findOne({ where: { id: event.locals.session.user.id }, relations: { homebrewFavorites: true } });
	}

	if (event.url.pathname.endsWith('/edit')) {
		if (!event.locals.session) {
			throw redirect(303, '/errors/auth');
		}
		
		if (!event.locals.user?.userName || event.locals.user.userName.length === 0) {
			if (!event.url.pathname.startsWith('/user/'))
				throw redirect(303, '/errors/profile');
		}
	}
	
	const response = await resolve(event);
	return response;
}