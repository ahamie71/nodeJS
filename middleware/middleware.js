const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticator = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ erreur: "Accès refusé, token manquant." });
    }

    // Vérifier si le token est valide et décoder les informations
    jwt.verify(token.split(' ')[1], process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ erreur: "Accès refusé, token invalide." });
      }

      req.decoded = decoded; 
      next(); 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erreur: "Erreur interne du serveur." });
  }
};
const isAdminOrJournalist = (req, res, next) => {
    const userRole = req.user.role; // Supposons que le rôle soit stocké dans req.user.role
  
    // Vérifie si l'utilisateur est journaliste ou administrateur
    if (userRole !== 'journaliste' && userRole !== 'administrateur') {
      return res.status(403).json({ message: 'Accès refusé. Seuls les journalistes et les administrateurs peuvent écrire un commentaire.' });
    }
    
    // Si l'utilisateur est journaliste ou administrateur, passe à la prochaine fonction middleware ou gestionnaire de route
    next();
  };
  
  module.exports = { isAdminOrJournalist };
 

