// authMiddleware.js

const isAdmin = (req, res, next) => {
    const userRole = req.user.role; 
  
    if (userRole !== 'administrateur') {
      return res.status(403).json({ message: 'Accès non autorisé. Seuls les administrateurs peuvent effectuer cette action.' });
    }
    
    next();
  };
  
  module.exports = isAdmin;
  