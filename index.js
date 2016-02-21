var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var schedule = require('node-schedule');

var userCount = 0;
var yesVotes = 0;
var noVotes = 0;

var topicIndex = 0;
var questions = ["Should abortion be legal?", 
                 "Is the ACLU good for America?", 
                 "Can alternative energy effectively replace fossil fuels?", 
                 "Should animals be used for scientific or commercial testing?", 
                 "Is sexual orientation determined at birth?", 
                 "Are cell phones safe?", 
                 "Should churches remain tax-exempt?", 
                 "Was Bill Clinton a good president?", 
                 "Is a college education worth it?", 
                 "Should adults have the right to carry a concealed handgun?", 
                 "Should the United States maintain its embargo against Cuba?", 
                 "Should the death penalty be allowed?", 
                 "Should the drinking age be lowered from 21 to a younger age?", 
                 "Should euthanasia or physician-assisted suicide be legal?", 
                 "Should gay marriage be legal?", 
                 "Should the United States return to a gold standard?", 
                 "Is golf a sport?"];
var topic = questions[topicIndex];

app.use(express.static('public'));

app.get('/', function(req, res){
  res.redirect('/html/index.html');
  //res.sendFile('/Users/minho814/Desktop/CompSci/ChatApp/index.html');
});

// upon user login
io.on('connection', function(socket){ 
  console.log('a user connected');
  userCount = userCount + 1;
  io.emit('userUpdate', userCount); // update user count
  socket.emit('voteUpdate', yesVotes, noVotes);
  socket.emit('topicUpdate', topic)

  // upon user disconnect
  socket.on('disconnect', function(){ 
    console.log('user disconnected'); 
    userCount = userCount - 1;
    io.emit('userUpdate', userCount); // update user count
  });

  // upon red button press
  socket.on('red press', function(msg, vote, change){
    noVotes = noVotes + vote;
    io.emit('voteUpdate', yesVotes, noVotes)
    if (vote > 0) {
      console.log('message: ' + msg);
      io.emit('red press', msg, 'all', change);
      socket.emit('red press', msg);
      socket.emit('positionUpdate', 'No');
    }
  });

  // upon blue button press
  socket.on('blue press', function(msg, vote, change){ 
    yesVotes = yesVotes + vote;
    io.emit('voteUpdate', yesVotes, noVotes)
    if (vote > 0) {
      console.log('message: ' + msg);
      io.emit('blue press', msg, 'all', change);
      socket.emit('blue press', msg);
      socket.emit('positionUpdate', 'Yes');
    }
  });

  var j = schedule.scheduleJob({hour: 00, minute: 00}, function(){
    topicIndex = (topicIndex + 1) % questions.length;
    topic = questions[topicIndex];
    yesVotes = 0;
    noVotes = 0;
    io.emit('reset', topic);
  });
});


http.listen(process.env.PORT, function(){
  //console.log('listening on *:3000');
});