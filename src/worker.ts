export interface Env {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
}

/**
 * Fetch all data of a given Supabase table and sorting with query parameters `table` and `order`. Eg. `?table=experiences&order=end_date.desc,start_date.desc`
 *
 * _More about Supabase [here](https://supabase.com/docs/guides/api/quickstart)._
 */
const worker: ExportedHandler<Env> = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);

      if (request.method === 'OPTIONS') {
        return handleOptions(request);
      }

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
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const json = JSON.stringify(await response.json());

      // These headers solve "Reason: CORS header 'Access-Control-Allow-Origin' missing"
      const headers = new Headers();
      headers.set('Access-Control-Allow-Origin', 'https://curriculum.guillempuche.com');
      headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      headers.set('Content-Type', 'application/json');

      return new Response(json, {
        status: 200,
        headers: headers,
      });
    } catch (e) {
      const errorResponse = {
        message: 'Internal Server Error',
        custom: 'An error occurred while processing your request.'
      };
      return new Response(JSON.stringify(errorResponse), { status: 500, headers: { 'Content-Type': 'application/json' } });
		}
  },
};

function handleOptions(request: Request): Response {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', 'https://curriculum.guillempuche.com');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  headers.set('Content-Type', 'application/json');

  return new Response(null, {
    status: 204,
    headers: headers,
  });
}

export default worker;
