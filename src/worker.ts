export interface Env {
	SUPABASE_URL: string;
	SUPABASE_KEY: string;
}

/**
 * Fetch all data of a given Supabase table and sorting with query parameters `table` and `order`. Eg. `?table=experiences&order=end_data.desc,start_date.desc`
 *
 * _More about Supabase [here](https://supabase.com/docs/guides/api/quickstart)._
 */
const worker: ExportedHandler<Env> = {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			const url = new URL(request.url);
			const table = url.searchParams.get('table');
			const order = url.searchParams.get('order');

			// It's using Supabase ordering, read the [docs](https://supabase.com/docs/reference/javascript/order).
			const response = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}?select=*&order=${order}`, {
				method: 'GET',
				headers: {
					apikey: env.SUPABASE_KEY,
					Authorization: `Bearer ${env.SUPABASE_KEY}`,
				},
			});

			if (!response.ok) {
				throw new Error(JSON.stringify(response.status));
			}

			const json = JSON.stringify(await response.json());

			return new Response(json);
		} catch (e) {
			return new Response(JSON.stringify(e), { status: 500 });
		}
	},
};

export default worker;
