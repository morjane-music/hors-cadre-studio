import Link from "next/link";
import Container from "@/components/layout/Container";
import "../../site.css";

type Props = {
  params: { slug: string };
};

export default function PrestationPage({ params }: Props) {
  return (
    <div className="site-root">
      <Container className="site-wrap">
        <div className="site-hero site-reveal">
          <span className="site-kicker">Prestation</span>
          <h1 className="site-title">{params.slug.replace(/-/g, " ")}</h1>
          <p className="site-subtitle">
            Détails précis partagés après un premier échange d&apos;orientation.
          </p>
          <div className="site-cta">
            <Link href="/contact" className="site-btn site-btn-primary">
              Démarrer un projet
            </Link>
            <Link href="/prestations" className="site-btn site-btn-ghost">
              Retour aux prestations
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
