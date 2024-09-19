"use client"
import { useState } from 'react';
import { ImageIcon } from 'lucide-react'; // Assurez-vous d'importer votre icône Camera
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const UploadMenu = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      const filePreview = URL.createObjectURL(file);
      setPreview(filePreview);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <ImageIcon className="w-6 h-6 text-purple-500 cursor-pointer" />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Upload a File</DialogTitle>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="my-4"
          />
          {preview && (
            <div className="mt-4 rounded-md">
              {selectedFile?.type.startsWith('image/') && (
                <img src={preview} alt="Preview" className="w-[400px] h-auto rounded-md" />
              )}
              {selectedFile?.type.startsWith('video/') && (
                <video controls className="w-[500px] h-[300px] rounded-md">
                  <source src={preview} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => {
                // Logic to upload the file
              }}
              className="px-4 py-2 text-white bg-blue-500 rounded-md"
            >
              Post
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadMenu;
