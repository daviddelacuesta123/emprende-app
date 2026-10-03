import { useCallback, useState } from 'react'
import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router'
import { AuthProvider, useAuth } from './auth'
import { StoreProvider, storeKey, useStore } from './store'
import { TabBar } from './ui'
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

function RequireAuth() {
  const { session } = useAuth()
  if (!session) return <Navigate to="/acceso" replace />
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

function WithTabs() {
  return (
    <>
      <Outlet />
      <TabBar />
    </>
  )
}

export default function App() {
  const [splash, setSplash] = useState(true)
  const hideSplash = useCallback(() => setSplash(false), [])

  return (
    <AuthProvider>
      <HashRouter>
        <div className="relative mx-auto min-h-dvh max-w-[430px] bg-bg">
          <Routes>
            <Route path="/acceso" element={<Auth />} />
            <Route element={<RequireAuth />}>
              <Route path="/bienvenida" element={<Onboarding />} />
              <Route element={<RequireOnboarding />}>
                <Route element={<WithTabs />}>
                  <Route index element={<Home />} />
                  <Route path="ruta" element={<RouteList />} />
                  <Route path="asistente" element={<Assistant />} />
                  <Route path="plantillas" element={<Templates />} />
                  <Route path="cuenta" element={<Account />} />
                </Route>
                <Route path="ruta/:id" element={<StepDetail />} />
                <Route path="plantillas/:id" element={<TemplateDetail />} />
                <Route path="planes" element={<Plans />} />              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </HashRouter>
      {splash && <Splash onDone={hideSplash} />}
    </AuthProvider>
  )
}
