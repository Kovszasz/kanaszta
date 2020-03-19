<template>
  <div id="app">
   <!-- <p v-for="(player,index) in players_example" v-bind:key="player" :class="players_position[index]">{{ player }}</p>-->
   <Deck :user="user.name"/>
    <div class="text-center">
    <v-snackbar
      v-model="snackbar"
      :multi-line="multiLine"
    >
      {{ text }}
      <v-btn
        color="red"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
  </div>
</template>

<script>
import Deck from './components/Deck.vue'
import io from 'socket.io-client';
export default {
  name: 'App',
  components: {
    Deck
  },
  data(){
    return{
      multiLine: true,
      snackbar: false,
      text: '',
      user:{
        name:null
      },
      users:[],
      players:[],
      players_set:false,
      players_example:["Adi","Cselgo","Bogi","David"],
      players_position:["bottom","right","top","left"]
    }
  },
    created() {
    this.user.name = prompt('Please enter your username:', '');
    if (this.user.name) {
      this.socket = io('http://0.0.0.0:3001');
      this.socket.on('connect', () => {
        this.connect();
      });
    }
    },
    mounted(){
    this.socket.on('users',(data)=>{
      this.users=data.user
      if(data.size==1){
        console.log("we're here")
      //  if(!this.players_set){
        console.log(data.user)
        var array=Array.from(data.user)
        console.log(array)
        for(var i=0;i<array.length;i++){
          let elements=array[i]
          console.log(elements)
          this.players.push(elements)
          this.arrange_players(this.players)
        }
        this.players_set=true
        }
     // }
    })

    this.socket.on('turned_card',(data)=>{
      this.text=data.user+' megfordított egy lapot!'
      this.snackbar=true
    })

    },
    methods:{
        connect() {
      this.socket.emit('connected', this.user);
    },
  beforeDestroy() {
    if (this.socket) {
      this.socket.emit('disconnected', {
        user: this.user
      });

    }
  },
  arrange_players(array){
    while(array[0]==this.user){
        array.push(array.shift())
    }
    this.players=array
  }
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.left{
  float:left;
  top:200px;
}
.right{
  float:right;
  top:200px;
}
.top{
  float:top;
  top:30px;
}
.bottom{
  float:bottom;
  bottom:30px;
}
</style>
