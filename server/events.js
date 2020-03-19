'use strict';

var types =["C","D","H","S"]
var deck_=["","2"]
var values=["2","3","4","5","6","7","8","9","10","J","K","A","Q"]

function deck(){
    var arra1=[]
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
  constructor(io){
    this.io = io;
    this.users = {};
    this.user_list=new Set();
  }

  socketEvents(io) {
    io.on('connection', (socket) => {
      socket.on('connected', (user) => {
        this.users[socket.id] = user;
        this.user_list.add(user.name)
        console.log(this.user_list.size)
        socket.broadcast.emit('users', {user:this.user_list,size:this.user_list.size});
        io.emit('users', {user:this.user_list,size:this.user_list.size});
        console.log(this.user_list)
      });

      socket.on('disconnect', () => {
        delete this.users[socket.id];
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

