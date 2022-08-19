<template>
  <div class="aside-container">
    <aside class="aside-menu">
      <div id="aside_menu_fixed" >
        <div class="set-task"  :class="{ active: this.$route.path == '/home'}">
          <!-- <router-link :to="{ name: 'home/my-tasks', params: {} }"> -->
          <router-link to="/home">

            <div class="icon_block">
              <i class="fas fa-clipboard-list"></i>
              <div class="notification_completed_tasks"></div>
            </div>
            <p class="menu_item">Призначити завдання</p>
          </router-link>
        </div>
        <div class="my-tasks" :class="{ active: this.$route.path == '/home/my-tasks'}">
          <!-- <router-link :to="{ name: '/home/set-tasks', params: {} }"> -->
          <router-link to="/home/my-tasks">

            <div class="icon_block">
              <i class="fas fa-tasks"></i>
              <div class="notification_my_tasks"></div>
            </div>
            <p class="menu_item">Мої завдання</p>
          </router-link>
        </div>
        <div class="colleages"  :class="{ active: this.$route.path == '/home/users'}">
          <router-link to="/home/users">
            <div class="icon_block">
              <i class="fas fa-user-friends"></i>
              <div class="notification_users"></div>
            </div>
            <p class="menu_item">Працівники</p>
          </router-link>
        </div>
        <div class="news"  :class="{ active: this.$route.path == '/home/news'}">
          <router-link to="/home/news">
            <div class="icon_block">
              <i class="fas fa-newspaper"></i>
              <div class="notification_news"></div>
            </div>
            <p class="menu_item">Новини</p>
          </router-link>
        </div>
        <div class="add_user" v-show="isAdmin != 'undefined' " :class="{ active: this.$route.path == '/home/admin-page'}">
          <router-link to="/home/admin-page">
            <i class="fas fa-user-plus"></i>
            <p class="menu_item">Додати користувача</p>
          </router-link>
        </div>
        <div class="hide_menu" @click="show_menu">
          <i class="fas fa-chevron-right"></i>
        </div>
      </div>
    </aside>

  </div>
</template>
<script>

  export default {
    name: 'AsidePart',

    data() {
      return {
        isAdmin: localStorage.getItem("isAdmin"),
      }
    },

    methods: {
      show_menu() {
        document.querySelector(".aside-container").classList.toggle("show_more");
      }
    },
  }

</script>
