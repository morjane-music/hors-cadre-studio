import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import OfferEstimator from "@/components/sections/OfferEstimator";
import "../site.css";

export const metadata: Metadata = {
  title: "Prestations et packs",
  description:
    "Prestations à l’unité, packs Hors Cadre, maintenance et devis sur mesure. Vision assumée et livrables activables.",
};

export default function PrestationsPage() {
  return (
    <div className="site-root page-prestations">
      <Container className="site-wrap">
        <div className="site-hero site-reveal">
          <span className="site-kicker">Prestations</span>
          <h1 className="site-title">Clarté, impact, maîtrise.</h1>
          <p className="site-subtitle">
            Chaque offre a un rôle clair.
            <span className="site-subtitle-mobile-break"> Peu d&apos;options, mais les bonnes.</span>
          </p>
          <div className="site-proof-strip">
            <Link href="#offres-web" className="site-proof-pill">
              Sites web & identité
            </Link>
            <Link href="#studio-graphique" className="site-proof-pill">
              Visuels événementiels
            </Link>
          </div>
          <div className="site-cta">
            <Link href="/contact" className="site-btn site-btn-primary">
              Démarrer un projet
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-blue" data-reveal data-reveal-delay="30">
          <div className="site-section-title">Estimateur intelligent</div>
          <OfferEstimator />
        </div>

        <div className="site-section site-section-anim site-reveal accent-green" data-reveal data-reveal-delay="60">
          <div className="site-section-title">Comment on travaille</div>
          <div className="site-grid site-stagger" data-flow>
            <div className="site-card">
              <div className="site-icon">A</div>
              <div className="site-card-title">Orientation</div>
              <div className="site-list-item">On valide le périmètre, les priorités et le niveau attendu.</div>
            </div>
            <div className="site-card">
              <div className="site-icon">B</div>
              <div className="site-card-title">Exécution</div>
              <div className="site-list-item">Production structurée avec feedback court et décisions assumées.</div>
            </div>
            <div className="site-card">
              <div className="site-icon">C</div>
              <div className="site-card-title">Livraison</div>
              <div className="site-list-item">Passation structurée, fichiers propres, activation immédiate.</div>
            </div>
          </div>
          <div className="site-cta">
            <Link href="/processus" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Voir le processus Hors Cadre
            </Link>
          </div>
        </div>

        <div id="offres-web" className="site-section site-section-anim site-reveal accent-blue" data-reveal data-reveal-delay="80">
          <div className="site-section-title">Sites web & identité</div>
          <Link href="/contact?offer=Offre%20Essentiel" className="site-card site-card-link site-card-featured" data-cursor data-sound>
            <div>
              <div className="site-pill">Nouveau</div>
              <div className="site-card-title">Offre Essentiel</div>
              <div className="site-list-item">Format léger pour démarrer vite avec une base solide.</div>
            </div>
            <div className="site-pill">À partir de 1 100 €</div>
          </Link>
          <div className="site-grid site-stagger" data-flow>
            <Link href="/contact?offer=Site%20vitrine" className="site-card site-card-link" data-cursor data-sound>
              <div className="site-card-title">Site vitrine</div>
              <div className="site-list-item">Architecture, design, mise en ligne.</div>
              <div className="site-list-item">Pour poser une présence claire rapidement.</div>
              <div className="site-pill">À partir de 1 500 €</div>
            </Link>
            <Link href="/contact?offer=Identit%C3%A9%20visuelle" className="site-card site-card-link" data-cursor data-sound>
              <div className="site-card-title">Identité visuelle</div>
              <div className="site-list-item">Logo, palette, typographies, règles d&apos;usage.</div>
              <div className="site-list-item">Pour rendre votre marque reconnaissable tout de suite.</div>
              <div className="site-pill">À partir de 1 400 €</div>
            </Link>
            <Link href="/contact?offer=Direction%20artistique" className="site-card site-card-link" data-cursor data-sound>
              <div className="site-card-title">Direction artistique</div>
              <div className="site-list-item">Cap visuel, références utiles, principes créatifs.</div>
              <div className="site-list-item">Pour un projet aligné et différenciant.</div>
              <div className="site-pill">À partir de 2 200 €</div>
            </Link>
          </div>
          <p className="site-note">
            Nos tarifs sont fixes et optimisés pour la qualité et le résultat.
            <br />
            Si votre budget est plus serré mais que le projet est sérieux, contactez-nous pour une version allégée adaptée.
          </p>
          <div className="site-cta">
            <Link href="/contact" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Demander une offre à l&apos;unité
            </Link>
          </div>
        </div>

        <div id="studio-graphique" className="site-section site-section-anim site-reveal accent-sand" data-reveal data-reveal-delay="90">
          <div className="site-section-title">Visuels événementiels</div>
          <div className="site-grid site-stagger" data-flow>
            <Link href="/contact?offer=Visuel%20Essentiel" className="site-card site-card-link" data-cursor data-sound>
              <div className="site-card-title">Visuel Essentiel</div>
              <div className="site-list-item">Format compact pour annonces ponctuelles, événements locaux et sorties rapides.</div>
              <div className="site-list-item">1 concept visuel structuré, 1 session d&apos;ajustement, export print ou digital.</div>
              <div className="site-list-item">Livraison prête à diffuser.</div>
              <div className="site-pill">120 €</div>
            </Link>
            <Link href="/contact?offer=Visuel%20Plus" className="site-card site-card-link" data-cursor data-sound>
              <div className="site-card-title">Visuel Plus</div>
              <div className="site-list-item">Pour sorties musicales et communications plus travaillées.</div>
              <div className="site-list-item">2 propositions créatives, 2 sessions d&apos;ajustement.</div>
              <div className="site-list-item">Version print + digital, formats principaux optimisés.</div>
              <div className="site-pill">180 €</div>
            </Link>
            <Link href="/contact?offer=Pack%20%C3%89v%C3%A9nement" className="site-card site-card-link" data-cursor data-sound>
              <div className="site-card-title">Pack Événement</div>
              <div className="site-list-item">Pour concerts, lancements et diffusion multi-plateformes.</div>
              <div className="site-list-item">Affiche principale + déclinaisons réseaux (carré, story, bannière).</div>
              <div className="site-list-item">Harmonisation globale et ajustements inclus.</div>
              <div className="site-pill">350 €</div>
            </Link>
          </div>
          <p className="site-note">
            Les formats sont structurés pour garantir efficacité et qualité.
            <br />
            Pour des demandes complexes ou multi-supports spécifiques, un devis personnalisé peut être proposé.
          </p>
        </div>

        <div className="site-section site-section-anim site-reveal accent-graphite" data-reveal data-reveal-delay="100">
          <div className="site-section-title">Packs Hors Cadre</div>
          <div className="site-grid site-stagger" data-flow>
            <div className="site-card">
              <div className="site-icon">P1</div>
              <div className="site-card-title">Pack Lancement</div>
              <div className="site-list-item">Site vitrine 1 page + structure de contenu.</div>
              <div className="site-list-item">Direction visuelle de base pour lancer vite.</div>
              <div className="site-pill">À partir de 1 900 €</div>
            </div>
            <div className="site-card">
              <div className="site-icon">P2</div>
              <div className="site-card-title">Pack Signature</div>
              <div className="site-list-item">Site vitrine + identité visuelle complète.</div>
              <div className="site-list-item">Système de marque cohérent et activable.</div>
              <div className="site-pill">À partir de 2 900 €</div>
            </div>
            <div className="site-card">
              <div className="site-icon">P3</div>
              <div className="site-card-title">Pack Hors Cadre</div>
              <div className="site-list-item">Direction artistique + site + assets prioritaires.</div>
              <div className="site-list-item">Direction renforcée pour sortie de projet premium.</div>
              <div className="site-pill">À partir de 4 200 €</div>
            </div>
          </div>
          <p className="site-note">
            Nos tarifs sont fixes et optimisés pour la qualité et le résultat.
            <br />
            Si votre budget est plus serré mais que le projet est sérieux, contactez-nous pour une version allégée adaptée.
          </p>
          <div className="site-cta">
            <Link href="/contact" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Demander un pack
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-sand" data-reveal data-reveal-delay="140">
          <div className="site-section-title">Kap Numérik (Région Réunion)</div>
          <div className="site-grid">
            <div className="site-card">
              <div className="site-card-title">Situation actuelle</div>
              <div className="site-list-item">Le dispositif est en cours de recréation : pas d&apos;aide active à ce jour.</div>
              <div className="site-list-item">Nous suivons les mises à jour officielles de la Région Réunion.</div>
              <div className="site-list-item">Dès réouverture, nous préparons un devis compatible dossier.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Préparer en avance</div>
              <div className="site-list-item">Définir vos objectifs digitaux (site, identité, contenus).</div>
              <div className="site-list-item">Préparer votre périmètre et vos livrables prioritaires.</div>
              <div className="site-list-item">Constituer les éléments utiles pour déposer rapidement.</div>
            </div>
          </div>
          <div className="site-cta">
            <Link href="/contact" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Préparer mon dossier Kap Numérik
            </Link>
          </div>
          <p className="site-note">
            Source officielle :{" "}
            <a href="https://regionreunion.com/aides-services/article/le-kap-numerik-programme-europeen-feder-2021-2027" target="_blank" rel="noreferrer">
              Région Réunion · Kap Numérik
            </a>
          </p>
        </div>

        <div className="site-section site-section-anim site-reveal accent-green" data-reveal data-reveal-delay="180">
          <div className="site-section-title">Suivi et maintenance</div>
          <div className="site-grid">
            <Link href="/contact?offer=Maintenance%20Essentielle" className="site-card site-card-link" data-cursor data-sound>
              <div className="site-card-title">Maintenance Essentielle</div>
              <div className="site-list-item">Mises à jour techniques et monitoring sécurité.</div>
              <div className="site-list-item">Sauvegardes et contrôle de stabilité.</div>
              <div className="site-list-item">Suivi mensuel léger.</div>
              <div className="site-pill">90 € / mois</div>
            </Link>
            <Link href="/contact?offer=Maintenance%20Premium" className="site-card site-card-link" data-cursor data-sound>
              <div className="site-card-title">Maintenance Premium</div>
              <div className="site-list-item">Tout l&apos;Essentielle + support prioritaire.</div>
              <div className="site-list-item">1 h de modifications incluse chaque mois.</div>
              <div className="site-list-item">Conseils de pilotage et optimisation continue.</div>
              <div className="site-pill">150 € / mois</div>
            </Link>
          </div>
          <div className="site-cta">
            <Link href="/contact" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
              Activer une maintenance
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-sand" data-reveal data-reveal-delay="220">
          <div className="site-section-title">Devis sur mesure</div>
          <div className="site-card">
            <div className="site-list-item">Besoin spécifique ou périmètre large : on aligne ensemble.</div>
            <div className="site-list-item">Proposition claire, rapide, sans zone floue.</div>
            <div className="site-cta">
              <Link href="/contact" className="site-btn site-btn-primary" data-magnetic data-cursor data-sound>
                Demander un devis
              </Link>
            </div>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-blue" data-reveal data-reveal-delay="240">
          <div className="site-section-title">FAQ</div>
          <div className="site-grid">
            <div className="site-card">
              <div className="site-card-title">Quel acompte est demandé ?</div>
              <div className="site-list-item">
                Par défaut, l&apos;acompte est de 40 % puis le solde de 60 % à la livraison.
              </div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Et pour un projet sur mesure ?</div>
              <div className="site-list-item">
                Le montant est défini au cas par cas, puis un lien de paiement personnalisé est envoyé.
              </div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Puis-je commencer avec un budget serré ?</div>
              <div className="site-list-item">
                Oui. Si le projet est sérieux, nous proposons une version allégée avec périmètre clair.
              </div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Quels sont les délais moyens ?</div>
              <div className="site-list-item">
                À l’unité : généralement 2 à 4 semaines. Pack : 4 à 8 semaines selon le périmètre validé.
              </div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Combien de retours sont inclus ?</div>
              <div className="site-list-item">
                Des itérations courtes sont prévues à chaque étape clé pour valider sans rallonger le rythme.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

