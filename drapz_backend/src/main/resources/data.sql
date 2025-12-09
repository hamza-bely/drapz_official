-- =====================================================
-- DRAPZ - Database Initialization Script
-- Comprehensive idempotent initialization for:
-- - Users (1 Admin + 1 User)
-- - Countries (195 countries + 6 regions = 201 total)
-- - Products (Flags for each country)
-- =====================================================

-- =====================================================
-- 1. CREATE TABLES (IF NOT EXISTS)
-- =====================================================

-- Ensure extension for gen_random_uuid()

-- Activer l'extension pour gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Table adaptée à l'entité @Table(name = "utilisateurs")
CREATE TABLE IF NOT EXISTS utilisateurs (
                                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                            email VARCHAR(255) NOT NULL UNIQUE,
                                            mot_de_passe VARCHAR(255) NOT NULL,
                                            nom VARCHAR(100) NOT NULL,
                                            prenom VARCHAR(100) NOT NULL,
                                            role VARCHAR(50) NOT NULL,
                                            actif BOOLEAN NOT NULL DEFAULT TRUE,
                                            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                                            updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                                            CONSTRAINT role_chk CHECK (role IN ('USER', 'ADMIN'))
);


CREATE TABLE IF NOT EXISTS pays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    flag_url VARCHAR(500),
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    pays_id UUID,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_produits_pays FOREIGN KEY (pays_id) REFERENCES pays(id)
);

-- =====================================================
-- 2. CREATE INDEXES (IF NOT EXISTS)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_utilisateur_email ON utilisateur(email);
CREATE INDEX IF NOT EXISTS idx_pays_code ON pays(code);
CREATE INDEX IF NOT EXISTS idx_produits_pays_id ON produits(pays_id);
CREATE INDEX IF NOT EXISTS idx_produits_nom ON produits(nom);

-- =====================================================
-- 3. INSERT USERS (1 ADMIN + 1 USER)
-- =====================================================

-- Admin user (password: admin123)

INSERT INTO utilisateurs (id, email, mot_de_passe, nom, prenom, role, actif, created_at, updated_at)
VALUES (
           '550e8400-e29b-41d4-a716-446655440000'::UUID,
           'admin@drapz.com',
           '$2a$10$slYQmyNdGzin7olVN3/p2OPST9/PgBkqquzi.Ss8KIUgO2t0jKMm2',
           'Admin', 'Drapz',
           'ADMIN',
           TRUE,
           NOW(), NOW()
       )
ON CONFLICT (email) DO UPDATE SET
                                  mot_de_passe = EXCLUDED.mot_de_passe,
                                  nom          = EXCLUDED.nom,
                                  prenom       = EXCLUDED.prenom,
                                  role         = EXCLUDED.role,
                                  actif        = EXCLUDED.actif,
                                  updated_at   = NOW();


-- =====================================================
-- 4. INSERT ALL COUNTRIES (201 countries/regions)
-- =====================================================

