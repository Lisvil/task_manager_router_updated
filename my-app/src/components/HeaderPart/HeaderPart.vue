<template>
  <header>
    <div class="logo"><router-link :to="{ name: 'home', params: {} }">Task Manager / {{ userPosition }}</router-link></div>
    <div class="full-data">
      <div class="time">{{ currentTime }} </div>
      <div class="day">{{ currentDay }}</div>
      <div class="data"> {{ currentDate }}</div>
    </div>
    <div class="user-info">
      <div class="user_photo">
        <img :src="require(`../../assets/images/${this.userPhoto}`)">
      </div>
      <div class="user_name">
        {{ userName }}
      </div>
      <router-link to="/#"><button @click='cleanCookies'>Вийти</button></router-link>
    </div>
  </header>
</template>

<script>

  export default {
    name: 'HeaderPart',
    data() {
      return {
        userName: localStorage.getItem("name"),
        userPosition: localStorage.getItem("position"),
        userPhoto: localStorage.getItem("photo"),
        currentTime: '',
        currentDay: '',
        currentDate: ''
      }
    },
    methods: {
      cleanCookies: function() {
        localStorage.clear()
      },
      clock(){
        let date = new Date();
        let hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours(),
        minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
        // seconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
        let dayOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
        let days = date.getDay();
        this.currentTime = hours + ':' + minutes;
        this.currentDay = dayOfWeek[days];
      },
      dateOnSite() {
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear()
        day = day - 10 > 0 ? day : '0' + day
        month = month - 10 > 0 ? month + 1 : '0' + (month + 1)
        this.currentDate = day + "." + month + "." + year;
      }

    },
    mounted() {
      this.dateOnSite()
      setInterval(this.clock, 1000);
  }

}
</script>

<style>
</style>
