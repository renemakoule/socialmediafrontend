import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Smile, ThumbsUp } from 'lucide-react';

interface PostItemProps {
  content: string;
  initialReactions: {
    likes: number;
    smile: number;
    heart: number;
  };
}

const PostItem: React.FC<PostItemProps> = ({ content, initialReactions }) => {
  const [reactions, setReactions] = useState(initialReactions);

  const handleReaction = (type: keyof typeof reactions) => {
    setReactions(prevReactions => ({
      ...prevReactions,
      [type]: prevReactions[type] + 1,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p>{content}</p>
      <div className="mt-2 flex space-x-4">
        {/* Bouton pour le like 👍 */}
        <button
          onClick={() => handleReaction('likes')}
          className="text-blue-500 hover:text-blue-700 flex"
        >
          <ThumbsUp />&nbsp; {reactions.likes}
        </button>

        {/* Bouton pour le sourire 😄 */}
        <button
          onClick={() => handleReaction('smile')}
          className="text-yellow-500 hover:text-purple-700 flex"
        >
          <Smile />&nbsp; {reactions.smile}
        </button>

        {/* Bouton pour le cœur ❤️ */}
        <button
          onClick={() => handleReaction('heart')}
          className="text-red-500 hover:text-pink-700 flex"
        >
          <Heart />&nbsp; {reactions.heart}
        </button>
      </div>
    </motion.div>
  );
};

export default PostItem;
