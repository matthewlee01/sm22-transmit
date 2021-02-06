
'use strict';

const express = require('express');
const io = require('socket.io-client');
const watch = require('node-watch');

const PORT = process.env.PORT || 3001;

const server = express()
    .listen(PORT, () => console.log(`listening on ${PORT}`));

const socket = io('https://sm22-lt-proto.herokuapp.com');

const fs = require('fs');
const DATAFILE = 'dummy.txt';

watch(DATAFILE, (eventType, filename) => {
  fs.readFile('dummy.txt', 'utf-8', (err, data) => {
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

socket.on('connect', () => {
  console.log(socket.id);
  socket.emit('bike-connect');
  
    
});



