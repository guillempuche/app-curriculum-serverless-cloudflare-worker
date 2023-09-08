# Cloudflare Worker or Function as a Services (Faas)

This project is a FaaS deployed on Cloudflare.

The function is used in the mobile app and web app [App Curriculum](https://github.com/guillempuche/app_curriculum).

## Run the worker locally

> You could need creating a Cloudflare Worker on Cloudflare website.

1. Open the project in your terminal, and install the packages running this command `npm i`.
2. Create the secret local environment variables in a new file on the root directory of this project called `.dev.vars` with the next code:

```
SUPABASE_URL=replace_with_your_base_url
SUPABASE_KEY=replace_with_your_key
```

3. Run locally the worker `npx wrangler dev` or `npm start`.
4. Open a browser tab at http://localhost:8787/ to see your worker in action
5. Run `npx wrangler deploy` or `npm run deploy` to publish your worker

If you deploy the worker, you'll also need to create the secret environment variables on the Cloud. Hence, follow this tutorial ([tutorial here](https://developers.cloudflare.com/workers/configuration/environment-variables/)).

## Resources

- Cloudflare Workers https://developers.cloudflare.com/workers/
- Cloudflare Wrangler or CLI https://developers.cloudflare.com/workers/wrangler
- Workers configuration file `wrangler.toml` in https://developers.cloudflare.com/workers/wrangler/configuration/ and https://developers.cloudflare.com/workers/configuration/sites/configuration/
- Code examples https://github.com/cloudflare?q=worker&type=all&language=javascript