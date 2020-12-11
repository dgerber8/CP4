<template>
  <div class="display">
    <h1>The Display Page!</h1>
    <div style="margin: auto;">
      <div class="image" v-for="item in items" :key="item.id">
        <img :src="item.path" class = "bodyPart" />
      </div>
    </div>
  </div>

</template>


<script>
  import axios from 'axios';

  export default {
    name: 'Display',
    data() {
      return {
       items: [],
      }
    },
    created() {
      this.getItems();
    },
    methods: {
      async getItems() {
        try {
          let response = await axios.get("/api/toDisplay");
          this.items = response.data;
          return true;
        } catch (error) {
          return false;
        }
      },
    }
  }
</script>

<style scoped>


  .image {
    margin-left: auto;
    margin-right: auto;
    margin-bottom: -4px;
    width: 100%;
  }
  .bodyPart {
    width: 220px;
    height: 180px;
  }

</style>
