const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors')

const app = express();
app.use(cors())


const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'sami',
  password: '12345',
  database: 'cours'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    throw err;
  }
  console.log('Connecté à la base de données MySQL');
});

const saltRounds = 10; // Nombre de "tours" de hachage
// Route d'inscription
app.post('/api/inscription', async (req, res) => {
  const { nom, prenom, email, mdp } = req.body;

  try {
    const hash = await bcrypt.hash(mdp, saltRounds);
    const newUser = { nom, prenom, email, mdp: hash };
    
    db.query('INSERT INTO utilisateur SET ?', newUser, (err, results) => {
      if (err) {
        console.error('Erreur lors de l\'inscription de l\'utilisateur :', err);
        res.status(500).send('Erreur serveur lors de l\'inscription de l\'utilisateur');
        return;
      }
      res.status(201).send('Utilisateur inscrit avec succès');
    });
  } catch (err) {
    console.error('Erreur lors du hachage du mot de passe :', err);
    res.status(500).send('Erreur serveur lors de l\'inscription de l\'utilisateur');
  }
});

// Route de login
app.post('/api/login', (req, res) => {
  const { email, mdp } = req.body;

  db.query('SELECT id, mdp FROM utilisateur WHERE email = ?', email, async (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche de l\'utilisateur :', err);
      res.status(500).send('Erreur serveur lors de la connexion');
      return;
    }

    if (results.length === 0) {
      res.status(401).send('Email ou mot de passe incorrect');
      return;
    }

    const hashedPassword = results[0].mdp;
    try {
      const match = await bcrypt.compare(mdp, hashedPassword);
      if (match) {
        res.status(200).send('Utilisateur authentifié avec succès');
      } else {
        res.status(401).send('Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur lors de la comparaison des mots de passe :', error);
      res.status(500).send('Erreur serveur lors de la connexion');
    }
  });
});

// Vos autres routes pour gérer les utilisateurs et les commentaires

// Route pour obtenir tous les utilisateurs
app.get('/api/utilisateurs', (req, res) => {
    db.query('SELECT * FROM utilisateur', (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
        res.status(500).send('Erreur serveur lors de la récupération des utilisateurs');
        return;
      }
      res.json(results);
    });
  });
  

  // Route pour obtenir tous les techno
app.get('/api/techno', (req, res) => {
    db.query('SELECT * FROM technologie ', (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des technos :', err);
        res.status(500).send('Erreur serveur lors de la récupération des technologies');
        return;
      }
      res.json(results);
    });
  });
  
  // Route pour obtenir un utilisateur spécifique par ID
  app.get('/api/utilisateurs/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT * FROM utilisateur WHERE id = ?', userId, (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', err);
        res.status(500).send('Erreur serveur lors de la récupération de l\'utilisateur');
        return;
      }
      if (results.length === 0) {
        res.status(404).send('Utilisateur non trouvé');
        return;
      }
      res.json(results[0]);
    });
  });
  
  // Route pour modifier un utilisateur par ID
   app.put('/api/utilisateurs/:id', async (req, res) => {
    const userId = req.params.id;
    const { nom, prenom, email, mdp } = req.body;
  
    try {
      const hash = await bcrypt.hash(mdp, saltRounds);
      const updatedUser = { nom, prenom, email, mdp: hash };
      
      db.query('UPDATE utilisateur SET ? WHERE id = ?', [updatedUser, userId], (err, results) => {
        if (err) {
          console.error('Erreur lors de la modification de l\'utilisateur :', err);
          res.status(500).send('Erreur serveur lors de la modification de l\'utilisateur');
          return;
        }
        res.status(200).send('Utilisateur modifié avec succès');
      });
    } catch (err) {
      console.error('Erreur lors du hachage du mot de passe :', err);
      res.status(500).send('Erreur serveur lors de la modification de l\'utilisateur');
    }
  });
  
  // Route pour supprimer un utilisateur par ID
  app.delete('/api/utilisateurs/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM utilisateur WHERE id = ?', userId, (err, results) => {
      if (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur :', err);
        res.status(500).send('Erreur serveur lors de la suppression de l\'utilisateur');
        return;
      }
      res.status(200).send('Utilisateur supprimé avec succès');
    });
  });
  
// Route pour créer un commentaire
app.post('/api/commentaires', (req, res) => {
    const { id_utilisateur, id_technologie, contenu } = req.body;
    const newComment = { id_utilisateur, id_technologie, contenu };
  
    db.query('INSERT INTO commentaire SET ?', newComment, (err, results) => {
      if (err) {
        console.error('Erreur lors de l\'écriture du commentaire :', err);
        res.status(500).send('Erreur serveur lors de l\'écriture du commentaire');
        return;
      }
      res.status(201).send('Commentaire écrit avec succès');
    });
  });
  
  // Route pour obtenir tous les commentaires pour une technologie spécifique

app.get('/api/commentaires/technologie/:id_technologie', (req, res) => {
    const technologieId = req.params.id_technologie;
  
    db.query('SELECT c.*, t.nom_techno FROM commentaire c JOIN technologie t ON c.id_technologie = t.id WHERE c.id_technologie = ?', technologieId, (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des commentaires pour la technologie :', err);
        res.status(500).send('Erreur serveur lors de la récupération des commentaires pour la technologie');
        return;
      }
      res.json(results);
    });
  });
    

  
  // Route pour obtenir tous les commentaires pour un utilisateur spécifique
  app.get('/api/commentaires/utilisateur/:id_utilisateur', (req, res) => {
    const utilisateurId = req.params.id_utilisateur;
  
    db.query('SELECT * FROM commentaire WHERE id_utilisateur = ?', utilisateurId, (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des commentaires de l\'utilisateur :', err);
        res.status(500).send('Erreur serveur lors de la récupération des commentaires de l\'utilisateur');
        return;
      }
      res.json(results);
    });
  });

  // Route pour obtenir une technologie par son ID
app.get('/api/technologies/:id', (req, res) => {
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
  });
  
  
  // Route pour supprimer un commentaire par ID
  app.delete('/api/commentaires/:id', (req, res) => {
    const commentId = req.params.id;
    db.query('DELETE FROM commentaire WHERE id = ?', commentId, (err, results) => {
      if (err) {
        console.error('Erreur lors de la suppression du commentaire :', err);
        res.status(500).send('Erreur serveur lors de la suppression du commentaire');
        return;
      }
      res.status(200).send('Commentaire supprimé avec succès');
    });
  });
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
