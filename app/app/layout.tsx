import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

async function AppLayout() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }
}

export default AppLayout;
