import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, SUICIDE_SQUAD_CATEGORIES } from "@/lib/data/suicideSquadCategories";
import CategoryLandingClient from "./CategoryLandingClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categoría no encontrada | ATOMIC Ecuador",
      description: "Explora el catálogo de productos y soluciones tecnológicas de ATOMIC Solutions."
    };
  }

  return {
    title: `${category.name} | Catálogo & Precios Oficiales ATOMIC 🇪🇨`,
    description: `${category.heroHeadline}. ${category.heroPitch} Precios oficiales en USD con factura electrónica SRI y garantía de 1 año.`,
    openGraph: {
      title: `${category.name} | ATOMIC Solutions Ecuador`,
      description: category.subtitle,
      images: [
        {
          url: category.featuredProducts[0]?.imageUrl || "/icon-192.png",
          width: 600,
          height: 600,
          alt: category.name
        }
      ]
    }
  };
}

export default async function CategoryLandingPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return <CategoryLandingClient category={category} />;
}
