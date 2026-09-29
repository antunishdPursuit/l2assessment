# Groq setup for the local assessment

1. Create an API key in [Groq Console](https://console.groq.com/keys).
2. In the repository root, copy `.env.example` to `.env.local` only if the local
   file does not already exist.
3. Paste the key after `VITE_GROQ_API_KEY=` in `.env.local`, then save it.
4. Run `npm run dev` and open the local URL. If the server was already running,
   reload the app after Vite restarts for the environment change.
5. Analyze a synthetic message. A live result shows **AI Reasoning**. A failed
   call or missing key shows **Offline estimate**.

Do not paste keys into chat or commit `.env.local`. Git ignores this file.
The app still sends requests directly from the browser, so the key is visible
to that browser. This configuration is for local assessment use only.
Production use needs a backend that keeps credentials server-side.

The default model is `openai/gpt-oss-20b`. Override it with `VITE_GROQ_MODEL` only
with a model your account can access that supports strict structured outputs.
The original `llama-3.3-70b-versatile` returned a model-access 404 in testing.
See [supported models](https://console.groq.com/docs/models) and
[structured outputs](https://console.groq.com/docs/structured-outputs).

If results show Offline estimate, check the browser console for a provider
error. Authentication errors require checking the saved key; model-access errors
require an available model; rate limits require waiting or checking account
limits. Never share the key in logs or screenshots. Quotas and pricing depend
on your account and model; verify them in Groq Console.
