import express from 'express'
import { chat } from './llm/index.js'
import { SYSTEM_PROMPT } from './prompt.js'

const app = express()
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages requerido' })
  }

  const withSystem = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]

  try {
    const content = await chat(withSystem)
    res.json({ content })
  } catch (err) {
    console.error('[chat]', err.message)
    res.status(503).json({ error: 'El asistente no está disponible ahora. Intenta más tarde.' })
  }
})

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => console.log(`Server listo en http://localhost:${PORT}`))
