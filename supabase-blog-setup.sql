-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_image VARCHAR(500),
  cover_image VARCHAR(500),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  views INTEGER DEFAULT 0
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- RLS Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Everyone can read published posts
CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Authenticated users can read all posts (for admin)
CREATE POLICY "Authenticated users can read all posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert posts
CREATE POLICY "Authenticated users can insert posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update posts
CREATE POLICY "Authenticated users can update posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated users can delete posts
CREATE POLICY "Authenticated users can delete posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- Sample data (optional - remove in production if not needed)
INSERT INTO blog_posts (title, slug, excerpt, content, author_name, author_image, cover_image, status, tags, published_at) VALUES
(
  'Comprendre Bitcoin : Guide pour les débutants au Bénin',
  'comprendre-bitcoin-guide-debutants-benin',
  'Découvrez les bases de Bitcoin et comment commencer à utiliser la première cryptomonnaie mondiale au Bénin.',
  '
# Comprendre Bitcoin : Guide pour les débutants au Bénin

Bitcoin est une monnaie numérique décentralisée qui fonctionne sans banque centrale ni administrateur unique. 

## Qu''est-ce que Bitcoin ?

Bitcoin a été créé en 2009 par une personne (ou un groupe) utilisant le pseudonyme Satoshi Nakamoto. C''est la première cryptomonnaie au monde.

## Comment acheter du Bitcoin au Bénin ?

Plusieurs plateformes permettent d''acheter du Bitcoin au Bénin :
- Izichange
- Paxful
- Binance P2P

## Comment stocker vos Bitcoin ?

Il existe plusieurs options :
1. **Portefeuilles mobiles** : BlueWallet, Muun
2. **Portefeuilles matériels** : Trezor, Ledger
3. **Portefeuilles web** : Bitcoin Beach Wallet

## Pourquoi Bitcoin ?

- Protection contre l''inflation
- Transferts internationaux rapides et peu coûteux
- Inclusion financière
- Liberté monétaire

## Conclusion

Bitcoin représente une opportunité unique pour les Béninois de participer à l''économie numérique mondiale. Commencez petit, apprenez continuellement, et soyez prudent.
  ',
  'Bitcoin Bénin',
  '/logo.svg',
  '/hero.png',
  'published',
  ARRAY['débutant', 'éducation', 'bitcoin'],
  NOW()
),
(
  'Comment accepter Bitcoin dans votre commerce au Bénin',
  'accepter-bitcoin-commerce-benin',
  'Guide pratique pour les commerçants béninois souhaitant accepter Bitcoin comme moyen de paiement.',
  '
# Comment accepter Bitcoin dans votre commerce au Bénin

Accepter Bitcoin dans votre commerce est devenu plus simple que jamais. Voici un guide étape par étape.

## Pourquoi accepter Bitcoin ?

- **Frais réduits** : Pas de frais de transaction bancaire
- **Paiements internationaux** : Acceptez les paiements de clients du monde entier
- **Pas de rétrofacturation** : Les transactions Bitcoin sont irréversibles
- **Innovation** : Positionnez votre commerce comme innovant

## Étape 1 : Créer un portefeuille Bitcoin

Téléchargez une application comme :
- BlueWallet (recommandé pour les débutants)
- Muun
- Bitcoin Beach Wallet

## Étape 2 : Générer un QR code de paiement

La plupart des portefeuelles permettent de générer un QR code pour recevoir des paiements.

## Étape 3 : Afficher que vous acceptez Bitcoin

- Mettez un autocollant "Bitcoin accepté ici"
- Informez vos clients
- Formez votre personnel

## Étape 4 : Gérer la volatilité

Vous pouvez :
- Conserver les Bitcoin reçus
- Convertir immédiatement en FCFA via Izichange

## Conclusion

Accepter Bitcoin est simple et peut attirer une nouvelle clientèle. Bitcoin Bénin vous accompagne dans cette démarche.
  ',
  'Bitcoin Bénin',
  '/logo.svg',
  '/accepte.png',
  'published',
  ARRAY['commerce', 'paiement', 'guide'],
  NOW() - INTERVAL '7 days'
),
(
  'Les événements Bitcoin Bénin à ne pas manquer en 2025',
  'evenements-bitcoin-benin-2025',
  'Découvrez tous les événements et rencontres de la communauté Bitcoin Bénin pour cette année.',
  '
# Les événements Bitcoin Bénin à ne pas manquer en 2025

La communauté Bitcoin Bénin organise régulièrement des événements pour promouvoir l''adoption de Bitcoin.

## Événements mensuels

Chaque premier mercredi du mois, rejoignez-nous pour :
- Des présentations éducatives
- Des sessions de questions-réponses
- Du networking avec la communauté

## Bitcoin School

Notre programme de formation continue propose :
- Des cours pour débutants
- Des ateliers techniques avancés
- Des sessions pratiques

## Conférences internationales

La communauté représente le Bénin lors des grandes conférences Bitcoin internationales.

## Comment participer ?

1. Rejoignez notre groupe Telegram
2. Suivez-nous sur les réseaux sociaux
3. Inscrivez-vous à nos événements

## Devenez sponsor

Vous souhaitez sponsoriser un événement ? Contactez-nous !

## Conclusion

La communauté Bitcoin Bénin est active et grandissante. Rejoignez-nous !
  ',
  'Bitcoin Bénin',
  '/logo.svg',
  '/communaute.jpg',
  'published',
  ARRAY['événement', 'communauté', '2025'],
  NOW() - INTERVAL '14 days'
);
