-- Test simple pour vérifier les données
SELECT COUNT(*) as total_produits FROM produits;
SELECT COUNT(*) as total_pays FROM pays;
SELECT p.nom, p.prix, p.stock, p.actif FROM produits p LIMIT 5;
SELECT COUNT(*) as produits_avec_pays FROM produits WHERE pays_id IS NOT NULL;
