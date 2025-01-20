import React from 'react';

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div
          className="relative w-16 h-16 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(250,226,124,0.9) 35%, rgba(250,226,124,0.2) 100%)',
            boxShadow: '0 0 20px rgba(250,226,124,0.8)',
          }}
        >
          <div
            className="absolute top-0 left-0 w-full h-full animate-spin rounded-full border-t-4"
            style={{
              borderColor: 'rgba(250,226,124,1)',
              borderTopColor: 'rgba(250,226,124,1)',
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              borderLeftColor: 'transparent',
            }}
          ></div>
        </div>
        {/* Text */}
        <p
          className="text-sm font-semibold animate-pulse"
          style={{
            color: 'rgb(0, 0, 0)',
            textShadow: '0 0 10px rgba(250, 226, 124, 0.8)',
          }}
        >
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};
export default Loading
