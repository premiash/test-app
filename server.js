var express = require("express");
	app = express();
	server = require("http").createServer(app);
	io = require("socket.io").listen(server);
	users = {};

server.listen(3000);

app.get('/', function(req, res){
res.sendFile(__dirname + '/chat.html');
});


io.sockets.on('connection', function(socket) {
  socket.on('new user',function(data, callback){
	 if(data in users){
		callback(false);
	 } else{
	 	callback(true);
		socket.nickname = data;
		users[socket.nickname] = socket;
		updateNicknames();
	 }
	
  });

  function updateNicknames(){
  	io.sockets.emit("usernames", Object.keys(users));
  }

  socket.on("new message", function(data){
    io.sockets.emit("new message", {msg: data, nick: socket.nickname});
  });

  socket.on("disconnect", function(data){
  	if(!socket.nickname) return;
  	delete users[socket.nickname];
  	updateNicknames();
  });
});

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });



//var port = process.env.PORT || 3000;

