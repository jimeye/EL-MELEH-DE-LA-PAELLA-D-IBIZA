export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    // Utiliser les headers pour obtenir l'URL au lieu de request.url
    const host = request.headers.get('host');
    const pathname = request.headers.get('x-forwarded-path') || request.headers.get('x-invoke-path') || '';
    const url = new URL(`https://${host}${pathname}`);
    const { searchParams } = url;
    const folder = searchParams.get('folder');
    
    if (!folder) {
      return NextResponse.json({ error: 'Paramètre folder requis' }, { status: 400 });
    }

    // Chemin vers le dossier des images
    const imagesDir = path.join(process.cwd(), 'public', 'images', folder);
    
    // Vérifier si le dossier existe
    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({ 
        images: [],
        message: `Dossier ${folder} n'existe pas encore`
      });
    }

    // Lire tous les fichiers du dossier
    const files = fs.readdirSync(imagesDir);
    
    // Filtrer les fichiers d'images
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });

    // Créer les chemins d'accès aux images
    const images = imageFiles.map(file => `/images/${folder}/${file}`);

    return NextResponse.json({
      images,
      count: images.length,
      folder: folder
    });

  } catch (error) {
    console.error('Erreur API get-images:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur',
      images: []
    }, { status: 500 });
  }
} 