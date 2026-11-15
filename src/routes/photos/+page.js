import { redirect } from '@sveltejs/kit';

// the section was renamed from photos/journey to field notes
export function load() {
	redirect(301, '/field-notes');
}
