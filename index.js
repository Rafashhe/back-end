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

app.use(express.json());

var todos = [
  { id: 1, title: 'buy the milk' },
  { id: 2, title: 'rent a car' },
  { id: 3, title: 'feed the cat' }
];
var count = todos.length;

app.get('/lists', (request, response) => response.status(200).json(todos));

app.post('/lists/new', (request, response) => {
  var newTodo = request.body;
  count = count + 1;
  newTodo.id = count;
  todos.push(newTodo);
  response.status(201).json({ message: 'New todo created successfully.' });
});

app.get('/lists/:id', (request, response) => {
  var id = request.params.id;
  var todo = todos.find((item) => item.id === parseInt(id));

  if (todo) {
    response.status(200).json(todo);
  } else {
    response.status(404).send('The task is not found');
  }
});

app.patch('/lists/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos[index].title = request.body.title;
    response.status(200).send(todos[index]);
  } else {
    response.status(404).send();
  }
});

app.delete('/lists/:id', (request, response) => {
  var id = parseInt(request.params.id);
  var index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);

    // Atualizar os IDs dos itens restantes
    todos.forEach((todo, index) => {
      todo.id = index + 1;
    });

    response.status(200).send();
  } else {
    response.status(404).send();
  }
});

// Inicialização do servidor
const port = 4000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
