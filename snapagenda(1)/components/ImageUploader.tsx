
import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      onClick={handleClick}
      className="group cursor-pointer border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl p-12 transition-all hover:bg-indigo-50/50 flex flex-col items-center justify-center text-center"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl group-hover:scale-110 transition-transform mb-4">
        <Upload size={32} />
      </div>
      <p className="text-gray-900 font-semibold mb-1">Click to upload image</p>
      <p className="text-gray-400 text-sm">Posters, screenshots, or flyers</p>
    </div>
  );
};
