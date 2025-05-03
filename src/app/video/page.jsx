import React from 'react';

const VideoPlayer = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <video
        src="https://firebasestorage.googleapis.com/v0/b/osc-official-b3cab.appspot.com/o/sei_neurosync.mp4?alt=media&token=af2beb55-0821-4012-a7ad-b8a3a199cb03" // <-- your online video link
        controls
        autoPlay
        loop
        muted
        className="rounded-2xl shadow-lg max-w-full h-auto"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
