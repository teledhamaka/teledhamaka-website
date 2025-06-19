'use client';

import { useState } from 'react';
import ViewCounter from './ViewCounter';

export default function EngagementMetrics({ slug }: { slug: string }) {
  const [likes, setLikes] = useState(0);
  
  const handleLike = async () => {
    try {
      const response = await fetch(`/api/likes/${slug}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t">
      <div className="flex space-x-4">
        <button 
          onClick={handleLike}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" 
            />
          </svg>
          <span>Helpful ({likes})</span>
        </button>
        
        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
            />
          </svg>
          <span>Share</span>
        </button>
      </div>
      
      <ViewCounter slug={slug} detailed />
    </div>
  );
}