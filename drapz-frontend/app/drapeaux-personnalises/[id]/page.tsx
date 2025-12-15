"use client";

import React from 'react';

const PersonalizedFlagDetailPage = ({ params }: { params: { id: string } }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Drapeau Personnalisé #{params.id}</h1>
            <p>Détails du drapeau personnalisé.</p>
        </div>
    );
};

export default PersonalizedFlagDetailPage;
