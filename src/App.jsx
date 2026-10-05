import { useCallback, useState } from 'react'
import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router'
import { AuthProvider, useAuth } from './auth'
import { StoreProvider, storeKey, useStore } from './store'
import { Sidebar, TabBar } from './ui'
import Splash from './screens/Splash'
import Auth from './screens/Auth'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import RouteList from './screens/RouteList'
import StepDetail from './screens/StepDetail'
import Assistant from './screens/Assistant'
import Templates from './screens/Templates'
import TemplateDetail from './screens/TemplateDetail'
import Plans from './screens/Plans'
import Account from './screens/Account'
import Landing from './screens/Landing'

function RequireAuth() {
  const { session } = useAuth()
  if (!session) return <Navigate to="/conoce" replace />
  return (
    <StoreProvider key={session} storageKey={storeKey(session)}>
      <Outlet />
    </StoreProvider>
  )
}

function RequireOnboarding() {
  const { state } = useStore()
  return state.onboarded ? <Outlet /> : <Navigate to="/bienvenida" replace />
}

function CenteredLayout() {
  return (
    <div className="relative mx-auto min-h-dvh max-w-[430px]">
      <Outlet />
    </div>
  )
}

function AppLayout() {
  return (
    <div className="md:flex md:h-screen">
      <Sidebar />
      <main className="relative mx-auto min-h-dvh max-w-[430px] md:mx-0 md:max-w-none md:flex-1 md:overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

function BootSplash() {
  const { session } = useAuth()
  const [show, setShow] = useState(() => !!session)
  const hide = useCallback(() => setShow(false), [])
  return show ? <Splash onDone={hide} /> : null
}

function WithTabs() {
  return (
    <>
      <Outlet />
      <TabBar />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="bg-bg">
          <Routes>
            <Route path="/conoce" element={<Landing />} />
            <Route element={<CenteredLayout />}>
              <Route path="/acceso" element={<Auth />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route element={<CenteredLayout />}>
                <Route path="/bienvenida" element={<Onboarding />} />
              </Route>
              <Route element={<RequireOnboarding />}>
                <Route element={<AppLayout />}>
                  <Route element={<WithTabs />}>
                    <Route index element={<Home />} />
                    <Route path="ruta" element={<RouteList />} />
                    <Route path="asistente" element={<Assistant />} />
                    <Route path="plantillas" element={<Templates />} />
                    <Route path="cuenta" element={<Account />} />
                  </Route>
                  <Route path="ruta/:id" element={<StepDetail />} />
                  <Route path="plantillas/:id" element={<TemplateDetail />} />
                  <Route path="planes" element={<Plans />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <BootSplash />
      </HashRouter>
    </AuthProvider>
  )
}
