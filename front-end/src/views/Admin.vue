<template>
  <div class="admin">
    <h1>The Admin Page!</h1>
    <div class="heading">
        <div class="circle">1</div>
        <h2>Add an Item</h2>
      </div>
      <div class="add">
        <div class="form">
          <input v-model="title" placeholder="Title">
          <p></p>

          <input v-model="description" placeholder="Head, Body, or Legs">

          <p></p>
          <input type="file" name="photo" @change="fileChanged">
          <button @click="upload">Upload</button>
        </div>
        <div class="upload" v-if="addItem">
          <h2>{{addItem.title}}</h2>
          <img :src="addItem.path" />
        </div>
      </div>
      <div class="heading">
          <div class="circle">2</div>
          <h2>Edit/Delete an Item</h2>
        </div>
        <div class="edit">
          <div class="form">
            <input v-model="findTitle" placeholder="Search">
            <div class="suggestions" v-if="suggestions.length > 0">
              <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectItem(s)">{{s.title}}
              </div>
            </div>
          </div>
          <div class="upload" v-if="findItem">
            <input v-model="findItem.title">
            <p></p>
            <textarea v-model="findItem.description" rows="4" cols="50"> Description </textArea>
            <img :src="findItem.path" />
          </div>
          <div class="actions" v-if="findItem">
            <button @click="deleteItem(findItem)">Delete</button>
            <button @click="editItem(findItem)">Edit</button>
          </div>
        </div>
  </div>

</template>

<script>
  import axios from 'axios';
  export default {
    name: 'Admin',
    data() {
      return {
        title: "",
        description: "",
        file: null,
        addItem: null,
        items: [],

        findTitle: "",
        findDescription:"",
        findItem: null,
      }
    },
    computed: {
      suggestions() {
        let items = this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
        return items.sort((a, b) => a.title > b.title);
      }
    },
    created() {
      this.getItems();
    },
    methods: {
      fileChanged(event) {
        this.file = event.target.files[0]
      },
      async upload() {
        try {
          const formData = new FormData();
          formData.append('photo', this.file, this.file.name, this.file.description)
          let r1 = await axios.post('/api/photos', formData);
          let currTitle = this.title;
          let currDesc = this.description;
          let currPath = r1.data.path;
          let r2 = await axios.post('/api/items', {
            title: currTitle,
            description: currDesc,
            path: currPath
          });
          this.addItem = r2.data;
          if (currDesc === "Head") {
            let r3 = await axios.post('/api/heads', {
              title: currTitle,
              description: currDesc,
              path: currPath
            });
            this.addItem = r3.data;
          }
          else if (currDesc === "Body") {
            let r3 = await axios.post('/api/bodies', {
              title: currTitle,
              description: currDesc,
              path: currPath
            });
            this.addItem = r3.data;
          }
          else if (currDesc === "Legs") {
            let r3 = await axios.post('/api/legs', {
              title: currTitle,
              description: currDesc,
              path: currPath
            });
            this.addItem = r3.data;
          }
        } catch (error) {
          return false;
        }
      },
      async getItems() {
        try {
          let response = await axios.get("/api/items");
          this.items = response.data;
          return true;
        } catch (error) {
          return false;
        }
      },
      selectItem(item) {
        this.findTitle = "";
        this.findDescription = this.description;
        this.findItem = item;

      },
      async deleteItem(item) {
        try {

          await axios.delete("/api/items/" + item._id);

          this.findItem = null;
          this.getItems();
          return true;
        } catch (error) {
          return false;
        }
      },
      async editItem(item) {
        try {

          await axios.put("/api/items/" + item._id, {
            title: this.findItem.title,
            description: this.findItem.description,
          });
          
          this.findItem = null;
          this.findDescription = null;
          this.getItems();
          return true;
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
    font-size: 1em;
  }

  .heading {
    display: flex;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .heading h2 {
    margin-top: 8px;
    margin-left: 10px;
  }

  .add,
  .edit {
    display: flex;
  }

  .circle {
    border-radius: 50%;
    width: 18px;
    height: 18px;
    padding: 8px;
    background: #333;
    color: #fff;
    text-align: center
  }

  /* Form */
  input,
  textarea,
  select,
  button {
    font-family: 'Montserrat', sans-serif;
    font-size: 1em;
  }

  .form {
    margin-right: 50px;
  }

  /* Uploaded images */
  .upload h2 {
    margin: 0px;
  }

  .upload img {
    max-width: 300px;
  }
  /* Suggestions */
  .suggestions {
    width: 200px;
    border: 1px solid #ccc;
  }

  .suggestion {
    min-height: 20px;
  }

  .suggestion:hover {
    background-color: #5BDEFF;
    color: #fff;
  }
</style>
