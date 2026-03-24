import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Cache des images transformées (en production, utiliser un CDN)
const imageCache = new Map<string, { buffer: Buffer; contentType: string }>();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');
  const width = parseInt(searchParams.get('width') || '800');
  const height = parseInt(searchParams.get('height') || '600');
  const quality = parseInt(searchParams.get('quality') || '75');

  if (!path) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
  }

  // Valider les paramètres
  const validWidths = [200, 400, 600, 800, 1200, 1600, 1920];
  const validHeights = [200, 400, 600, 800, 1000, 1080];
  const validQualities = [60, 70, 75, 80, 85, 90];

  const safeWidth = validWidths.find(w => w >= width) || validWidths[validWidths.length - 1];
  const safeHeight = validHeights.find(h => h >= height) || validHeights[validHeights.length - 1];
  const safeQuality = validQualities.find(q => q >= quality) || 75;

  // Clé de cache unique
  const cacheKey = `${path}-${safeWidth}x${safeHeight}-q${safeQuality}`;

  // Vérifier le cache
  const cached = imageCache.get(cacheKey);
  if (cached) {
    return new NextResponse(cached.buffer as unknown as BodyInit, {
      headers: {
        'Content-Type': cached.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    // Récupérer l'image depuis Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.storage.from('gallery').download(path);

    if (error || !data) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Convertir en ArrayBuffer puis en Buffer
    const arrayBuffer = await data.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    // Transformer avec Sharp
    const metadata = await sharp(originalBuffer).metadata();
    const aspectRatio = (metadata.width || 800) / (metadata.height || 600);
    
    let transformedWidth = safeWidth;
    let transformedHeight = Math.round(safeWidth / aspectRatio);

    // Si height est plus contraignant
    if (transformedHeight > safeHeight) {
      transformedHeight = safeHeight;
      transformedWidth = Math.round(safeHeight * aspectRatio);
    }

    // Redimensionner et convertir en WebP
    const transformedBuffer = await sharp(originalBuffer)
      .resize(transformedWidth, transformedHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: safeQuality })
      .toBuffer();

    // Mettre en cache (limiter à 100 images en mémoire)
    if (imageCache.size > 100) {
      const firstKey = imageCache.keys().next().value;
      if (firstKey) {
        imageCache.delete(firstKey);
      }
    }
    imageCache.set(cacheKey, { buffer: transformedBuffer, contentType: 'image/webp' });

    return new NextResponse(transformedBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Erreur transformation image:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}
