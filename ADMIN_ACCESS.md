# Administration Bitcoin Bénin

## Accès Administrateur

### 🔐 Identifiants

**Email :** `benedoffice@gmail.com`
**Mot de passe :** `21000000`

### 🔐 Routes d'administration

**Page de connexion :**
- `/login` - Connexion sécurisée des administrateurs

**Pages admin protégées :**
- `/admin/gallery` - Gestion complète des albums et photos
- `/admin/events` - Gestion des événements (à créer)

### 🚀 Flux d'accès

1. **Se connecter** → `votresite.com/login`
2. **Saisir les identifiants** ci-dessus
3. **Accéder admin** → Redirection automatique vers `/admin/gallery`
4. **Gérer** → Gallery et événements depuis leurs interfaces dédiées

### 🔒 Sécurité

- **Middleware** protège toutes les routes `/admin/*`
- **Session Supabase** obligatoire pour l'accès
- **Redirection auto** vers `/login` si non connecté
- **Déconnexion** disponible dans chaque interface admin

### 📝 Configuration requise

1. Configurer les variables Supabase dans `.env.local`
2. Exécuter le script SQL complet
3. Utiliser les identifiants ci-dessus pour se connecter
4. Gérer gallery et événements depuis les interfaces dédiées

---

**Note :** L'accès administrateur est réservé à l'équipe de Bitcoin Bénin pour la gestion du contenu du site. Ne partagez pas ces identifiants.
