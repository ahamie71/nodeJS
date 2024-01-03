const db = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const isAdmin = require('../middleware/authMiddleware')

//  Récupérer tous les commentaires
exports.getAllComments = (req, res) => {
    db.query('SELECT * FROM commentaire', (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des commentaires :', err);
        res.status(500).send('Erreur serveur lors de la récupération des commentaires');
        return;
      }
      res.json(results);
    });
  };
  
  // GET - Récupérer un commentaire par ID
exports.getCommentById = (req, res) => {
    const commentId = req.params.id;
    db.query('SELECT * FROM commentaire WHERE id = ?', commentId, (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération du commentaire :', err);
        res.status(500).send('Erreur serveur lors de la récupération du commentaire');
        return;
      }
      if (results.length === 0) {
        res.status(404).send('Commentaire non trouvé');
        return;
      }
      res.json(results[0]);
    });
  };
  
  //  Créer un nouveau commentaire
exports.createComment = (req, res) => {
    const { id_utilisateur, id_technologie, message } = req.body;
    const newComment = { id_utilisateur, id_technologie, message };
  
    db.query('INSERT INTO commentaire SET ?', newComment, (err, results) => {
      if (err) {
        console.error('Erreur lors de la création du commentaire :', err);
        res.status(500).send('Erreur serveur lors de la création du commentaire');
        return;
      }
      res.status(201).send('Commentaire créé avec succès');
    });
  };
 
  // Mettre à jour un commentaire par ID
exports.updateCommentById = (req, res) => {
    const commentId = req.params.id;
    const { message } = req.body;
    const updatedComment = { message };
  
    db.query('UPDATE commentaire SET ? WHERE id = ?', [updatedComment, commentId], (err, results) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du commentaire :', err);
        res.status(500).send('Erreur serveur lors de la mise à jour du commentaire');
        return;
      }
      res.status(200).send('Commentaire mis à jour avec succès');
    });
  };
  // DELETE - Supprimer un commentaire par ID
exports.deleteCommentById = (req, res) => {
    const commentId = req.params.id;
    db.query('DELETE FROM comments WHERE id = ?', commentId, (err, results) => {
      if (err) {
        console.error('Erreur lors de la suppression du commentaire :', err);
        res.status(500).send('Erreur serveur lors de la suppression du commentaire');
        return;
      }
      res.status(200).send('Commentaire supprimé avec succès');
    });
  };
  
  