const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
const serviceAccount = require('./serviceAccountKey.json');

// Inicialização do app Express
const app = express();

// Configurações do Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://abimael-1afcb-default-rtdb.firebaseio.com"
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rotas de login e cadastro
app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  admin
    .auth()
    .createUser({
      email,
      password,
    })
    .then((userRecord) => {
      // Usuário criado com sucesso
      res.status(200).json({ message: 'Usuário cadastrado com sucesso!' });
    })
    .catch((error) => {
      // Erro ao criar o usuário
      res.status(500).json({ error: error.message });
    });
});

app.post('/login', (req, res) => {
  const { email } = req.body;

  admin
    .auth()
    .getUserByEmail(email)
    .then((userRecord) => {
      // Email encontrado, login bem-sucedido
      res.status(200).json({ message: 'Login bem-sucedido!', user: userRecord });
    })
    .catch((error) => {
      // Email não encontrado ou erro ao buscar o usuário
      res.status(401).json({ error: 'Credenciais inválidas.' });
    });
});


// Inicialização do servidor
const port = 4000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
