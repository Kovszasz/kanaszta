<template>
    
    <!--<Moveable 
    width="50"
    height="80"
    class="deck moveable"
    v-bind="moveable"
    @drag="handleDrag"
    @resize="handleResize"
    @scale="handleScale"
    @rotate="handleRotate"
    @warp="handleWarp"
    @pinch="handlePinch"
    >

        <span><img @click="turn" :src="CardUrl(face)" width="30%" height="30%" /></span>
    </Moveable>-->
    <div class="deck">
    <vue-draggable-resizable  ref="card" @dragging="onDrag"  :resizable="false" :z="zindex" :x="x" :y="y" :w="width" :h="height"> 
      <img v-on:click="turn()" :src="CardUrl(face)" width="100px" />
    </vue-draggable-resizable>
    </div>
</template>

<script>
//import Moveable from 'vue-moveable';
import Vue from 'vue'
import VueDraggableResizable from 'vue-draggable-resizable'

// optionally import default styles
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.component('vue-draggable-resizable', VueDraggableResizable)
import io from 'socket.io-client';
export default {
  name: 'Card',
  components:{
  //    Moveable
  VueDraggableResizable
  },
  props: {
    user:String,
    id:String,
    z_index:Number,
    forhead:String,
    back:{
        type:String,
        default:"Back1"
    },
    face_up:{
        type:Boolean,
        default:false
    },
    method:{type:Function}
  },
  data(){
      return{
        face:this.face_up,
        owner:null,
        zindex:this.z_index,
    moveable: {
      draggable: true,
      throttleDrag: 0,
      resizable: false,
      throttleResize: 1,
      keepRatio: false,
      scalable: false,
      throttleScale: 0,
      rotatable: true,
      throttleRotate: 0,
      pinchable: true, // ["draggable", "resizable", "scalable", "rotatable"]
      origin: false,
    },
      result: [],
      delay: 700,
      clicks: 0,
      timer: null,
      socket : io('ws://0.0.0.0:3001'),
      width: 100,
      height: 100,
      x: 300,
      y: 300

      }
  },
  methods:{
 CardUrl:function(up){
    if(up){
        return require(`../assets/${this.forhead}.svg`)
    }else{
        return require(`../assets/${this.back}.svg`)
    }
    },
    turn(){
          this.clicks++ 
          if(this.clicks === 1) {
            var self = this
            this.timer = setTimeout(function() {
              if(this.owner==null){
                self.owner=self.user
                self.face=!self.face
              }else if(self.owner==self.user){
                self.face=!self.face
              }
              self.clicks = 0
            }, this.delay);
          } else{
             clearTimeout(this.timer); 
             if(this.owner==this.user){
               this.owner=null
             } 
             this.face=!this.face
             console.log('double click')
             this.socket.emit('turned',{id:this.id,turn:this.face});
             this.clicks = 0;
          }  
        this.socket.emit('turned_card',{user:this.user})
        this.socket.emit('card_user',{id:this.id,user:this.owner})
    },
    handleDrag({ target, transform }) {
   //   console.log('onDrag left, top', transform);
      target.style.transform = transform;
      console.log(target)
        this.socket.emit('onDrag',{id:this.id,data:{target:target,transform:transform}});
    },
    handleResize({
      target, width, height, delta,
    }) {
     // console.log('onResize', width, height);
      delta[0] && (target.style.width = `${width}px`);
      delta[1] && (target.style.height = `${height}px`);
      this.socket.emit('onResize',{id:this.id,data:{width:this.width,height:this.height}});
    },
    handleScale({ target, transform, scale }) {
      console.log('onScale scale', scale);
      target.style.transform = transform;
      this.socket.emit('CARD',{id:this.id,data:this.moveable});
    },
    handleRotate({ target, dist, transform }) {
      console.log('onRotate', dist);
      target.style.transform = transform;
      this.socket.emit('CARD',{id:this.id,data:this.moveable});
    },
    handleWarp({ target, transform }) {
      //console.log('onWarp', transform);
      target.style.transform = transform;
      this.socket.emit('CARD',{id:this.id,data:this.moveable});
    },
    handlePinch({ target }) {
      console.log('onPinch', target);
      this.socket.emit('CARD',{id:this.id,data:this.moveable});
    },
    onResize: function (x, y, width, height) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
      

    },
    onDrag: function (x, y) {

      this.x = x
      this.y = y

      this.socket.emit('onDrag',{id:this.id,data:{x:x,y:y}});
    }

  },
    mounted() {
        this.socket.on('cardOnDrag', (data) => {
            //this.onDrag(data.data.x,data.data.y,true)
            if(this.id==data.id){
            //this.$refs.card.top=data.data.y
            //this.$refs.card.left=data.data.x
            this.y=data.data.y
            this.x=data.data.x


            }
            //if(data.id==this.id){
       //         console.log('LISTENIN',data)
                //this.handleDrag(data.target, data.transform)
                //data.target.style=data.transform
        //    }
    })
      this.socket.on('card_turned',(data)=>{
        if(data.id==this.id){
          console.log(data)
          this.face=data.turn
        }
      })
      this.socket.on('card_user',(card)=>{
        if(card.id==this.id){

          this.owner=card.owner
        }
      })
      this.socket.on('increasedZ_',(data)=>{
          for(var i=0;i<data.data.length;i++){
            if(data.data[i].id==this.id){
                this.zindex=data.data[i].zindex

              break;
      }
  }

      })
  }
}
</script>
<style scoped>
    .deck{
        position:relaitve;
        top: 80px;
        right: 30px;
    }
</style>