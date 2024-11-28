import React, { useEffect, useState } from 'react';

const importAll = (r) => r.keys().map(r);
const images = importAll(
  require.context('../imgs', false, /\.(png|jpe?g|svg)$/)
);

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className='home-container d-flex justify-content-center align-items-center text-center'
      style={{
        backgroundImage: `url(${images[currentImage]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      <div className='welcome-message text-white p-4 rounded'>
        <h1 className='display-4'>Welcome! :) </h1>
      </div>
    </div>
  );
};

export default Home;
