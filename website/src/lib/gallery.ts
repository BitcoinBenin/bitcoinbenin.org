import { list } from '@vercel/blob';
// Revalide les données de la galerie toutes les 15 minutes (900 secondes)
export const revalidate = 900;


// Les interfaces sont partagées entre le serveur et le client
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
}

export interface GalleryFolder {
  id: string;
  name: string;
  coverImage: string;
  images: GalleryImage[];
}

// Formate "nom-de-dossier" en "Nom De Dossier"
const formatFolderName = (folder: string): string => {
  return folder
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Extrait le nom du fichier de l'URL pour l'utiliser comme titre
const formatImageTitle = (url: string): string => {
    const fileName = url.split('/').pop() || 'Image';
    return decodeURIComponent(fileName.substring(0, fileName.lastIndexOf('.')) || fileName);
};

// Fonction principale pour récupérer et transformer les données de Vercel Blob
export const getGalleryData = async (): Promise<GalleryFolder[]> => {
  // Récupère la liste de tous les blobs dans le dossier "gallery/"
  // La revalidation est gérée au niveau de la page (export const revalidate)
  const { blobs } = await list({ prefix: "gallery/" });

  const folders: Record<string, string[]> = {};

  for (const blob of blobs) {
    // Ignore les blobs qui sont des dossiers (se terminant par '/')
    if (blob.pathname.endsWith('/')) {
      continue;
    }
    const parts = blob.pathname.split("/");
    // S'assure que le fichier est bien dans un sous-dossier de "gallery/"
    if (parts.length < 3) continue;

    const folderName = parts[1];
    folders[folderName] = folders[folderName] || [];
    folders[folderName].push(blob.url);
  }

  // Formate les données brutes pour correspondre à la structure attendue par le composant
  const formattedData: GalleryFolder[] = Object.entries(folders)
    .map(([folderId, imageUrls]) => {
      if (imageUrls.length === 0) return null;

      const folderName = formatFolderName(folderId);
      return {
        id: folderId,
        name: folderName,
        coverImage: imageUrls[0], // La première image devient la couverture
        images: imageUrls.map((url) => ({
          id: url,
          src: url,
          alt: `Image de ${folderName}`,
          title: formatImageTitle(url),
          description: `Photo de l'événement: ${folderName}`,
        })),
      };
    })
    .filter((folder): folder is GalleryFolder => folder !== null);

  return formattedData;
};
