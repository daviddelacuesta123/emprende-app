-- Reemplaza las filas de una plantilla (calculadora o presupuesto) en una sola transacción,
-- para que nunca queden borradas si la pestaña se cierra a mitad del guardado.
-- security invoker: corre con los permisos del usuario, así que RLS sigue aplicando.

create function public.guardar_costos(p_plantilla text, p_filas jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from public.costos
  where user_id = (select auth.uid()) and plantilla = p_plantilla;

  insert into public.costos (user_id, plantilla, concepto, valor, orden)
  select (select auth.uid()), p_plantilla, coalesce(f ->> 'concepto', ''), (f ->> 'valor')::bigint, (n - 1)::smallint
  from jsonb_array_elements(p_filas) with ordinality as filas (f, n);
end;
$$;

revoke all on function public.guardar_costos(text, jsonb) from public, anon;
grant execute on function public.guardar_costos(text, jsonb) to authenticated;
