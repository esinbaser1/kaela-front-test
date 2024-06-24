import React from 'react';

const Robes = ({ robe }) => {
  return (
    <li>
      <h3>{robe.nom}</h3>
      <p>{robe.description}</p>
      {robe.image_url && <img src={`http://localhost/travail-perso/kaela-back-test/${robe.image_url}`} alt={robe.nom} />}
    </li>
  );
};

export default Robes;
