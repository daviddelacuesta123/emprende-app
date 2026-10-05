-- Permite que cada usuario borre su propia cuenta desde la app (Ley 1581 de 2012).
-- Al borrar el usuario de auth.users, sus datos se borran en cascada en todas las tablas
-- y sus sesiones quedan invalidadas.
--
-- security definer es necesario porque el usuario no tiene permiso sobre auth.users;
-- por eso la función solo borra la fila de quien la llama (auth.uid()) y no recibe parámetros.

create function public.eliminar_mi_cuenta()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid := (select auth.uid());
begin
  if v_id is null then
    raise exception 'sin_sesion' using errcode = '42501';
  end if;

  delete from auth.users where id = v_id;
end;
$$;

revoke all on function public.eliminar_mi_cuenta() from public, anon;
grant execute on function public.eliminar_mi_cuenta() to authenticated;
