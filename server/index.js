const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// 配置跨域
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Content-Length, Authorization,Origin,Accept,X-Requested-With'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Content-Type', 'application/json;charset=utf-8');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.send('hello world');
});

io.on('test',(req, res) => {
  console.log(req);
  res.send('test');
})

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(1111, () => {
  console.log('listening on *:1111');
});
