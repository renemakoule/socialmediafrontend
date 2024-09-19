'use client'
// Assurez-vous d'installer lucide-react pour les icônes
import Image from "next/image";
import Post from "./Post";
import PollDialog from "./PollDialog";
import VoiceRecorderDialog from "./VoiceRecorderDialog";
import UploadDialog from "@/components/UploadDialog";
import CameraCapture from "./CameraCapture";
import PopularGifs from "./popularGifs";
import { SendHorizonal } from "lucide-react";
import React, { useState } from 'react';

const PostInput = () => {

  const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            // Logic to send the message
            console.log("Message sent:", message);
            // Send notification here
            alert("Message sent!");
            setMessage(''); // Clear input after sending
        }
    };


  return (
    <main className="flex flex-col items-center bg-gray-100 min-h-screen">
      {/* Contenu qui reste fixe */}
      <div className="sticky top-0 z-50 w-full max-w-sm mt-8">
        <div className="flex flex-col items-center bg-white shadow-md rounded-lg mx-auto p-4">
          {/* Icône du haut */}
          <div className="flex justify-center mb-4">
            <span className="text-3xl font-bold">𑁍</span>{" "}
            {/* Remplacez par votre icône spécifique */}
          </div>

          {/* Ligne avec l'avatar et le champ d'entrée */}
          <div className="flex items-center w-full mb-4 space-x-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Image
                src="/poket.jpg" // remplacez par le bon chemin de l'image
                alt="Avatar"
                width={40}
                height={40}
                className="border border-orange-400 rounded-full"
              />
            </div>
            <p>Minato.ai</p>
          </div>

          {/* Zone d'entrée */}
          <div className="relative w-full">
            <textarea
                name="text"
                placeholder="What's new?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border-b-2 border-gray-200 focus:outline-none focus:border-gray-400 pr-10" // pr-10 for padding right
            />
            <div 
                className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer' 
                onClick={handleSend}
            >
                <SendHorizonal className="text-[#D247BF] hover:text-[#05a3ff]" />
            </div>
        </div>

          <br />

          {/* Icônes sous le champ d'entrée */}
          <div className="flex justify-between w-full">
            <CameraCapture />
            <UploadDialog />
            <VoiceRecorderDialog />
            <PopularGifs />
            <PollDialog />
          </div>
        </div>
      </div>

      {/* Composant Post qui défile sous le contenu fixe */}
      <div className="mt-4 w-full max-w-sm overflow-y-auto scrollbar-hide">
        <Post />
      </div>
    </main>
  );
};

export default PostInput;
