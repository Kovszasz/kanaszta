'use strict';

const express = require('express');
const io = require('socket.io');
const events = require('./events');
var config = require('./config');
const PORT=config.PORT
const HOST=config.HOST
class Server {
  constructor() {
    this.app = express();
    console.log(PORT,HOST)
    this.server = this.app.listen(PORT,HOST);
    this.io = io(this.server);
    new events(this.io).eventsConfig();
  }
}

new Server();
