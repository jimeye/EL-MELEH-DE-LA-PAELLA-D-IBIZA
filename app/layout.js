import { Lilita_One } from 'next/font/google';
import './globals.css';
import Navigation from './components/Navigation';
import CustomChat from './components/CustomChat';
import GoogleAnalytics from './components/GoogleAnalytics';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

const lilitaOne = Lilita_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-lilita',
});

export const metadata = {
  title: 'Restaurant Cacher à Ibiza – EL MELEH DE LA PAELLA 👑 – Cuisine Judéo-Tunisienne',
  description: 'Découvrez EL MELEH DE LA PAELLA 👑, restaurant cacher à Ibiza. Sandwichs Mékbouba, tajines, couscous, box à emporter ou en livraison. Précommande en ligne !',
  keywords: 'la boulette ibiza, kosher ibiza, cacher ibiza, kosher friendly ibiza, restaurant kosher friendly, cuisine juive ibiza, boulettes tunisiennes, piments, judéo-tunisien, livraison kosher friendly, bovini, shabbat, chabbat, catering, chef à domicile, habad, loubavitch',
};
 
export default function RootLayout({ children }) {
 return (
    <html lang="fr">
      <head>
        <title>Restaurant Cacher à Ibiza – EL MELEH DE LA PAELLA 👑 – Cuisine Judéo-Tunisienne</title>
        <meta name="description" content="Découvrez EL MELEH DE LA PAELLA 👑, restaurant cacher à Ibiza. Sandwichs Mékbouba, tajines, couscous, box à emporter ou en livraison. Précommande en ligne !" />
        <meta property="og:title" content="EL MELEH DE LA PAELLA 👑 Cacher, Kosher Friendly à Ibiza" />
        <meta property="og:description" content="Découvrez EL MELEH DE LA PAELLA 👑, restaurant cacher à Ibiza. Sandwichs Mékbouba, tajines, couscous, box à emporter ou en livraison. Précommande en ligne !" />
        <link rel="canonical" href="https://el-meleh-de-la-paella-ibiza.com/" />
        <meta property="og:url" content="https://el-meleh-de-la-paella-ibiza.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://el-meleh-de-la-paella-ibiza.com/images/uneexperienceuniqueW1.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://el-meleh-de-la-paella-ibiza.com/images/uneexperienceuniqueW1.webp" />
        
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-K5JNTRVK');
            `,
          }}
        />
      </head>
      <body className={`font-sans ${lilitaOne.variable}`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K5JNTRVK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        <Navigation />
        {children}
        <CustomChat />
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
