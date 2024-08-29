import { redirect } from '@sveltejs/kit';

export function load({ request }) {
    const acceptLanguage = request.headers.get('accept-language');

    // TODO: Assert language is supported or use 'en'
    const languageCode = acceptLanguage?.split(',')[0].split('-')[0] || 'en';

    throw redirect(307, `/${languageCode}`);
}
