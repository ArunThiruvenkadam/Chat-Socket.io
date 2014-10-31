var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var messages = [];

var msgObj = {message:undefined, user:undefined};
function MsgObj(message, user) {
	this.message = message;
	this.user = user;
}
// To load html page
/*app.get('/', function(req, res) {
	console("html going to render");
	res.render('./chat.html');
});*/
var users = [];
io.on('connection', function(client){
  
  client.on("join", function(name) {
	client.username = name;
	users.push(client.username);
	io.sockets.emit("users", users);
	messages.push(new MsgObj(client.username +" is joined", "info"));
	io.sockets.emit("messages", messages);
  });

  client.on('disconnect', function(){
	for(var i = 0; i < users.length; i++) {
		if(users[i] == client.username) {
			users.splice(i, 1);
		}
	}
	messages.push(new MsgObj(client.username +" is disconnected", "info"));
	io.sockets.emit("messages", messages);
	io.sockets.emit("users", users);
  });
  
  client.on("messages", function(msg) {
	messages.push(new MsgObj(client.username +" : "+msg, client.username));
	io.sockets.emit("messages", messages);
  });
});

http.listen(8000, function(){
  console.log('Chat Server is listening on port:8000');
});