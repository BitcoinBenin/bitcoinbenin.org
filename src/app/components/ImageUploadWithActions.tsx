'use client';

import { useState } from 'react';
import { GalleryImage } from '@/lib/supabase';
import { uploadImage } from '../admin/actions';
import Button from './ui/Button';

interface ImageUploadProps {
  onUploadComplete?: (images: GalleryImage[]) => void;
  albumId?: string;
}

export default function ImageUploadWithActions({ onUploadComplete, albumId }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const uploadImages = async () => {
    console.log('Début uploadImages - fichiers sélectionnés:', selectedFiles?.length);
    
    if (!selectedFiles || selectedFiles.length === 0) {
      console.log('Aucun fichier sélectionné');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const uploadedImages: GalleryImage[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        console.log(`Traitement fichier ${i + 1}/${selectedFiles.length}:`, file.name);
        
        try {
          console.log('Appel de uploadImage pour:', file.name);
          const imageData = await uploadImage(file, albumId);
          console.log('uploadImage réussi pour:', file.name);
          uploadedImages.push(imageData);
        } catch (error: unknown) {
          console.error('Erreur upload fichier:', file.name, error);
          console.error('Type d\'erreur:', (error as Error)?.constructor?.name);
          console.error('Message d\'erreur:', (error as Error)?.message);
          console.error('Stack complet:', (error as Error)?.stack);
          continue;
        }

        setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }

      console.log('Upload terminé. Images uploadées:', uploadedImages.length);
      onUploadComplete?.(uploadedImages);
      setSelectedFiles(null);
      
      // Reset du file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: unknown) {
      console.error('Erreur générale lors de l\'upload:', error);
      console.error('Type d\'erreur générale:', (error as Error)?.constructor?.name);
      console.error('Message d\'erreur générale:', (error as Error)?.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-brand-charcoal/50 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
      <h3 className="text-xl font-display font-bold text-white mb-4">Uploader des images</h3>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-brand-green/50 transition-colors">
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <label
            htmlFor="file-upload"
            className="cursor-pointer block"
          >
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-white font-medium mb-1">
              {selectedFiles ? `${selectedFiles.length} fichier(s) sélectionné(s)` : 'Cliquez pour sélectionner des images'}
            </p>
            <p className="text-gray-500 text-sm">
              PNG, JPG, GIF jusqu&apos;à 10MB par fichier
            </p>
          </label>
        </div>

        {selectedFiles && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-400">Fichiers sélectionnés:</h4>
            {Array.from(selectedFiles).map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                <span className="text-sm text-gray-300 truncate">{file.name}</span>
                <span className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Upload en cours...</span>
              <span className="text-brand-green font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-brand-green to-brand-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <Button
          variant="primary"
          onClick={uploadImages}
          disabled={!selectedFiles || uploading}
          className="w-full"
        >
          {uploading ? 'Upload en cours...' : 'Uploader les images'}
        </Button>
      </div>
    </div>
  );
}