
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
// const URL = 'http://localhost:3000';
const socket = io(URL);

// let the server know that the bike client is connected
socket.on('connect', () => {
  console.log(socket.id);
  socket.emit('bike-connect');
});

// initialize file watcher & parser to send updates to server
const fs = require('fs');
const csvparse = require('csv-parse');
const DATAFILE = '/home/matt/Downloads/analog-data15.csv';
const MSG_SIZE = 3;

watch(DATAFILE, (eventType, filename) => {
  fs.readFile(DATAFILE, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('detected update');
    csvparse(data, (err, rows) => {
      console.log(rows);
      var cutoff = rows.length-MSG_SIZE-1;
      socket.emit('update-data', rows.slice(cutoff));
    });
  });
});





