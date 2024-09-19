'use client'

import { useState, useRef } from 'react'
import { FileVideo, X, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Simulons une API de GIFs populaires
const popularGifs = [
  '/amour.gif',
  '/amour1.gif',
  '/amour2.gif',
  '/amour3.gif',
  '/argents.gif',
  '/argents1.gif',
  '/argents2.gif',
  '/d.gif',
  '/d1.gif',
  '/d2.gif',
  '/d3.gif',
  '/d4.gif'
]

export default function GifUploader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedGif, setSelectedGif] = useState<string | null>(null)
  const [uploadedGif, setUploadedGif] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedGif(e.target?.result as string)
        setSelectedGif(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGifSelect = (gif: string) => {
    setSelectedGif(gif)
  }

  const handlePost = () => {
    if (selectedGif) {
      console.log('Posting GIF:', selectedGif)
      // Ici, vous implémenteriez la logique pour poster le GIF
      setSelectedGif(null)
      setUploadedGif(null)
      setIsDialogOpen(false)
    }
  }

  const handleDelete = () => {
    setSelectedGif(null)
  }

  return (
    <div>
        <FileVideo onClick={() => setIsDialogOpen(true)} className="w-6 h-6 text-cyan-500 cursor-pointer" />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a GIF</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Download</TabsTrigger>
              <TabsTrigger value="popular">Popular GIFs</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <div className="flex flex-col items-center space-y-4">
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose a file
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/gif"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                {uploadedGif && (
                  <img src={uploadedGif} alt="Uploaded GIF" className="max-w-full h-auto" />
                )}
              </div>
            </TabsContent>
            <TabsContent value="popular" className='overflow-y-auto'>
              <div className="grid grid-cols-4 gap-2 overflow-y-auto">
                {popularGifs.map((gif, index) => (
                  <img
                    key={index}
                    src={gif}
                    alt={`Popular GIF ${index + 1}`}
                    className={`w-[50px] h-auto cursor-pointer ${selectedGif === gif ? 'border-2 border-blue-500' : ''}`}
                    onClick={() => handleGifSelect(gif)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          {selectedGif && (
            <div className="mt-4 relative">
              <img src={selectedGif} alt="Selected GIF" className="w-[50px] h-auto" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-0 right-0 rounded-full"
                onClick={handleDelete}
              >
                <X className="h-4 w-4 cursor-pointer text-red-400 hover:text-red-700" />
              </Button>
            </div>
          )}
          <DialogFooter>
          <Button onClick={() => setIsDialogOpen(false)} variant="outline">Annuler</Button>
            <Button onClick={handlePost} disabled={!selectedGif}>Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}