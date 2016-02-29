var socket = io();
var change = false;

$(document).ready(function() {

  // Listen for user click of "No"
  $('.red').on('click', function(){
    change = false;
    if ($('.blue').is(':disabled')) {
      change = true;
      socket.emit('blue press', $('#m').val(), -1);
    }
    socket.emit('red press', $('#m').val(), 1, change);
    $('#m').val('');
    return false;
  });

  // Listen for user click of "Yes"
  $('.blue').on('click', function(){
    change = false;
    if ($('.red').is(':disabled')) {
      change = true;
      socket.emit('red press', $('#m').val(), -1);
    }
    socket.emit('blue press', $('#m').val(), 1, change);
    $('#m').val('');
    return false;
  });

  // upon user connection
  socket.on('voteUpdate', function(yes, no){
    $('#yesvote').text(yes); // update votes
    $('#novote').text(no);
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

  // Response to user click of "No"
  socket.on('red press', function(msg, who, changeStatus){
    if (who == 'all') {
      if (changeStatus) {
        $('#messages').append($('<li class = "redvote">').text('Change from Yes to No: ' + msg));
      }
      else {
        $('#messages').append($('<li class = "redvote">').text('Vote for No: ' + msg));
      }
    }
    else {
      $('.red').prop('disabled', true);
      $('.blue').prop('disabled', false);
    }
  });

  // Response to user click of "Yes"
  socket.on('blue press', function(msg, who, changeStatus){
    if (who == 'all') {
      if (changeStatus) {
        $('#messages').append($('<li class = "bluevote">').text('Change from No to Yes: ' + msg));
      }
      else {
        $('#messages').append($('<li class = "bluevote">').text('Vote for Yes: ' + msg));
      }
    }
    else {
      $('.blue').prop('disabled', true);
      $('.red').prop('disabled', false);
    }
  });

  // Update online user count
  socket.on('userUpdate', function(userCount) {
    $('#userCount').text(userCount);
  });

  // Update your position
  socket.on('positionUpdate', function(position) {
    $('#vote').text(position);
  });

  socket.on('topicUpdate', function(topicQuestion){
    $('#topic').text(topicQuestion);
  });

  // Reset the screen
  socket.on('reset', function(topicQuestion) {
    $('#messages').empty(); // empty chat
    $('#yesvote').text(0); // update votes
    $('#vote').text('');
    $('#novote').text(0);
    $('.blue').prop('disabled', false); // reset buttons
    $('.red').prop('disabled', false);
    $('#topic').text(topicQuestion);
  });
})