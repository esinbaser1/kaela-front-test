import React from 'react';

const Robes = ({ robe }) => {
  const images = robe.image_url.split(',');

  return (
    <>
      <h3>{robe.nom}</h3>
      <p>{robe.description}</p>
      {images.map((url, index) => (
        <img key={index} src={`http://localhost/travail-perso/Kaela-back/${url}`} alt={robe.nom} />
      ))}
    </>
  );
};

export default Robes;
