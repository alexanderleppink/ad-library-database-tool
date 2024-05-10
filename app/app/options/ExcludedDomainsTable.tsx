'use client';

import { Button, Checkbox, Table } from 'flowbite-react';
import React, { useMemo, useState } from 'react';
import type { ExcludedDomainData } from '@/types/supabaseHelper.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import { TrashIcon } from '@heroicons/react/24/solid';

interface ExcludedDomainsTableProps {
  excludedDomainsData: Pick<ExcludedDomainData, 'id'>[];
}

function ExcludedDomainsTable({ excludedDomainsData }: ExcludedDomainsTableProps) {
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [deletedDomains, setDeletedDomains] = useState<Set<string>>(new Set<string>([]));
  const supabase = createClientComponentClient<Database>();

  const handleRemoveExcludedDomains = async () => {
    await supabase.from('excluded_domains').delete().in('id', selectedDomains);
    setDeletedDomains((prev) => new Set([...prev, ...selectedDomains]));
    setSelectedDomains([]);
  };

  const handleCheckboxClick = (id: string) => {
    setSelectedDomains((prev) => {
      if (prev.includes(id)) {
        return prev.filter((domain) => domain !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const excludedDomains = useMemo(
    () => excludedDomainsData.filter((domain) => !deletedDomains.has(domain.id)),
    [excludedDomainsData, deletedDomains]
  );

  return (
    <Table hoverable className="w-[600px]">
      <Table.Head>
        <Table.HeadCell className="p-4">
          <Button
            color="failure"
            pill
            size="xs"
            disabled={!selectedDomains.length}
            onClick={handleRemoveExcludedDomains}
          >
            <TrashIcon className="w-5 h-5" />
          </Button>
        </Table.HeadCell>
        <Table.HeadCell>Domain</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {excludedDomains.map(({ id }) => (
          <Table.Row key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="p-4">
              <Checkbox
                readOnly
                checked={selectedDomains.includes(id)}
                onClick={() => handleCheckboxClick(id)}
              />
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {id}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default ExcludedDomainsTable;
