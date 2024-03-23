import React from 'react';
import { createClient } from '@/utils/supabase/server';
import ExcludedDomainsTable from '@/app/app/options/ExcludedDomainsTable';

async function Page() {
  const supabase = createClient();
  const { data } = await supabase.from('excluded_domains').select('id').limit(100000);

  return (
    <>
      <h2 className="text-3xl">Excluded Domains</h2>

      <ExcludedDomainsTable excludedDomainsData={data || []} />
    </>
  );
}

export default Page;
