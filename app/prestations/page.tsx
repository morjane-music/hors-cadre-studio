import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import OfferEstimator from "@/components/sections/OfferEstimator";
import "../site.css";

export const metadata: Metadata = {
  title: "Prestations et tarifs",
  description:
    "Tarifs Hors Cadre Studio pour visuels numériques, identité, sites web, packs créatifs et maintenance à La Réunion.",
};

const digitalOffers = [
  {
    title: "Visuel Flash",
    price: "50 €",
    href: "/contact?offer=Visuel%20Flash",
    lines: ["1 visuel simple pour diffusion digitale.", "Format unique : post, story, annonce ou flyer numérique.", "Ajustement léger inclus."],
  },
  {
    title: "Visuel Essentiel",
    price: "80 €",
    href: "/contact?offer=Visuel%20Essentiel",
    lines: ["1 concept propre et lisible.", "1 ajustement inclus.", "Export web/réseaux sociaux prêt à publier."],
  },
  {
    title: "Visuel Plus",
    price: "130 €",
    href: "/contact?offer=Visuel%20Plus",
    lines: ["Direction plus travaillée.", "2 ajustements inclus.", "2 à 3 formats digitaux."],
  },
  {
    title: "Pack Événement Digital",
    price: "250 €",
    href: "/contact?offer=Pack%20%C3%89v%C3%A9nement%20Digital",
    lines: ["Visuel principal + déclinaisons numériques.", "Carré, story, bannière ou cover.", "Cohérence visuelle globale."],
  },
];

const identityOffers = [
  {
    title: "Mini identité",
    price: "490 €",
    href: "/contact?offer=Mini%20identit%C3%A9",
    lines: ["Logo simple ou marque typographique.", "Palette, typographies, mini guide.", "Pour lancer proprement sans charte lourde."],
  },
  {
    title: "Identité complète",
    price: "950 €",
    href: "/contact?offer=Identit%C3%A9%20compl%C3%A8te",
    lines: ["Logo, système graphique, couleurs et typos.", "Déclinaisons principales.", "Charte courte et exploitable."],
  },
  {
    title: "Identité signature",
    price: "1 400 €+",
    href: "/contact?offer=Identit%C3%A9%20signature",
    lines: ["Direction visuelle renforcée.", "Système de marque plus distinctif.", "Pour projets qui doivent marquer."],
  },
];

const siteOffers = [
  {
    title: "One-page Essentiel",
    price: "850 €",
    href: "/contact?offer=One-page%20Essentiel",
    lines: ["Une page claire et responsive.", "Structure, design, intégration et mise en ligne.", "Idéal artiste, indépendant, événement ou offre unique."],
  },
  {
    title: "Site vitrine simple",
    price: "1 200 €",
    href: "/contact?offer=Site%20vitrine%20simple",
    lines: ["Présence web courte et professionnelle.", "Pages essentielles, SEO de base, responsive.", "Pour clarifier votre activité rapidement."],
  },
  {
    title: "Site vitrine signature",
    price: "1 600-1 900 €",
    href: "/contact?offer=Site%20vitrine%20signature",
    lines: ["Direction visuelle plus marquée.", "Structure persuasive, contenus mieux hiérarchisés.", "Prix selon pages, effets, contenus et intégrations."],
  },
  {
    title: "Site sur mesure",
    price: "2 400 €+",
    href: "/contact?offer=Site%20sur%20mesure",
    lines: ["Périmètre spécifique ou fonctionnalités particulières.", "Parcours, intégrations ou sections avancées.", "Devis cadré après brief."],
  },
];

const packs = [
  {
    title: "Pack Lancement",
    price: "1 500 €",
    href: "/contact?offer=Pack%20Lancement",
    lines: ["One-page ou mini-site.", "Base visuelle cohérente.", "Assets prioritaires pour sortir proprement."],
  },
  {
    title: "Pack Signature",
    price: "2 400 €",
    href: "/contact?offer=Pack%20Signature",
    lines: ["Site vitrine + identité complète.", "Direction globale et système activable.", "Pour poser une image solide."],
  },
  {
    title: "Pack Hors Cadre",
    price: "3 500 €+",
    href: "/contact?offer=Pack%20Hors%20Cadre",
    lines: ["Direction artistique complète.", "Site, identité et assets de lancement.", "Pour projets culturels, artistes ou marques plus ambitieuses."],
  },
];

function OfferCard({ offer }: { offer: { title: string; price: string; href: string; lines: string[] } }) {
  return (
    <Link href={offer.href} className="site-card site-card-link" data-cursor data-sound>
      <div className="site-card-title">{offer.title}</div>
      {offer.lines.map((line) => (
        <div key={line} className="site-list-item">{line}</div>
      ))}
      <div className="site-pill">{offer.price}</div>
    </Link>
  );
}

