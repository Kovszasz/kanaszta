<template>
  <Deck/>
</template>

<script>
import Deck from "./Deck.vue"
//import Card from "./Card.vue"
export default {
  name: 'Table',
  components:{
   // Card,
    Deck
    },
  props: {
    user:String
  }
}
</script>