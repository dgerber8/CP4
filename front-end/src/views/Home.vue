<template>
  <div class="home">
    <h1>Welcome to Make Your Perfect Celebrity!</h1>
    <p>Below, there is a list of heads, bodies and legs from various celebrities. Select one image to use from each section and click on the display link below to see your creation! To add, remove or edit the pictures, click the admin link at the bottom of the page</p>
    <router-link to="/display">Display</router-link>

    <hr/>

    <section class="image-gallery">
      <h1>Heads</h1>
      <div class="image" v-for="head in heads" :key="head.id">
        <h2>{{head.title}}</h2>
        <img :src="head.path" />
        <p style = "width = 100px">{{head.description}}</p>
        <button @click="selectItem(head)">Use This!</button>
      </div>
    </section>

    <hr/>

    <section class="image-gallery">
      <h1>Bodies</h1>
      <div class="image" v-for="body in bodies" :key="body.id">
        <h2>{{body.title}}</h2>
        <img :src="body.path" />
        <p style = "width = 100px">{{body.description}}</p>
        <button @click="selectItem(body)">Use This!</button>
      </div>
    </section>

    <hr/>

    <section class="image-gallery">
      <h1>Legs</h1>
      <div class="image" v-for="leg in legs" :key="leg.id">
        <h2>{{leg.title}}</h2>
        <img :src="leg.path" />
        <p style = "width = 100px">{{leg.description}}</p>
        <button @click="selectItem(leg)">Use This!</button>
      </div>
    </section>

  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Home',
    data() {
      return {
       items: [],
       heads: [],
       bodies: [],
       legs: [],
      }
    },
    created() {
      this.getItems();
      this.getHeads();
      this.getBodies();
      this.getLegs();
    },
    methods: {
      async getItems() {
        try {
          let response = await axios.get("/api/items");
          this.items = response.data;
          return true;
        } catch (error) {
          return false;
        }
      },
      async getHeads() {
        try {
          let response = await axios.get("/api/heads");
          this.heads = response.data;
          return true;
        } catch (error) {
          return false;
        }
      },
      async getBodies() {
        try {
          let response = await axios.get("/api/bodies");
          this.bodies = response.data;
          return true;
        } catch (error) {
          return false;
        }
      },
      async getLegs() {
        try {
          let response = await axios.get("/api/legs");
          this.legs = response.data;
          return true;
        } catch (error) {
          return false;
        }
      },
      async selectItem(item) {
        try {
          let r2 = await axios.post('/api/toDisplay', {
            title: item.title,
            description: item.description,
            path: item.path
          });
          return r2;
        } catch (error) {
          return false;
        }
      },
    }
  }
</script>

<style scoped>
  .image h2 {
    font-style: italic;
  }

  /* Masonry */
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  .image-gallery {
    column-gap: 1.5em;
  }

  .image {
    margin: 0 0 1.5em;
    display: inline-block;
    width: 100%;
  }

  .image img {
    width: 100%;
  }

  /* Masonry on large screens */
  @media only screen and (min-width: 1024px) {
    .image-gallery {
      column-count: 4;
    }
  }

  /* Masonry on medium-sized screens */
  @media only screen and (max-width: 1023px) and (min-width: 768px) {
    .image-gallery {
      column-count: 3;
    }
  }

  /* Masonry on small screens */
  @media only screen and (max-width: 767px) and (min-width: 540px) {
    .image-gallery {
      column-count: 2;
    }
  }
</style>
