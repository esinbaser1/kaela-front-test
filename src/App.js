import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import Robes from "./components/Robes";

const App = () => {
  const [robes, setRobes] = useState([]);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    fetchRobes();
  }, []);

  const fetchRobes = async () => {
    try {
      const response = await axios.get(
        "http://localhost/travail-perso/Kaela-back/liste_robes"
      );
      if (response.data && response.data.success) {
        setRobes(response.data.robes || []);
      } else {
        console.error(
          "Erreur lors de la récupération des robes:",
          response.data && response.data.message
        );
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des robes:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nom || !description || imageFiles.length === 0) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);

    for (let i = 0; i < imageFiles.length; i++) {
      const compressedFile = await imageCompression(imageFiles[i], {
        maxSizeMB: 1, // Taille maximale de l'image compressée en MB
        maxWidthOrHeight: 800, // Taille maximale en largeur ou hauteur
        useWebWorker: true, // Utiliser les Web Workers pour la compression
        initialQuality: 1,
      });
      formData.append("images[]", compressedFile);
    }

    try {
      const response = await axios.post(
        "http://localhost/travail-perso/Kaela-back/ajouter_robe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.success) {
        alert("Robe ajoutée avec succès!");
        fetchRobes();
        setNom("");
        setDescription("");
        setImageFiles([]);
        formRef.current.reset();
      } else {
        console.error(
          "Erreur lors de l'ajout de la robe:",
          response.data && response.data.message
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la robe:", error);
    }
  };

  const handleImageChange = (e) => {
    setImageFiles(e.target.files);
  };

  return (
    <div className="robe-list">
      <h2>Liste des Robes de Soirée</h2>
      <ul>
        {robes.map((robe) => (
          <Robes key={robe.id} robe={robe} />
        ))}
      </ul>

      <h2>Ajouter une nouvelle robe</h2>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            name="nom"
          />
        </div>
        <div>
          <label>Description :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            name="description"
          />
        </div>
        <div>
          <label>Images :</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default App;
