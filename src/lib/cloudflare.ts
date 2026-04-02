// Configuration pour Cloudflare Images (alternative à Supabase)
export const CLOUDFLARE_CONFIG = {
  account_id: process.env.CLOUDFLARE_ACCOUNT_ID,
  api_token: process.env.CLOUDFLARE_API_TOKEN,
  account_hash: process.env.CLOUDFLARE_ACCOUNT_HASH,
};

// Fonction pour obtenir l'URL optimisée Cloudflare
export function getCloudflareUrl(imageId: string, size: 'thumb' | 'medium' | 'large' = 'medium') {
  const sizes = {
    thumb: 'width=200,height=200,fit=crop,format=webp,quality=60',
    medium: 'width=800,height=600,fit=crop,format=webp,quality=75',
    large: 'width=1920,height=1080,fit=crop,format=webp,quality=85'
  };
  
  return `https://imagedelivery.net/${CLOUDFLARE_CONFIG.account_hash}/${imageId}/${sizes[size]}`;
}

// Migration script pour transférer les images vers Cloudflare
export async function migrateToCloudflare() {
  // Script à exécuter une fois pour migrer toutes les images
  // de Supabase vers Cloudflare Images
}
