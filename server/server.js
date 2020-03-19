'use strict';

const express = require('express');
const io = require('socket.io');
const events = require('./events');

const PORT=3001
const HOST='0.0.0.0'
class Server {
  constructor() {
    this.app = express();
    this.server = this.app.listen(PORT,HOST);
    this.io = io(this.server);
    new events(this.io).eventsConfig();
  }
}

new Server();