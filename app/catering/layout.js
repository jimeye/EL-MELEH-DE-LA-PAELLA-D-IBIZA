export const metadata = {
  title: 'Catering Kosher à Ibiza – EL MELEH DE LA PAELLA 👑 – Service Traiteur Cacher',
  description: 'Service de catering kosher à Ibiza par EL MELEH DE LA PAELLA 👑. Formules traiteur pour événements, mariages, bar-mitsva, anniversaires. Cuisine judéo-tunisienne authentique. Livraison sur toute l\'île.',
  keywords: 'catering kosher ibiza, traiteur cacher ibiza, service traiteur kosher friendly, événements juifs ibiza, mariage kosher ibiza, bar-mitsva ibiza, cuisine judéo-tunisienne, la boulette ibiza catering, livraison traiteur ibiza, formules événements kosher',
  openGraph: {
    title: 'Catering Kosher à Ibiza – EL MELEH DE LA PAELLA 👑',
    description: 'Service de catering kosher à Ibiza par EL MELEH DE LA PAELLA 👑. Formules traiteur pour événements, mariages, bar-mitsva, anniversaires. Cuisine judéo-tunisienne authentique.',
    url: 'https://el-meleh-de-la-paella-ibiza.com/catering',
    type: 'website',
    images: [
      {
        url: 'https://el-meleh-de-la-paella-ibiza.com/images/uneexperienceuniqueW.webp',
        width: 1200,
        height: 630,
        alt: 'Catering Kosher EL MELEH DE LA PAELLA 👑',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catering Kosher à Ibiza – EL MELEH DE LA PAELLA 👑',
    description: 'Service de catering kosher à Ibiza par EL MELEH DE LA PAELLA 👑. Formules traiteur pour événements, mariages, bar-mitsva, anniversaires.',
    images: ['https://el-meleh-de-la-paella-ibiza.com/images/uneexperienceuniqueW.webp'],
  },
  alternates: {
    canonical: 'https://el-meleh-de-la-paella-ibiza.com/catering',
  },
};

export default function CateringLayout({ children }) {
  return children;
}
