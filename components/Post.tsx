'use client'
import React from 'react';
import { motion } from 'framer-motion';
import PostItem from './PostItem';

interface PostProps {
  author: string;
  content: string;
  image?: string;
  profileImage?: string; // Nouvelle prop pour la photo de profil
}

const Post = ({ author, content, image, profileImage }: PostProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white w-[380px] shadow rounded-lg p-4 mb-4"
    >
      <div className="flex items-start mb-2">
        {/* Photo de profil */}
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 border border-orange-400 rounded-full mr-2"
          />
        )}
        {/* Informations sur l'auteur */}
        <span className="font-bold mt-2 text-black">{author}</span>
      </div>
      <p className='text-black'>{content}</p>
      {image && <img src={image} alt="Post image" className="w-full mt-4 rounded-lg" />}
      <PostItem content="Hello world!" initialReactions={{ likes: 0, smile: 0, heart: 0 }} />
    </motion.div>
  );
};

const PostWrapper = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Post
        author="Minato.ai"
        content="Ceci est ma première publication"
        image="/amour.gif"
        profileImage="/poket.jpg" // Exemple de photo de profil
      />
      <Post
        author="Rene M"
        content="Regardez cette superbe vue !"
        image="/d2.gif"
        profileImage="https://via.placeholder.com/40" // Exemple de photo de profil
      />
    </div>
  );
};

export default PostWrapper;
