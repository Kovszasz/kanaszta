<template>
<div>
    <template v-for="card in cards">
      <Card class="deck" v-bind:key="card.id" :forhead="card.id" :id="card.id" :user="user" v-bind:z_index="card.zindex" draggable="true" v-on:dragstart.native="increaseZindex(card.id)"/>
    </template>

    </div>
</template>

<script>
import Card from "./Card.vue"
import io from 'socket.io-client';
export default {
  name: 'Deck',
  components:{
      Card
    },
  props: {
    user:String
  },
data(){
    return {
      deck:[],
      cards:[],
      socket : io('ws://0.0.0.0:3001'),
      zindex:108
    }
  },
  mounted() {
        this.socket.on('deck_mixed', (data) => {
            if(this.deck.length==0){
                this.deck=data
            console.log(data)
            for(var i=0;i<this.deck.length;i++){
              this.cards.push({id:this.deck[i],zindex:i})
            }
            }
        });



      this.socket.on('increasedZ_',(data)=>{
        console.log(data)
          this.cards=data.data
          this.zindex=data.zindex
      })
    },
    methods:{
  increaseZindex(id){
    for(var i=0;i<this.cards.length;i++){
        if(this.cards[i].id==id){
          this.cards[i].zindex=this.zindex
          console.log(this.cards[i].zindex)
          break;
        }
    }
    this.zindex++
      //document.getElementById(id).style.zIndex = this.zindex;
    this.socket.emit('increasedZ',{data:this.cards,zindex:this.zindex})
    
}
/*
{
  var elems = document.getElementsByTagName(elem);
  var highest = 0;
  for (var i = 0; i < elems.length; i++)
  {
    var zindex=document.defaultView.getComputedStyle(elems[i],null).getPropertyValue("z-index");
    if ((zindex > highest) && (zindex != 'auto'))
    {
      highest = zindex;
    }
  }
    console.log(highest)
    this.zindex=highest+1
    console.log(this.zindex)
    return this.zindex
  }*/
    }
  }
</script>
