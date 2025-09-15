'use client';

import dynamic from 'next/dynamic';
import type { Center } from '@/types'; // or define inline if needed

const CollectionMap = dynamic(() => import('@/components/collection-map'), {
  ssr: false,
});

type Props = {
  centers: Center[];
};

export default function CollectionMapWrapper({ centers }: Props) {
  return (
    <div className="rounded-lg h-64 mb-6 overflow-hidden">
      <CollectionMap centers={centers} />
    </div>
  );
}
