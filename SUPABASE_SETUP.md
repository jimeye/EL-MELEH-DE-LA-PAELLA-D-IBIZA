# 🚀 Configuration Supabase pour La Boulette Ibiza

## 📋 Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Notez votre URL et clé anonyme

### 2. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
```

### 3. Créer les tables dans Supabase

#### Table `plats`
```sql
CREATE TABLE plats (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  prix DECIMAL(10,2) NOT NULL,
  categorie VARCHAR(50) DEFAULT 'plat_principal',
  disponible BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Table `images`
```sql
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  path VARCHAR(255) NOT NULL,
  size BIGINT,
  type VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Table `commandes`
```sql
CREATE TABLE commandes (
  id SERIAL PRIMARY KEY,
  numero_commande VARCHAR(50) UNIQUE NOT NULL,
  nom_client VARCHAR(255) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  adresse TEXT,
  plats JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  statut VARCHAR(50) DEFAULT 'en_attente',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Table `reservations`
```sql
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telephone VARCHAR(20) NOT NULL,
  date_reservation DATE NOT NULL,
  heure_reservation TIME NOT NULL,
  nombre_personnes INTEGER NOT NULL,
  statut VARCHAR(50) DEFAULT 'en_attente',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Configuration du Storage

1. Dans votre projet Supabase, allez dans "Storage"
2. Créez un nouveau bucket appelé `site-images`
3. Configurez les politiques RLS (Row Level Security) :

```sql
-- Politique pour permettre l'upload d'images
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'site-images');

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public viewing" ON storage.objects
FOR SELECT USING (bucket_id = 'site-images');

-- Politique pour permettre la suppression
CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'site-images');
```

### 5. Créer un utilisateur admin

Dans l'interface Supabase, allez dans "Authentication" > "Users" et créez un utilisateur admin :

```sql
-- Insérer un utilisateur admin (optionnel)
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  'admin@el-meleh-de-la-paella-ibiza.com',
  crypt('votre_mot_de_passe', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
```

## 🔐 Sécurité

### Politiques RLS pour les tables

```sql
-- Politiques pour la table plats
ALTER TABLE plats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON plats
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON plats
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON plats
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON plats
FOR DELETE USING (auth.role() = 'authenticated');

-- Politiques pour la table images
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON images
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON images
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON images
FOR DELETE USING (auth.role() = 'authenticated');

-- Politiques pour la table commandes
ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON commandes
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON commandes
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON commandes
FOR UPDATE USING (auth.role() = 'authenticated');

-- Politiques pour la table reservations
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON reservations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON reservations
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON reservations
FOR UPDATE USING (auth.role() = 'authenticated');
```

## 🎯 Fonctionnalités disponibles

### Interface d'administration (`/admin`)

1. **Gestion des plats** (`/admin/plats`)
   - ✅ Ajouter/modifier/supprimer des plats
   - ✅ Catégoriser les plats
   - ✅ Gérer la disponibilité
   - ✅ Ajouter des images

2. **Gestion des images** (`/admin/images`)
   - ✅ Upload d'images
   - ✅ Visualisation en grille
   - ✅ Copie d'URL
   - ✅ Suppression

3. **Gestion des commandes** (`/admin/commandes`)
   - ✅ Voir toutes les commandes
   - ✅ Changer le statut
   - ✅ Détails complets

4. **Gestion des réservations** (`/admin/reservations`)
   - ✅ Calendrier des réservations
   - ✅ Confirmation/annulation
   - ✅ Gestion des statuts

## 🚀 Déploiement

### Variables d'environnement pour la production

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
```

### Déploiement sur Vercel

1. Connectez votre repository GitHub à Vercel
2. Ajoutez les variables d'environnement dans Vercel
3. Déployez !

## 📱 Utilisation

### Connexion admin
- URL : `votre-site.com/admin`
- Email : `admin@el-meleh-de-la-paella-ibiza.com`
- Mot de passe : celui configuré dans Supabase

### Fonctionnalités principales
- **Interface intuitive** : Drag & drop, formulaires simples
- **Gestion des médias** : Upload direct, optimisation automatique
- **Gestion des commandes** : Statuts en temps réel
- **Sécurité** : Authentification, autorisations granulaires

## 💡 Conseils

1. **Sauvegardes** : Configurez des sauvegardes automatiques dans Supabase
2. **Monitoring** : Utilisez les logs Supabase pour surveiller l'activité
3. **Performance** : Optimisez les images avant upload
4. **Sécurité** : Changez régulièrement les mots de passe

## 🆘 Support

En cas de problème :
1. Vérifiez les logs dans la console Supabase
2. Contrôlez les variables d'environnement
3. Vérifiez les politiques RLS
4. Testez les permissions utilisateur 