export default function PrestationsPage() {
  return (
    <div className="site-root page-prestations">
      <Container className="site-wrap">
        <div className="site-hero site-reveal">
          <span className="site-kicker">Prestations</span>
          <h1 className="site-title">Des formats accessibles. Une direction qui tient.</h1>
          <p className="site-subtitle">
            Petit besoin : visuel numérique. Présence web : one-page ou site vitrine. Projet sérieux : pack.
          </p>
          <div className="site-proof-strip">
            <Link href="#visuels-numeriques" className="site-proof-pill">Visuels numériques</Link>
            <Link href="#sites" className="site-proof-pill">Sites web</Link>
            <Link href="#packs" className="site-proof-pill">Packs</Link>
          </div>
          <div className="site-cta">
            <Link href="/contact" className="site-btn site-btn-primary">Demander un devis</Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-blue" data-reveal data-reveal-delay="30">
          <div className="site-section-title">Estimateur rapide</div>
          <OfferEstimator />
        </div>

        <div id="visuels-numeriques" className="site-section site-section-anim site-reveal accent-sand" data-reveal data-reveal-delay="60">
          <div className="site-section-title">Visuels numériques</div>
          <p className="site-note">Diffusion digitale uniquement. Pas de fichiers imprimeur inclus.</p>
          <div className="site-grid site-stagger" data-flow>
            {digitalOffers.map((offer) => <OfferCard key={offer.title} offer={offer} />)}
          </div>
          <p className="site-note">
            Les fichiers print, formats imprimeur, préparation BAT et déclinaisons papier font l’objet d’un devis séparé.
          </p>
        </div>

        <div id="identite" className="site-section site-section-anim site-reveal accent-green" data-reveal data-reveal-delay="90">
          <div className="site-section-title">Identité visuelle</div>
          <div className="site-grid site-stagger" data-flow>
            {identityOffers.map((offer) => <OfferCard key={offer.title} offer={offer} />)}
          </div>
        </div>

        <div id="sites" className="site-section site-section-anim site-reveal accent-blue" data-reveal data-reveal-delay="120">
          <div className="site-section-title">Sites web</div>
          <div className="site-grid site-stagger" data-flow>
            {siteOffers.map((offer) => <OfferCard key={offer.title} offer={offer} />)}
          </div>
        </div>

        <div id="packs" className="site-section site-section-anim site-reveal accent-graphite" data-reveal data-reveal-delay="150">
          <div className="site-section-title">Packs Hors Cadre</div>
          <div className="site-grid site-stagger" data-flow>
            {packs.map((offer) => <OfferCard key={offer.title} offer={offer} />)}
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-green" data-reveal data-reveal-delay="180">
          <div className="site-section-title">Maintenance</div>
          <div className="site-grid">
            <Link href="/contact?offer=Maintenance%20Essentielle" className="site-card site-card-link" data-cursor data-sound>
              <div className="site-card-title">Maintenance Essentielle</div>
              <div className="site-list-item">Mises à jour, surveillance technique et petites corrections.</div>
              <div className="site-pill">70 € / mois</div>
            </Link>
            <Link href="/contact?offer=Maintenance%20Premium" className="site-card site-card-link" data-cursor data-sound>
              <div className="site-card-title">Maintenance Premium</div>
              <div className="site-list-item">Tout l’Essentielle + support prioritaire et ajustements récurrents.</div>
              <div className="site-pill">140 € / mois</div>
            </Link>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-sand" data-reveal data-reveal-delay="210">
          <div className="site-section-title">Pour qui ?</div>
          <div className="site-grid">
            <div className="site-card">
              <div className="site-card-title">Adapté</div>
              <div className="site-list-item">Artistes, indépendants, événements, lieux, associations et petites marques locales.</div>
              <div className="site-list-item">Projets qui veulent une image claire, publiable et mémorable.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Sur devis dédié</div>
              <div className="site-list-item">E-commerce lourd, print complexe, campagnes média, gros volume de contenus ou fonctionnalités avancées.</div>
              <div className="site-list-item">Dans ce cas, on cadre un périmètre spécifique avant de chiffrer.</div>
            </div>
          </div>
        </div>

        <div className="site-section site-section-anim site-reveal accent-blue" data-reveal data-reveal-delay="240">
          <div className="site-section-title">FAQ</div>
          <div className="site-grid">
            <div className="site-card">
              <div className="site-card-title">Pourquoi les visuels sont accessibles ?</div>
              <div className="site-list-item">Parce qu’ils sont numériques, cadrés et limités en périmètre. La valeur reste dans la direction, la lisibilité et la finition.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Quel acompte est demandé ?</div>
              <div className="site-list-item">Par défaut, 40 % au lancement puis 60 % à la livraison pour les projets web, identité et packs.</div>
            </div>
            <div className="site-card">
              <div className="site-card-title">Peut-on adapter un prix ?</div>
              <div className="site-list-item">Oui, on ajuste surtout le périmètre : moins de pages, moins de formats, moins d’itérations, mais un cadre clair.</div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
