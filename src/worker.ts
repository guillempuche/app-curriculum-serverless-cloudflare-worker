export interface Env {
	SUPABASE_URL: string;
	SUPABASE_KEY: string;
}

/**
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
const worker: ExportedHandler<Env> = {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			const url = new URL(request.url);
			const table = url.searchParams.get('table');
			const order = url.searchParams.get('order');

			// We're using Supabase ordering, read the [docs](https://supabase.com/docs/reference/javascript/order).
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
			console.log(json);

			return new Response(json);
		} catch (e) {
			console.error('Fetching error:', e);
			return new Response(JSON.stringify(e), { status: 500 });
		}
	},
};

export default worker;
