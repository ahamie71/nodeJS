const db = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.getAllUsers = async (req, res) => {
  try {
    const sql = 'SELECT * FROM utilisateur ';
    const result = await db.query(sql);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUtilisateurById = async (req, res) => {
 
    const userId = req.params.id;
    db.query('SELECT * FROM utilisateur WHERE id = ?',userId,(err,results)=>{

      if (err) {
        console.error('Erreur lors de la récupération de lutilisateur :', err);
        res.status(500).send('Erreur serveur lors de la récupération du user');
        return;
      }
      if (results.length === 0) {
        res.status(404).send('utilisateur non trouvée');
        return;
      }
      res.json(results[0]);
    });
  };
  
  
exports.inscription = async (req, res) => {
  const { nom, prenom, email, mdp } = req.body;
  console.log(mdp);
  const result = await db.query('SELECT * FROM utilisateur WHERE email = ?', [email]);
  if (result.length > 0) {
    return res.status(401).json({ error: "Utilisateur déjà existant" });
  }
  const hashedPassword = await bcrypt.hash(mdp, 5);
  await db.query('INSERT INTO utilisateur (nom, prenom, email, mdp) VALUES (?, ?, ?, ?)', [nom, prenom, email, hashedPassword]);
  const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
}


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query('SELECT * FROM utilisateur WHERE email = ?', [email]);
    if (result.length === 0) {
      return res.status(401).json({ error: "Utilisateur non existant" });
    }
    
    const user = result[0];
    
    if (!user || !user.mdp) {
      return res.status(401).json({ error: "Informations d'utilisateur invalides" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.mdp);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


