'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

type PersonalizedFlagCardProps = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

export function PersonalizedFlagCard({ id, name, description, imageUrl }: PersonalizedFlagCardProps) {
  return (
    <Card className="group overflow-hidden rounded-lg border-2 border-transparent hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col">
      <Link href={`/drapeaux-personnalises/${id}`} className="block w-full flex-shrink-0">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </Link>

      <CardContent className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg mb-1 line-clamp-2 transition-colors duration-300 group-hover:text-blue-600">
            {name}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
