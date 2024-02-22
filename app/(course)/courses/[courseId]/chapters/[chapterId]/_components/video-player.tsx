"use client"
import React, { useEffect } from 'react';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';

interface VideoPlayerProps {
    videoSource: string;
}

const VideoPlayer = ({ videoSource }: VideoPlayerProps) => {
  useEffect(() => {
    // Initialize Video.js
    const player = videojs('my-video', {
      // Video.js options (if any)
    });

    // Clean up on component unmount
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div data-vjs-player>
      <video
        id="my-video"
        className="video-js vjs-default-skin"
        controls
        preload="auto"
        width="640"
        height="360"
        
      >
        <source src={videoSource} type="video/mp4" />
        {/* Add additional source elements for different video formats if needed */}
      </video>
    </div>
  );
};

export default VideoPlayer;
