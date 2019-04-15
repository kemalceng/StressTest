import routes from './api/routes';
import express from 'express';
import path from 'path';

import { urlencoded, json } from 'body-parser';

export let analysisDataCache = {};

var app = express();
var port = process.env.PORT || 3334;

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(urlencoded({ extended: true }));
app.use(json());

app.use('/tests', express.static(path.join(__dirname, '/tests')));
app.use('/resources', express.static(path.join(__dirname, '/resources')));

routes(app);

var wsMap = {};

app.get('/ping', function (req, res) {
  console.log('Ping received.')
  res.json({ 'message': 'pong' });
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/start-test', function (req, res, next) {
  const wsId = req.body && req.body.wsId && req.body.wsId.toLowerCase();
  const fileId = req.body && req.body.fileId
  const testType = req.body.test;

  console.log(`Start ${testType} test for client ${wsId}`);

  if (wsId && wsMap[wsId]) {
    io.to(wsMap[wsId]).emit('start-image-test', fileId)
    res.json({ 'message': 'Starting test...' });
  } else {
    res.status(400).json({ 'message': 'Invalid client' });
  }
})

io.on('connection', function (socket) {
  console.log('a user connected, id: ', socket.id);

  wsMap[socket.id.substr(0, 4).toLowerCase()] = socket.id;

  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    delete wsMap[socket.id.substr(0, 4).toLowerCase()];
  });

  socket.on('start_image_test', function () {
  });

});

http.listen(port, function () {
  console.log(`listening on: ${port}`);
});
