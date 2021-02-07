
'use strict';

// import dependencies
const express = require('express');
const io = require('socket.io-client');
const watch = require('node-watch');


// initialize express server, watching on PORT
const PORT = process.env.PORT || 3001;
const server = express()
    .listen(PORT, () => console.log(`listening on ${PORT}`));

// initialize socket.io websocket
const URL = 'https://sm22-lt-proto.herokuapp.com';
const socket = io(URL);

// let the server know that the bike client is connected
socket.on('connect', () => {
  console.log(socket.id);
  socket.emit('bike-connect');
});

// initialize file watcher to send updates to server
const fs = require('fs');
const DATAFILE = 'dummy.txt';

watch(DATAFILE, (eventType, filename) => {
  fs.readFile(DATAFILE, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('detected update');
    const vals = data.split("\n");
    console.log(vals);
    socket.emit('update-data', vals[0], vals[1], vals[2]);

        
    });
});





