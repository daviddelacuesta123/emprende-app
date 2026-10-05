-- Esquema inicial de EmprendiApp: perfiles, progreso de la ruta, plantillas y asistente.
-- Cada usuario solo puede leer y modificar sus propias filas (RLS).
-- Las tablas no se exponen solas a la API: los permisos se dan aquí de forma explícita.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Perfiles ------------------------------------------------------------------

create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null default '' check (char_length(nombre) <= 80),
  emprendimiento text not null default '' check (char_length(emprendimiento) <= 120),
  etapa text check (etapa in ('start', 'idea', 'running')),
  onboarded boolean not null default false,
  margen_ganancia smallint not null default 40 check (margen_ganancia between 0 and 95),
  plan text not null default 'free' check (plan in ('free', 'pro')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- Progreso de la ruta ---------------------------------------------------------

create table public.actividades_completadas (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  actividad_id text not null check (char_length(actividad_id) <= 40),
  completada_en timestamptz not null default now(),
  primary key (user_id, actividad_id)
);

-- Plantillas -------------------------------------------------------------------

-- Filas de la calculadora de precio y del presupuesto inicial.
create table public.costos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  plantilla text not null check (plantilla in ('precio', 'presupuesto')),
  concepto text not null default '' check (char_length(concepto) <= 120),
  valor bigint check (valor >= 0),
  orden smallint not null default 0
);
create index costos_usuario_plantilla_idx on public.costos (user_id, plantilla, orden);

create table public.plan_negocio (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  bloque text not null check (bloque in ('problema', 'cliente', 'solucion', 'ingresos', 'canales')),
  contenido text not null default '' check (char_length(contenido) <= 2000),
  actualizado_en timestamptz not null default now(),
  primary key (user_id, bloque)
);

-- Asistente --------------------------------------------------------------------

create table public.mensajes_chat (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  rol text not null check (rol in ('user', 'assistant')),
  texto text not null check (char_length(texto) between 1 and 8000),
  accion jsonb,
  creado_en timestamptz not null default now()
);
create index mensajes_chat_usuario_idx on public.mensajes_chat (user_id, creado_en);

-- Preguntas usadas por mes (mes en UTC, formato AAAA-MM). Solo la escribe el trigger.
create table public.uso_asistente (
  user_id uuid not null references auth.users (id) on delete cascade,
  mes text not null check (mes ~ '^\d{4}-\d{2}$'),
  preguntas smallint not null default 0,
  primary key (user_id, mes)
);

-- Funciones y triggers -----------------------------------------------------------

create function private.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, nombre)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'name', ''), 80));
  return new;
end;
$$;

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function private.crear_perfil();

-- Cuenta cada pregunta del usuario y bloquea la número 11 del mes en el plan gratis.
-- Debe coincidir con AI_FREE_LIMIT en src/store.jsx.
create function private.contar_pregunta()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_plan text;
  v_usadas int;
begin
  if new.rol <> 'user' then
    return new;
  end if;

  select plan into v_plan from public.perfiles where id = new.user_id;

  insert into public.uso_asistente (user_id, mes, preguntas)
  values (new.user_id, to_char(now() at time zone 'utc', 'YYYY-MM'), 1)
  on conflict (user_id, mes) do update set preguntas = public.uso_asistente.preguntas + 1
  returning preguntas into v_usadas;

  if coalesce(v_plan, 'free') = 'free' and v_usadas > 10 then
    raise exception 'limite_preguntas' using errcode = 'P0001',
      hint = 'Se alcanzó el límite de preguntas gratis de este mes.';
  end if;

  return new;
end;
$$;

create trigger al_enviar_mensaje
  before insert on public.mensajes_chat
  for each row execute function private.contar_pregunta();

create function private.marcar_actualizado()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

create trigger perfiles_actualizado
  before update on public.perfiles
  for each row execute function private.marcar_actualizado();

create trigger plan_negocio_actualizado
  before update on public.plan_negocio
  for each row execute function private.marcar_actualizado();

revoke all on all functions in schema private from public, anon, authenticated;

-- Permisos de la API -------------------------------------------------------------

revoke all on public.perfiles, public.actividades_completadas, public.costos,
  public.plan_negocio, public.mensajes_chat, public.uso_asistente
  from anon, authenticated;

grant select on public.perfiles to authenticated;
-- El plan (free/pro) no está en esta lista: el usuario no puede cambiárselo.
grant update (nombre, emprendimiento, etapa, onboarded, margen_ganancia) on public.perfiles to authenticated;
grant select, insert, delete on public.actividades_completadas to authenticated;
grant select, insert, update, delete on public.costos to authenticated;
grant select, insert, update on public.plan_negocio to authenticated;
grant select, insert, delete on public.mensajes_chat to authenticated;
grant select on public.uso_asistente to authenticated;

-- RLS: cada quien solo ve y modifica lo suyo -----------------------------------

alter table public.perfiles enable row level security;
alter table public.actividades_completadas enable row level security;
alter table public.costos enable row level security;
alter table public.plan_negocio enable row level security;
alter table public.mensajes_chat enable row level security;
alter table public.uso_asistente enable row level security;

create policy "Ver mi perfil" on public.perfiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Editar mi perfil" on public.perfiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Ver mis actividades" on public.actividades_completadas
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Marcar mis actividades" on public.actividades_completadas
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Desmarcar mis actividades" on public.actividades_completadas
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Ver mis costos" on public.costos
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Agregar mis costos" on public.costos
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Editar mis costos" on public.costos
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Borrar mis costos" on public.costos
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Ver mi plan de negocio" on public.plan_negocio
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Escribir mi plan de negocio" on public.plan_negocio
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Editar mi plan de negocio" on public.plan_negocio
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Ver mis mensajes" on public.mensajes_chat
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Enviar mis mensajes" on public.mensajes_chat
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Borrar mis mensajes" on public.mensajes_chat
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Ver mi uso del asistente" on public.uso_asistente
  for select to authenticated using ((select auth.uid()) = user_id);
