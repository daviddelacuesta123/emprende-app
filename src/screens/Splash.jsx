import { useEffect, useState } from 'react'
import { APP_NAME, Logo } from '../ui'

const SHOW_MS = 1600
const FADE_MS = 350

export default function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), SHOW_MS)
    const t2 = setTimeout(onDone, SHOW_MS + FADE_MS)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDone])

  return (
    <div
      role="status"
      aria-label={`Cargando ${APP_NAME}`}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-pri px-4 transition-opacity duration-[350ms] ${leaving ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center gap-5">
        <span className="animate-glow rounded-[20px] motion-reduce:animate-none">
          <Logo size={76} inverted />
        </span>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[30px] font-bold tracking-tight text-white">{APP_NAME}</span>
          <span className="text-[15px] text-sub">Tu ruta para emprender</span>
        </div>
      </div>
      <div className="absolute bottom-[max(3.5rem,env(safe-area-inset-bottom))] h-1 w-32 overflow-hidden rounded-full bg-white/15">
        <div className="h-full w-0 animate-load rounded-full bg-acc motion-reduce:w-full motion-reduce:animate-none" />
      </div>
    </div>
  )
}
