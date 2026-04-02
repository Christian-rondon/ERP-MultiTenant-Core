import { supabase } from './supabase';

export const getAdminStatus = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { isSuperAdmin: false, tenantId: null };

  // El is_super_admin viene en los metadatos que inyectamos por SQL
  const isSuperAdmin = user.app_metadata?.is_super_admin === true;
  
  // Obtenemos su perfil para saber a qué Tenant pertenece
  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('id', user.id)
    .maybeSingle();

  return {
    isSuperAdmin,
    tenantId: profile?.tenant_id,
    role: profile?.role,
    email: user.email
  };
};
