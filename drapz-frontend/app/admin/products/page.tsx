'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Produit {
    id: string;
    nom: string;
    description: string;
    prix: number;
    stock: number;
    imageUrl: string;
    pays: {
        id: string;
        nom: string;
        code: string;
    };
    actif: boolean;
}

interface Pays {
    id: string;
    nom: string;
    code: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Produit[]>([]);
    const [countries, setCountries] = useState<Pays[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        prix: 0,
        stock: 0,
        imageUrl: '',
        paysId: '',
        actif: true,
    });

    const fetchProducts = async () => {
        try {
            const response = await apiClient.get('produits?page=0&size=1000');
            setProducts(response.data.content || response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await apiClient.get('pays?page=0&size=1000');
            setCountries(response.data.content || response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des pays:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCountries();
    }, []);

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                nom: formData.nom,
                description: formData.description,
                prix: parseFloat(formData.prix.toString()),
                stock: parseInt(formData.stock.toString()),
                imageUrl: formData.imageUrl,
                paysId: formData.paysId,
                actif: formData.actif,
            };

            if (editingId) {
                await apiClient.put(`produits/${editingId}`, payload);
            } else {
                await apiClient.post('produits', payload);
            }

            setFormData({
                nom: '',
                description: '',
                prix: 0,
                stock: 0,
                imageUrl: '',
                paysId: '',
                actif: true,
            });
            setIsCreating(false);
            setEditingId(null);
            fetchProducts();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    };

    const handleEditProduct = (product: Produit) => {
        setFormData({
            nom: product.nom,
            description: product.description,
            prix: product.prix,
            stock: product.stock,
            imageUrl: product.imageUrl,
            paysId: product.pays.id,
            actif: product.actif,
        });
        setEditingId(product.id);
        setIsCreating(true);
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
            try {
                await apiClient.delete(`produits/${productId}`);
                fetchProducts();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    if (loading) {
        return <div className="text-center py-10">Chargement...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Gestion des Produits</h1>
                <Dialog open={isCreating} onOpenChange={(open) => {
                    setIsCreating(open);
                    if (!open) {
                        setEditingId(null);
                        setFormData({
                            nom: '',
                            description: '',
                            prix: 0,
                            stock: 0,
                            imageUrl: '',
                            paysId: '',
                            actif: true,
                        });
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">+ Nouveau Produit</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Éditer le produit' : 'Créer un nouveau produit'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveProduct} className="space-y-4 max-h-96 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                    <Input
                                        placeholder="Nom du produit"
                                        value={formData.nom}
                                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        value={formData.paysId}
                                        onChange={(e) => setFormData({ ...formData, paysId: e.target.value })}
                                        required
                                    >
                                        <option value="">Sélectionner un pays</option>
                                        {countries.map((c) => (
                                            <option key={c.id} value={c.id}>{c.nom}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.prix}
                                        onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) || 0 })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    rows={3}
                                    placeholder="Description du produit"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL Image</label>
                                <Input
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="actif"
                                    checked={formData.actif}
                                    onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                                    className="rounded"
                                />
                                <label htmlFor="actif" className="ml-2 text-sm text-gray-700">Actif</label>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => {
                                    setIsCreating(false);
                                    setEditingId(null);
                                }}>
                                    Annuler
                                </Button>
                                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                    {editingId ? 'Mettre à jour' : 'Créer'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition">
                        {product.imageUrl && (
                            <img src={product.imageUrl} alt={product.nom} className="w-full h-48 object-cover" />
                        )}
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-800">{product.nom}</h3>
                            <p className="text-sm text-gray-600 mb-2">{product.pays.nom}</p>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl font-bold text-green-600">${product.prix.toFixed(2)}</span>
                                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded">Stock: {product.stock}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => handleEditProduct(product)}
                                >
                                    Éditer
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 text-red-600 hover:bg-red-50"
                                    onClick={() => handleDeleteProduct(product.id)}
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
