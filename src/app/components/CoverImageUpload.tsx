'use client';

import { useState } from 'react';
import { uploadImage } from '../admin/actions';
import Button from './ui/Button';
import { FaImage, FaTrash, FaUpload } from 'react-icons/fa';

interface CoverImageUploadProps {
  onUploadComplete?: (imageUrl: string) => void;
  existingImage?: string;
  onRemove?: () => void;
}

export default function CoverImageUpload({ onUploadComplete, existingImage, onRemove }: CoverImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadCoverImage = async () => {
    if (!selectedFile) return;

    setUploading(true);

    try {
      const imageData = await uploadImage(selectedFile, undefined);
      const imageUrl = imageData.file_path;
      onUploadComplete?.(imageUrl);
      
      // Reset
      setSelectedFile(null);
      setPreview(null);
      
      // Reset file input
      const fileInput = document.getElementById('cover-image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Erreur upload image:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    onRemove?.();
    
    const fileInput = document.getElementById('cover-image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-4">
      {preview || existingImage ? (
        <div className="relative rounded-xl overflow-hidden border border-white/10">
          <img
            src={preview || existingImage}
            alt="Aperçu"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <FaTrash size={14} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-brand-green/50 transition-colors">
          <input
            id="cover-image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <label
            htmlFor="cover-image-upload"
            className="cursor-pointer block"
          >
            <div className="text-gray-400 mb-2">
              <FaImage className="w-12 h-12 mx-auto mb-4" />
            </div>
            <p className="text-white font-medium mb-1">
              {selectedFile ? selectedFile.name : 'Cliquez pour sélectionner une image'}
            </p>
            <p className="text-gray-500 text-sm">
              PNG, JPG, GIF jusqu&apos;à 10MB
            </p>
          </label>
        </div>
      )}

      {selectedFile && !preview && (
        <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
          <span className="text-sm text-gray-300 truncate">{selectedFile.name}</span>
          <span className="text-xs text-gray-500">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      )}

      {selectedFile && (
        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={uploadCoverImage}
            disabled={uploading}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <FaUpload />
            {uploading ? 'Upload...' : 'Uploader'}
          </Button>
          <Button
            variant="ghost"
            onClick={handleRemove}
            disabled={uploading}
          >
            <FaTrash />
          </Button>
        </div>
      )}
    </div>
  );
}
