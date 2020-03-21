'use strict';
var jQuery = require('jquery')
var types =["C","D","H","S"]
var deck_=["","2"]
var values=["2","3","4","5","6","7","8","9","10","J","K","A","Q"]

function deck(){
    var arra1=["J1","J2","J3","J4"]
    for(var i=0;i<types.length;i++){
        for(var j=0;j<13;j++){
          for(var k=0;k<2;k++){
            var card = values[j]+types[i]+deck_[k]
            arra1.push(card)  
          }
        }
    }
  var ctr = arra1.length, temp, index;
  while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;
      temp = arra1[ctr];
      arra1[ctr] = arra1[index];
      arra1[index] = temp;
  }   
return arra1
}

var mixed_deck = deck()


class Events {
  constructor(io,mixed_deck){
    this.io = io;
    this.users = {};
    this.user_list=new Set();
    this.mixed_deck=mixed_deck
  }

  empty(obj){
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        return false;
      }
    }
  
    return JSON.stringify(obj) === JSON.stringify({});
  }
  socketEvents(io) {
    console.log("RUNNINGG!!!")
    io.on('connection', (socket) => {
      socket.on('connected', (user) => {
        this.users[socket.id] = user;
        this.user_list.add(user.name)
        console.log(this.user_list.size)
        socket.broadcast.emit('users', {userO:this.users,user:this.user_list,size:this.user_list.size});
        io.emit('users', {userO:this.users,user:this.user_list,size:this.user_list.size});
        console.log(this.user_list)
      });

      socket.on('disconnect', () => {
        var ref = {}
        delete this.users[socket.id];
        console.log(this.users)
        //console.log(this.user_list)
        console.log(typeof this.users)
        if(this.empty(this.users)){
          mixed_deck=deck()
          io.emit('deck_mixed',mixed_deck)
        }
        socket.broadcast.emit('users', this.user_list);
        socket.emit('users',this.user_list)
      });
      socket.on('card_user',(card)=>{
        socket.broadcast.emit('card_user',card)
      });
      
      io.emit('deck_mixed',mixed_deck)

      socket.on('turned',function(data){
          console.log(data)
          socket.broadcast.emit('card_turned',data)
      });
      console.log(socket.id)
      socket.on('onDrag', function(data) {
          socket.broadcast.emit('cardOnDrag', data)
      });
    
      socket.on('turned_card',(data)=>{
        socket.broadcast.emit('turned_card',data)

      })
      socket.on('increasedZ',(data)=>{
        console.log(data)
        socket.broadcast.emit('increasedZ_',data)
        io.emit('increasedZ_',data)
      })

      
    });
  }

  /**
   *  Initialize socket events
   */

  eventsConfig() {
    this.socketEvents(this.io);
  }
}

module.exports = Events;

