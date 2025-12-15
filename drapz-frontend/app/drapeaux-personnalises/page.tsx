"use client";

import React, { useEffect, useState } from 'react';
import { getPersonalizedFlags } from '@/lib/services/personalized-flags-service';
import { PersonalizedFlag } from '@/types/api';
import { PersonalizedFlagCard } from '@/components/personalized-flag-card';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

const PersonalizedFlagsPage = () => {
    const [flags, setFlags] = useState<PersonalizedFlag[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        const fetchFlags = async () => {
            try {
                const fetchedFlags = await getPersonalizedFlags(debouncedSearchTerm);
                setFlags(fetchedFlags);
            } catch (error) {
                console.error("Failed to fetch personalized flags", error);
            }
        };

        fetchFlags();
    }, [debouncedSearchTerm]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Drapeaux Personnalisés</h1>
            <div className="mb-8">
                <Input
                    type="text"
                    placeholder="Rechercher un drapeau..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {flags.map((flag) => (
                    <PersonalizedFlagCard
                        key={flag.id}
                        id={flag.id}
                        name={flag.name}
                        description={flag.description}
                        imageUrl={flag.imageUrl}
                    />
                ))}
            </div>
        </div>
    );
};

export default PersonalizedFlagsPage;