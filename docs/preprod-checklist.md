# Pré-prod Checklist

## 1) Produit
- Vérifier toutes les pages publiques : `/`, `/prestations`, `/projets`, `/processus`, `/a-propos`, `/contact`, `/merci`.
- Vérifier l’admin : `/admin`, `/admin/ux`, login/logout, actions demandes.
- Vérifier qu’il n’y a pas de texte cassé (accents, apostrophes, labels CTA).
- Vérifier qu’il n’y a qu’un CTA principal par section.

## 2) Accessibilité
- Tester navigation clavier : `Tab`, `Shift+Tab`, `Enter`, `Esc`.
- Vérifier le lien “Aller au contenu principal”.
- Vérifier les options accessibilité (contraste, texte large, réduction animation, soulignement liens).
- Vérifier contraste AA des textes secondaires.

## 3) Consentement & RGPD
- Vérifier bannière cookies au premier chargement.
- Vérifier refus consentement : aucun événement UX ne doit partir.
- Vérifier acceptation consentement : événements UX enregistrés.
- Vérifier pages légales : `/mentions-legales`, `/politique-confidentialite`, `/accessibilite`.

## 4) SEO
- Vérifier métadonnées de chaque page (title + description).
- Vérifier `https://horscadrestudio.re/sitemap.xml`.
- Vérifier `https://horscadrestudio.re/robots.txt`.
- Vérifier OpenGraph (aperçu partage).

## 5) Stripe
- Vérifier variables prod :
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- Vérifier endpoint webhook prod : `https://horscadrestudio.re/api/stripe/webhook`.
- Événement obligatoire : `checkout.session.completed`.
- Vérifier parcours acompte -> solde.
- Vérifier lien de paiement personnalisé depuis admin.

## 6) Supabase
- Vérifier tables : `requests`, `admins`, `ux_events`.
- Vérifier RLS activée sur `ux_events`.
- Vérifier compte admin dans `admins`.
- Vérifier clés Netlify :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

## 7) Déploiement Netlify (GitHub)
- Build command : `npm run build`.
- Publish dir : `.next`.
- Variables d’environnement configurées (public + server).
- Domaine custom `horscadrestudio.re` attaché et HTTPS actif.

## 8) Domaine OVH
- Type recommandé : `A`/`ALIAS` selon consigne Netlify DNS.
- Vérifier propagation DNS (TTL + résolution publique).
- Vérifier redirection `www` -> root (ou inverse) cohérente.
- Vérifier certificat SSL actif sur les deux hôtes.

## 9) Validation finale
- `npm run lint`
- `npm run build`
- Smoke test desktop + mobile.
- Test formulaire contact réel.
- Test admin en session neuve.
