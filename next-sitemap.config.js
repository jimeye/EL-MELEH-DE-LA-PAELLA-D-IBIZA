module.exports = {
  siteUrl: 'https://el-meleh-de-la-paella-ibiza.com',
  generateRobotsTxt: true,
  exclude: [
    '/admin*',
    '/admin-mekbouba*',
    '/backup*',
    '/api/*',
    '/commandes',
    '/commandes/page-ticket-backup',
    '/commandes/page-ticket-backup.js',
    '/page-old',
    '/page2',
    '/page2 2',
    '/page2.js',
    '/newsletter',
    '/newsletter2',
    '/payment',
    '/payment-success',
    '/error',
    '/not-found',
    '/cv',
  ],
  transform: async (config, path) => {
    // Définir les priorités pour chaque page
    const priorities = {
      '/': 1.0, // Page d'accueil en priorité maximale
      '/menu': 0.9,
      '/reservation': 0.9,
      '/notre-histoire': 0.7,
      '/ou-manger-cacher-ibiza': 0.5, // Eat cacher en 5ème position
      '/avis': 0.4, // Avis en dernière position
    };
    
    return {
      loc: path,
      changefreq: 'daily',
      priority: priorities[path] || 0.5,
      lastmod: new Date().toISOString(),
    };
  },
}; 