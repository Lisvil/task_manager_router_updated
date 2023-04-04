<template>
  <div>
    <div v-if="!loading" id="news">
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
                  {{ showNewsDate(news.newsDate)}}
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
              <button class="add_news_button" @click="addNews">
                <template v-if="!btnloading">
                  Додати
                </template>
                <b-spinner v-else variant="light" small></b-spinner>
              </button>
          </div>
        </div>
      </div>
    </div>
    <LoadingBlock v-if="loading"/> 
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
        loading: false,
        btnloading: false
      }
    },
    created: function() {
      let date = new Date()
      this.newsDate = date.getDate() + '.' + (date.getMonth() + 1) + "." + date.getFullYear();
      this.getAllNews()
    },
    methods: {
      async addNews() {
        this.btnloading = true
        let newsToAdd = {"creator": localStorage.getItem("id"), "newsBody": this.newsBody, "photo": this.userPhoto, "creatorName": this.userName, "newsDate": this.newsDate }
        this.newsBody = ''
        // console.log(newsToAdd);
        const obj = await fetch(`https://task-manager-lzi3.onrender.com/api/createNews`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newsToAdd)
          })
        console.log(obj)
        this.allNews.unshift(newsToAdd)
        this.btnloading = false
        
          // document.location.reload();
      },
      getAllNews: async function () {
        this.loading = true
        const response = await fetch(`https://task-manager-lzi3.onrender.com/api/allNews`)
        this.allNews = await response.json()
        this.allNews.reverse()
        this.loading = false
      },
      showNewsDate(date) {
        let arr = date.split('.')
        arr = arr.map(el => {
          if (el < 10) {
            return '0' + el
          } else {
            return el
          }
        })
        return arr[0] + '.' + arr[1] + '.' + arr[2]
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
