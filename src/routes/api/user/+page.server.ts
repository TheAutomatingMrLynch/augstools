
import type { Actions } from "./$types";
import { fail, error, redirect } from '@sveltejs/kit';
import { FormHelper } from "$lib/helpers/FormHelper";
import { User } from "$lib/entities/User";
import { UserHomebrewFavorite } from "$lib/entities/UserHomebrewFavorite";
import { DataHelper } from "$lib/helpers/DataHelper";
import type { QueryFailedError } from "typeorm";
import type { AuthError } from "@supabase/supabase-js";

export const actions: Actions = {
    login: async ({ request, url, locals }) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString();

        if (!email) {
			return fail(400, { email, missing: true });
        }

        if (!locals.supabaseClient) {
            throw error(500, 'Internal Server Error');
        }
        
        try {
            const { error } = await locals.supabaseClient.auth.signInWithOtp({ email, 
                options: {
                    emailRedirectTo: url.origin ?? undefined
                }
            });
            if (error) throw error
        } catch (err) {
            console.error(err);
            let authError = err as AuthError;
            throw error(500, `Internal Server Error - ${authError.message}`);
        }

        return { id: locals.session?.user.id };
    },

    logout: async ({ request, url, locals }) => {
        if (!locals.session || !locals.supabaseClient) {
            throw redirect(301, '/');
        }

        try {
            const { error } = await locals.supabaseClient.auth.signOut();
            if (error) throw error
            return { error: null };
        } catch (err) {
            console.error(err);
            throw error(500, "Internal Server Error");
        }
    },

    save: async ({ request, locals }) => {
        if (!locals.session) {
            throw error(401, "Unauthorized");
        }

        const formData = await request.formData();
        const user = FormHelper.deserializeFormData<User>(User, formData);

        if (!user || locals.session.user.id !== user.id) {
            throw error(401, "Unauthorized");
        }

        try {
            await user.save({ data: { session: locals.session } });
        }
        catch (err) {
            let qfe = err as QueryFailedError;
            throw error(500, qfe.driverError.severity + ' - ' + qfe.driverError.detail);
        }

        return { id: user?.id };
    },

    favoriteHomebrew: async ({ request, locals, url }) => {
        if (!locals.session || !locals.user || locals.session.user.id !== locals.user.id) {
            throw error(401, "Unauthorized");
        }

        const homebrewId = Number(url.searchParams.get('id'));

        if (isNaN(homebrewId)) {
            throw error(400, "Bad Request");
        }
        const user = locals.user;

        let favorite: UserHomebrewFavorite | undefined;
        try {
            if (!user.homebrewFavorites) {
                user.homebrewFavorites = [];
            }

            if (!user.homebrewFavorites.some(h => h.homebrewId === homebrewId)) {
                favorite = await UserHomebrewFavorite.save({ homebrewId: homebrewId, userId: user.id });
            } else {
                await UserHomebrewFavorite.delete({ homebrewId: homebrewId, userId: user.id });
            }
        }
        catch (err) {
            console.error(err);
            throw error(500, "Internal Server Error");
        }
        
        return { favorite: DataHelper.serialize(favorite) };
    }
};