INSERT INTO pays (id, nom, code, latitude, longitude, flag_url, actif, created_at, updated_at)
SELECT * FROM (VALUES
    (gen_random_uuid(), 'Afghanistan', 'AF', 33.939110, 67.709953, 'https://flagcdn.com/w320/af.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Afrique du Sud', 'ZA', -30.559482, 22.937453, 'https://flagcdn.com/w320/za.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Albanie', 'AL', 41.153332, 20.168331, 'https://flagcdn.com/w320/al.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Algérie', 'DZ', 28.034886, 1.659626, 'https://flagcdn.com/w320/dz.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Allemagne', 'DE', 51.165691, 10.451526, 'https://flagcdn.com/w320/de.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Andorre', 'AD', 42.546245, 1.601554, 'https://flagcdn.com/w320/ad.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Angola', 'AO', -11.202692, 17.873887, 'https://flagcdn.com/w320/ao.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Anguilla', 'AI', 18.220554, -63.068615, 'https://flagcdn.com/w320/ai.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Antarctique', 'AQ', -75.250973, -0.071389, 'https://flagcdn.com/w320/aq.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Antigua-et-Barbuda', 'AG', 17.060816, -61.796428, 'https://flagcdn.com/w320/ag.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Arabie Saoudite', 'SA', 23.885942, 45.079162, 'https://flagcdn.com/w320/sa.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Arménie', 'AM', 40.069099, 45.038189, 'https://flagcdn.com/w320/am.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Aruba', 'AW', 12.169570, -69.992675, 'https://flagcdn.com/w320/aw.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Australie', 'AU', -25.276987, 133.775136, 'https://flagcdn.com/w320/au.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Autriche', 'AT', 47.516231, 14.550072, 'https://flagcdn.com/w320/at.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Azerbaïdjan', 'AZ', 40.143105, 47.576927, 'https://flagcdn.com/w320/az.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Bahamas', 'BS', 25.025885, -77.393228, 'https://flagcdn.com/w320/bs.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Bahreïn', 'BH', 26.067132, 50.558002, 'https://flagcdn.com/w320/bh.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Bangladesh', 'BD', 23.684994, 90.356331, 'https://flagcdn.com/w320/bd.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Barbade', 'BB', 13.193987, -59.543198, 'https://flagcdn.com/w320/bb.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Belgique', 'BE', 50.503887, 4.469936, 'https://flagcdn.com/w320/be.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Belize', 'BZ', 17.189877, -88.757766, 'https://flagcdn.com/w320/bz.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Bénin', 'BJ', 9.307603, 2.358521, 'https://flagcdn.com/w320/bj.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Bermudes', 'BM', 32.331149, -64.755674, 'https://flagcdn.com/w320/bm.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Bhoutan', 'BT', 27.514162, 90.433601, 'https://flagcdn.com/w320/bt.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Biélorussie', 'BY', 53.709807, 27.953389, 'https://flagcdn.com/w320/by.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Birmanie', 'MM', 21.913965, 95.956711, 'https://flagcdn.com/w320/mm.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Botswana', 'BW', -22.328474, 24.684866, 'https://flagcdn.com/w320/bw.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Brésil', 'BR', -14.235004, -51.925280, 'https://flagcdn.com/w320/br.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Brunei', 'BN', 4.535277, 114.727669, 'https://flagcdn.com/w320/bn.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Bulgarie', 'BG', 42.733883, 25.485830, 'https://flagcdn.com/w320/bg.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Burkina Faso', 'BF', 12.238333, -1.561593, 'https://flagcdn.com/w320/bf.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Burundi', 'BI', -3.373056, 29.918886, 'https://flagcdn.com/w320/bi.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Cambodge', 'KH', 12.565679, 104.990963, 'https://flagcdn.com/w320/kh.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Cameroun', 'CM', 3.848039, 11.502075, 'https://flagcdn.com/w320/cm.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Canada', 'CA', 56.130366, -106.346771, 'https://flagcdn.com/w320/ca.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Cap-Vert', 'CV', 16.969541, -23.633195, 'https://flagcdn.com/w320/cv.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Chili', 'CL', -35.675197, -71.542994, 'https://flagcdn.com/w320/cl.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Chine', 'CN', 35.861660, 104.195397, 'https://flagcdn.com/w320/cn.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Chypre', 'CY', 34.922039, 33.430863, 'https://flagcdn.com/w320/cy.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Colombie', 'CO', 4.570868, -74.297333, 'https://flagcdn.com/w320/co.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Comores', 'KM', -11.875001, 43.333336, 'https://flagcdn.com/w320/km.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Congo', 'CG', -4.038333, 21.758664, 'https://flagcdn.com/w320/cg.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Congo (Rép. Dém.)', 'CD', -4.038333, 21.758664, 'https://flagcdn.com/w320/cd.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Corée du Nord', 'KP', 40.339336, 127.510093, 'https://flagcdn.com/w320/kp.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Corée du Sud', 'KR', 35.907757, 127.766922, 'https://flagcdn.com/w320/kr.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Costa Rica', 'CR', 9.748917, -83.753428, 'https://flagcdn.com/w320/cr.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Côte d''Ivoire', 'CI', 7.540411, -5.551236, 'https://flagcdn.com/w320/ci.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Croatie', 'HR', 45.100000, 15.200000, 'https://flagcdn.com/w320/hr.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Cuba', 'CU', 21.521757, -77.781167, 'https://flagcdn.com/w320/cu.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Curaçao', 'CW', 12.169570, -68.990326, 'https://flagcdn.com/w320/cw.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Danemark', 'DK', 56.26392, 9.501785, 'https://flagcdn.com/w320/dk.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Djibouti', 'DJ', 11.855591, 42.590275, 'https://flagcdn.com/w320/dj.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Dominique', 'DM', 15.414999, -61.370716, 'https://flagcdn.com/w320/dm.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Égypte', 'EG', 26.820553, 30.802498, 'https://flagcdn.com/w320/eg.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Émirats Arabes Unis', 'AE', 23.424076, 53.847818, 'https://flagcdn.com/w320/ae.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Équateur', 'EC', -1.831239, -78.183406, 'https://flagcdn.com/w320/ec.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Érythrée', 'ER', 15.179384, 39.782334, 'https://flagcdn.com/w320/er.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Espagne', 'ES', 40.463667, -3.74922, 'https://flagcdn.com/w320/es.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Estonie', 'EE', 58.595272, 25.013607, 'https://flagcdn.com/w320/ee.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'États-Unis', 'US', 37.09024, -95.71289, 'https://flagcdn.com/w320/us.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Éthiopie', 'ET', 9.145695, 40.489673, 'https://flagcdn.com/w320/et.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Fidji', 'FJ', -17.712732, 178.065032, 'https://flagcdn.com/w320/fj.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Finlande', 'FI', 61.924110, 25.748151, 'https://flagcdn.com/w320/fi.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'France', 'FR', 46.227638, 2.213749, 'https://flagcdn.com/w320/fr.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Gabon', 'GA', -0.803689, 11.609444, 'https://flagcdn.com/w320/ga.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Gambie', 'GM', 13.443182, -15.310139, 'https://flagcdn.com/w320/gm.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Géorgie', 'GE', 42.315658, 43.356521, 'https://flagcdn.com/w320/ge.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Ghana', 'GH', 7.369722, -5.552805, 'https://flagcdn.com/w320/gh.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Gibraltar', 'GI', 36.137741, -5.345374, 'https://flagcdn.com/w320/gi.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Grèce', 'GR', 39.074208, 21.824312, 'https://flagcdn.com/w320/gr.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Grenade', 'GD', 12.262776, -61.604172, 'https://flagcdn.com/w320/gd.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Groenland', 'GL', 71.706936, -42.604303, 'https://flagcdn.com/w320/gl.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Guadeloupe', 'GP', 16.995726, -62.067641, 'https://flagcdn.com/w320/gp.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Guam', 'GU', 13.444304, 144.793732, 'https://flagcdn.com/w320/gu.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Guatemala', 'GT', 15.783471, -90.230759, 'https://flagcdn.com/w320/gt.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Guernesey', 'GG', 49.465691, -2.585278, 'https://flagcdn.com/w320/gg.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Guinée', 'GN', 9.945587, -9.696645, 'https://flagcdn.com/w320/gn.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Guinée Équatoriale', 'GQ', 1.650801, 10.267895, 'https://flagcdn.com/w320/gq.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Guinée-Bissau', 'GW', 11.803749, -15.180413, 'https://flagcdn.com/w320/gw.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Guyana', 'GY', 4.860416, -58.93018, 'https://flagcdn.com/w320/gy.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Guyane française', 'GF', 3.933889, -53.125782, 'https://flagcdn.com/w320/gf.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Haïti', 'HT', 18.971187, -72.285215, 'https://flagcdn.com/w320/ht.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Honduras', 'HN', 15.200000, -86.241389, 'https://flagcdn.com/w320/hn.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Hong Kong', 'HK', 22.396428, 114.109497, 'https://flagcdn.com/w320/hk.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Hongrie', 'HU', 47.162494, 19.503304, 'https://flagcdn.com/w320/hu.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Île Bouvet', 'BV', -54.423199, 3.413194, 'https://flagcdn.com/w320/bv.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Île Christmas', 'CX', -10.447525, 105.690449, 'https://flagcdn.com/w320/cx.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Île Norfolk', 'NF', -29.040835, 167.954712, 'https://flagcdn.com/w320/nf.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Îles Åland', 'AX', 60.116667, 19.9, 'https://flagcdn.com/w320/ax.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Îles Caïmans', 'KY', 19.313433, -81.254453, 'https://flagcdn.com/w320/ky.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Îles Cocos', 'CC', -12.164165, 96.870956, 'https://flagcdn.com/w320/cc.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Îles Cook', 'CK', -21.236736, -159.777671, 'https://flagcdn.com/w320/ck.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Îles Féroé', 'FO', 61.892635, -6.911806, 'https://flagcdn.com/w320/fo.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Îles Heard et McDonald', 'HM', -53.08181, 72.51454, 'https://flagcdn.com/w320/hm.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Îles Malouines', 'FK', -51.796253, -59.523613, 'https://flagcdn.com/w320/fk.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Îles Mariannes du Nord', 'MP', 17.287592, 145.194007, 'https://flagcdn.com/w320/mp.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Îles Marshall', 'MH', 7.1315, 171.1845, 'https://flagcdn.com/w320/mh.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Îles Pitcairn', 'PN', -24.703615, -127.439308, 'https://flagcdn.com/w320/pn.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Îles Salomon', 'SB', -9.645710, 160.156194, 'https://flagcdn.com/w320/sb.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Îles Turques et Caïques', 'TC', 21.916221, -71.979676, 'https://flagcdn.com/w320/tc.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Îles Vierges britanniques', 'VG', 18.420695, -64.639968, 'https://flagcdn.com/w320/vg.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Îles Vierges des États-Unis', 'VI', 17.758629, -64.8378, 'https://flagcdn.com/w320/vi.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Inde', 'IN', 20.593684, 78.962883, 'https://flagcdn.com/w320/in.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Indonésie', 'ID', -0.789275, 113.921327, 'https://flagcdn.com/w320/id.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Irak', 'IQ', 33.313199, 44.361489, 'https://flagcdn.com/w320/iq.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Iran', 'IR', 32.427486, 53.688046, 'https://flagcdn.com/w320/ir.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Irlande', 'IE', 53.4129, -8.2439, 'https://flagcdn.com/w320/ie.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Islande', 'IS', 64.963051, -19.020835, 'https://flagcdn.com/w320/is.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Israël', 'IL', 31.046051, 34.851612, 'https://flagcdn.com/w320/il.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Italie', 'IT', 41.871940, 12.567380, 'https://flagcdn.com/w320/it.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Jamaïque', 'JM', 18.109581, -77.297508, 'https://flagcdn.com/w320/jm.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Japon', 'JP', 36.204824, 138.252924, 'https://flagcdn.com/w320/jp.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Jersey', 'JE', 49.214439, -2.13125, 'https://flagcdn.com/w320/je.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Jordanie', 'JO', 30.585164, 36.238414, 'https://flagcdn.com/w320/jo.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Kazakhstan', 'KZ', 48.019573, 66.923684, 'https://flagcdn.com/w320/kz.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Kenya', 'KE', -0.023559, 37.906193, 'https://flagcdn.com/w320/ke.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Kirghizistan', 'KG', 41.5015, 74.6671, 'https://flagcdn.com/w320/kg.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Kiribati', 'KI', -3.370417, -168.734039, 'https://flagcdn.com/w320/ki.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Koweït', 'KW', 29.31166, 47.48266, 'https://flagcdn.com/w320/kw.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Laos', 'LA', 19.852604, 102.495496, 'https://flagcdn.com/w320/la.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Lesotho', 'LS', -29.610039, 28.233606, 'https://flagcdn.com/w320/ls.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Lettonie', 'LV', 56.879635, 24.603189, 'https://flagcdn.com/w320/lv.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Liban', 'LB', 33.854721, 35.862285, 'https://flagcdn.com/w320/lb.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Liberia', 'LR', 6.428055, -9.429499, 'https://flagcdn.com/w320/lr.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Libye', 'LY', 26.3351, 17.2283, 'https://flagcdn.com/w320/ly.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Liechtenstein', 'LI', 47.166, 9.555, 'https://flagcdn.com/w320/li.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Lituanie', 'LT', 55.169438, 23.881275, 'https://flagcdn.com/w320/lt.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Luxembourg', 'LU', 49.815273, 6.129583, 'https://flagcdn.com/w320/lu.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Macao', 'MO', 22.198745, 113.543873, 'https://flagcdn.com/w320/mo.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Macédoine', 'MK', 41.608635, 21.745275, 'https://flagcdn.com/w320/mk.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Madagascar', 'MG', -18.766947, 46.869107, 'https://flagcdn.com/w320/mg.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Malaisie', 'MY', 4.210484, 101.975766, 'https://flagcdn.com/w320/my.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Malawi', 'MW', -13.254308, 34.301525, 'https://flagcdn.com/w320/mw.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Maldives', 'MV', 3.202778, 73.220680, 'https://flagcdn.com/w320/mv.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Mali', 'ML', 17.570692, -3.996166, 'https://flagcdn.com/w320/ml.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Malte', 'MT', 35.937496, 14.375416, 'https://flagcdn.com/w320/mt.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Maroc', 'MA', 31.791702, -7.092620, 'https://flagcdn.com/w320/ma.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Martinique', 'MQ', 14.641528, -61.024174, 'https://flagcdn.com/w320/mq.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Mauritanie', 'MR', 21.007890, -10.940835, 'https://flagcdn.com/w320/mr.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Île Maurice', 'MU', -20.348404, 57.552152, 'https://flagcdn.com/w320/mu.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Mayotte', 'YT', -12.8275, 45.166244, 'https://flagcdn.com/w320/yt.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Mexique', 'MX', 23.634501, -102.552784, 'https://flagcdn.com/w320/mx.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Micronésie', 'FM', 7.425554, 150.550828, 'https://flagcdn.com/w320/fm.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Moldavie', 'MD', 47.411631, 28.369885, 'https://flagcdn.com/w320/md.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Monde', 'WLD', 20.000, 0.000, 'https://flagcdn.com/w320/wld.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Mongolie', 'MN', 46.862496, 103.846656, 'https://flagcdn.com/w320/mn.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Monténégro', 'ME', 42.708678, 19.374390, 'https://flagcdn.com/w320/me.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Montserrat', 'MS', 16.742498, -62.187366, 'https://flagcdn.com/w320/ms.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Mozambique', 'MZ', -18.665695, 35.529562, 'https://flagcdn.com/w320/mz.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Namibie', 'NA', -22.957640, 18.489149, 'https://flagcdn.com/w320/na.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Nauru', 'NR', -0.522778, 166.931503, 'https://flagcdn.com/w320/nr.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Népal', 'NP', 28.394857, 84.124008, 'https://flagcdn.com/w320/np.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Nicaragua', 'NI', 12.865416, -85.207229, 'https://flagcdn.com/w320/ni.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Niger', 'NE', 17.607789, 8.675277, 'https://flagcdn.com/w320/ne.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Nigeria', 'NG', 9.081999, 8.675277, 'https://flagcdn.com/w320/ng.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Niue', 'NU', -19.055126, -169.867233, 'https://flagcdn.com/w320/nu.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Norvège', 'NO', 60.472024, 8.468946, 'https://flagcdn.com/w320/no.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Nouvelle-Calédonie', 'NC', -20.904305, 165.618042, 'https://flagcdn.com/w320/nc.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Nouvelle-Zélande', 'NZ', -40.900557, 174.885971, 'https://flagcdn.com/w320/nz.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Oman', 'OM', 21.4735, 55.9754, 'https://flagcdn.com/w320/om.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Ouganda', 'UG', 1.373333, 32.290275, 'https://flagcdn.com/w320/ug.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Ouzbékistan', 'UZ', 41.377491, 64.585853, 'https://flagcdn.com/w320/uz.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Pakistan', 'PK', 30.375321, 69.345116, 'https://flagcdn.com/w320/pk.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Palaos', 'PW', 7.369431, 134.584716, 'https://flagcdn.com/w320/pw.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Palestine', 'PS', 31.952162, 35.233154, 'https://flagcdn.com/w320/ps.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Panama', 'PA', 8.537521, -81.383304, 'https://flagcdn.com/w320/pa.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Papouasie-Nouvelle-Guinée', 'PG', -6.315117, 143.956933, 'https://flagcdn.com/w320/pg.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Pâques', 'EA', -27.112561, -109.350250, 'https://flagcdn.com/w320/ea.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Paraguay', 'PY', -23.442503, -58.443832, 'https://flagcdn.com/w320/py.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Pays-Bas', 'NL', 52.132633, 5.291266, 'https://flagcdn.com/w320/nl.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Pérou', 'PE', -9.189967, -75.015152, 'https://flagcdn.com/w320/pe.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Philippines', 'PH', 12.879721, 121.774017, 'https://flagcdn.com/w320/ph.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Pologne', 'PL', 51.919438, 19.145136, 'https://flagcdn.com/w320/pl.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Polynésie française', 'PF', -17.679740, -149.406557, 'https://flagcdn.com/w320/pf.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Pont-Antis', 'AC', -7.939887, -14.371582, 'https://flagcdn.com/w320/ac.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Porto Rico', 'PR', 18.220833, -66.590149, 'https://flagcdn.com/w320/pr.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Portugal', 'PT', 39.399872, -8.224454, 'https://flagcdn.com/w320/pt.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Qatar', 'QA', 25.354826, 51.183884, 'https://flagcdn.com/w320/qa.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'La Réunion', 'RE', -21.135883, 55.536384, 'https://flagcdn.com/w320/re.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Roumanie', 'RO', 45.943161, 24.966675, 'https://flagcdn.com/w320/ro.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Royaume-Uni', 'GB', 55.378051, -3.435973, 'https://flagcdn.com/w320/gb.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Russie', 'RU', 61.52401, 105.318756, 'https://flagcdn.com/w320/ru.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Rwanda', 'RW', -1.940278, 29.873888, 'https://flagcdn.com/w320/rw.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Sahara occidental', 'EH', 24.215527, -12.885834, 'https://flagcdn.com/w320/eh.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Sainte-Hélène', 'SH', -15.972849, -5.71589, 'https://flagcdn.com/w320/sh.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Sainte-Lucie', 'LC', 13.909494, -60.978893, 'https://flagcdn.com/w320/lc.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Saint-Barthélemy', 'BL', 17.894865, -62.806889, 'https://flagcdn.com/w320/bl.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Saint-Marin', 'SM', 43.942159, 12.457777, 'https://flagcdn.com/w320/sm.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Saint-Martin', 'MF', 18.072553, -63.082848, 'https://flagcdn.com/w320/mf.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Saint-Pierre-et-Miquelon', 'PM', 46.837852, -56.327638, 'https://flagcdn.com/w320/pm.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Saint-Vincent-et-les-Grenadines', 'VC', 12.984305, -61.287228, 'https://flagcdn.com/w320/vc.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Samoa', 'WS', -13.759029, -172.105257, 'https://flagcdn.com/w320/ws.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Samoa américaines', 'AS', -14.271132, -170.132217, 'https://flagcdn.com/w320/as.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Samoa occidentales', 'WS', -13.759029, -172.105257, 'https://flagcdn.com/w320/ws.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Sao Tomé-et-Principe', 'ST', 0.334040, 6.733105, 'https://flagcdn.com/w320/st.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Sénégal', 'SN', 14.497401, -14.452362, 'https://flagcdn.com/w320/sn.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Serbie', 'RS', 44.016521, 21.005859, 'https://flagcdn.com/w320/rs.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Seychelles', 'SC', -4.679574, 55.492212, 'https://flagcdn.com/w320/sc.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Sierra Leone', 'SL', 8.460555, -11.779889, 'https://flagcdn.com/w320/sl.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Singapour', 'SG', 1.352083, 103.819836, 'https://flagcdn.com/w320/sg.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Sint Maarten', 'SX', 18.042399, -63.072822, 'https://flagcdn.com/w320/sx.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Slovaquie', 'SK', 48.668639, 19.699024, 'https://flagcdn.com/w320/sk.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Slovénie', 'SI', 46.151925, 14.995463, 'https://flagcdn.com/w320/si.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Somalie', 'SO', 5.152149, 46.199616, 'https://flagcdn.com/w320/so.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Soudan', 'SD', 12.862807, 30.217636, 'https://flagcdn.com/w320/sd.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Soudan du Sud', 'SS', 6.876991, 31.306978, 'https://flagcdn.com/w320/ss.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Sri Lanka', 'LK', 7.873054, 80.771797, 'https://flagcdn.com/w320/lk.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Suède', 'SE', 60.128161, 18.643501, 'https://flagcdn.com/w320/se.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Suisse', 'CH', 46.818188, 8.227512, 'https://flagcdn.com/w320/ch.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Suriname', 'SR', 3.919305, -56.027783, 'https://flagcdn.com/w320/sr.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Svalbard et Jan Mayen', 'SJ', 74.0097, 25.2139, 'https://flagcdn.com/w320/sj.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Swaziland', 'SZ', -26.522503, 31.465866, 'https://flagcdn.com/w320/sz.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Syrie', 'SY', 34.802075, 38.996815, 'https://flagcdn.com/w320/sy.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Tadjikistan', 'TJ', 38.861044, 71.276093, 'https://flagcdn.com/w320/tj.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Taïwan', 'TW', 23.69781, 120.960515, 'https://flagcdn.com/w320/tw.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Tanzanie', 'TZ', -6.369028, 34.888822, 'https://flagcdn.com/w320/tz.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Tchad', 'TD', 15.454166, 18.732207, 'https://flagcdn.com/w320/td.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Tchéquie', 'CZ', 49.817492, 15.472962, 'https://flagcdn.com/w320/cz.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Terres australes françaises', 'TF', -49.280366, 69.348557, 'https://flagcdn.com/w320/tf.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Territoire britannique de l''océan Indien', 'IO', -6.343194, 71.876519, 'https://flagcdn.com/w320/io.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Thaïlande', 'TH', 15.870032, 100.992541, 'https://flagcdn.com/w320/th.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Timor oriental', 'TL', -8.874217, 125.727539, 'https://flagcdn.com/w320/tl.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Togo', 'TG', 6.125384, 0.824782, 'https://flagcdn.com/w320/tg.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Tokelau', 'TK', -9.16992, -171.84205, 'https://flagcdn.com/w320/tk.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Tonga', 'TO', -21.178986, -175.198242, 'https://flagcdn.com/w320/to.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Trinité-et-Tobago', 'TT', 10.691803, -61.222503, 'https://flagcdn.com/w320/tt.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Tunisie', 'TN', 33.886917, 9.537499, 'https://flagcdn.com/w320/tn.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Turkménistan', 'TM', 38.969719, 59.556278, 'https://flagcdn.com/w320/tm.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Turquie', 'TR', 38.963745, 35.243322, 'https://flagcdn.com/w320/tr.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Tuvalu', 'TV', -8.517854, 179.198487, 'https://flagcdn.com/w320/tv.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Ukraine', 'UA', 48.379433, 31.165348, 'https://flagcdn.com/w320/ua.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Union des Comores', 'KM', -11.875001, 43.333336, 'https://flagcdn.com/w320/km.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Uruguay', 'UY', -32.522779, -55.765835, 'https://flagcdn.com/w320/uy.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Vanuatu', 'VU', -15.376516, 166.959158, 'https://flagcdn.com/w320/vu.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Vatican', 'VA', 41.902916, 12.453389, 'https://flagcdn.com/w320/va.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Venezuela', 'VE', 6.423750, -66.589730, 'https://flagcdn.com/w320/ve.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Viêt Nam', 'VN', 14.058804, 108.277480, 'https://flagcdn.com/w320/vn.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Wallis et Futuna', 'WF', -13.768752, -176.065032, 'https://flagcdn.com/w320/wf.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Yémen', 'YE', 15.36, 48.2156, 'https://flagcdn.com/w320/ye.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Zambie', 'ZM', -13.133897, 27.849332, 'https://flagcdn.com/w320/zm.png', true, NOW(), NOW()),
    (gen_random_uuid(), 'Zimbabwe', 'ZW', -19.015438, 29.154857, 'https://flagcdn.com/w320/zw.png', true, NOW(), NOW())
) AS new_pays(id, nom, code, latitude, longitude, flag_url, actif, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM pays WHERE code = new_pays.code);

-- =====================================================
-- 5. INSERT PRODUCTS (FLAGS FOR EACH COUNTRY)
-- =====================================================

INSERT INTO produits (id, nom, description, prix, stock, image_url, pays_id, actif, created_at, updated_at)
SELECT 
    gen_random_uuid() as id,
    'Drapeau ' || pays.nom as nom,
    'Drapeau officiel de ' || pays.nom as description,
    CASE 
        WHEN pays.nom IN ('Brésil', 'Allemagne', 'Canada', 'Australie', 'États-Unis', 'Russie', 'Chine', 'Japon', 'Royaume-Uni', 'France')
        THEN 34.99
        ELSE 29.99
    END as prix,
    CASE 
        WHEN pays.nom IN ('Brésil', 'Allemagne', 'Canada', 'Australie', 'États-Unis')
        THEN 200
        WHEN pays.nom IN ('France', 'Royaume-Uni', 'Italie', 'Espagne', 'Japon')
        THEN 150
        ELSE 100
    END as stock,
    pays.flag_url as image_url,
    pays.id as pays_id,
    true as actif,
    NOW() as created_at,
    NOW() as updated_at
FROM pays
WHERE NOT EXISTS (
    SELECT 1 FROM produits WHERE produits.pays_id = pays.id
);
