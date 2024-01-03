const db = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const isAdmin = require('../middleware/authMiddleware')

exports.getAllTechnologies = (req, res) => {
  db.query('SELECT * FROM technologie', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des technologies :', err);
      res.status(500).send('Erreur serveur lors de la récupération des technologies');
      return;
    }
    res.json(results);
  });
};

exports.getTechnologyById = (req, res) => {
  const technologieId = req.params.id;
  db.query('SELECT * FROM technologie WHERE id = ?', technologieId, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de la technologie :', err);
      res.status(500).send('Erreur serveur lors de la récupération de la technologie');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Technologie non trouvée');
      return;
    }
    res.json(results[0]);
  });
};

exports.createTechnology = (req, res) => {
  const { nom_techno } = req.body;
  const newTechnology = { nom_techno };

  db.query('INSERT INTO technologie SET ?', newTechnology, (err, results) => {
    if (err) {
      console.error('Erreur lors de la création de la technologie :', err);
      res.status(500).send('Erreur serveur lors de la création de la technologie');
      return;
    }
    res.status(201).send('Technologie créée avec succès');
  });
};

exports.updateTechnologyById = (req, res) => {
  const technologieId = req.params.id;
  const { nom, description } = req.body;
  const updatedTechnology = { nom, description };

  db.query('UPDATE technologie SET ? WHERE id = ?', [updatedTechnology, technologieId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de la technologie :', err);
      res.status(500).send('Erreur serveur lors de la mise à jour de la technologie');
      return;
    }
    res.status(200).send('Technologie mise à jour avec succès');
  });
};

exports.deleteTechnologyById = (req, res) => {
  const technologieId = req.params.id;
  db.query('DELETE FROM technologie WHERE id = ?', technologieId, (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression de la technologie :', err);
      res.status(500).send('Erreur serveur lors de la suppression de la technologie');
      return;
    }
    res.status(200).send('Technologie supprimée avec succès');
  });
};
