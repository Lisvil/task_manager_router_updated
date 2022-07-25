<template>
  <div id="news">
    <div class="news_part">
          <div class="all_news">
            <h2>Новини компанії</h2>
            <div class="single_news" v-for="(news, index) in allNews" :key="index">
              <div class="news_creator_photo">
                <img class="creator_photo" :src="require(`../../assets/images/${news.photo}`)">
              </div>
              <div class="single_news_body">
                <div class="single_news_body__header">
                  <div class="news_creator_name">
                    {{ news.creatorName }}
                  </div>
                  <div class="single_news_body__data">
                    {{ news.newsDate }}
                  </div>

                </div>
                <p class="news_text">{{ news.newsBody }}</p>
              </div>
            </div>


          </div>
          <div class="news_aside_part">
            <div class="add_news_form">
              <h3>Додати новину</h3>
              <!-- <input class="news_title" type="text" v-model="newsTitle" placeholder="Введіть назву новини"> -->
              <textarea class="textarea_news" v-model="newsBody" placeholder="Введіть текст"></textarea><br>
              <button class="add_news_button" @click="addNews">Додати</button>
            </div>
<!-- ****************************************************************************** -->
                
<!-- ****************************************************************************** -->
          </div>
        </div>
  </div>
</template>

<script>
  export default {
    name: 'NewsPart',
    data(){
      return {
        allNews: [],
        // newsTitle: '',
        newsBody: '',
        userName: localStorage.getItem("name"),
        userPhoto: localStorage.getItem("photo"),
        newsDate: '',
      }
    },
    created: function() {
      this.getAllNews()
    },
    mounted() {
      // function date_on_site(){
      //   let date = new Date();
      //   let day = date.getDate();
      //   let month = date.getMonth();
      //   let year = date.getFullYear()
      //   let current_data = day + "." + (month + 1) + "." + year;
      //   console.log(current_data);
      // }
      this.date_on_site();
    },
    methods: {
      async addNews() {
        let newsToAdd = {"creator": localStorage.getItem("id"), "newsBody": this.newsBody, "photo": this.userPhoto, "creatorName": this.userName, "newsDate": this.newsDate }
        // console.log(newsToAdd);
        await fetch(`/api/createNews`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newsToAdd)
          })
          document.location.reload();
      },
      getAllNews: async function () {
        const response = await fetch(`/api/allNews`)
        this.allNews = await response.json();
      },
      date_on_site(){
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear()
        let current_data = day + "." + (month + 1) + "." + year;
        this.newsDate = current_data;
      }
    }
  }
</script>

<style scoped>
  .all_news {
    width: 80%;
  }
  .news_creator_photo{
    overflow: hidden;
  }
  .creator_photo {
    height: 100%;
    width: 100%
  }
</style>
