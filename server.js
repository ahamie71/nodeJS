const express = require('express');
const app = express();
const cors = require('cors');


app.use(express.json());
app.use(cors());


const utilisateurRoute = require('./routes/utilisateurRoute');
const commentaireRoute = require('./routes/commentaireRoute');
const technologieRoute = require('./routes/technologieRoute');


app.use('/utilisateur', utilisateurRoute);
// app.use('/commentaire', commentaireRoute);
 app.use('/technologie', technologieRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Le serveur est démarré sur le port ${PORT}`);
});
 