import * as ollama from './providers/ollama.js'

const PROVIDERS = { ollama }

const provider = PROVIDERS[process.env.LLM_PROVIDER ?? 'ollama']
if (!provider) throw new Error(`Unknown LLM provider: ${process.env.LLM_PROVIDER}`)

export const chat = (messages) => provider.chat(messages)
