<template>
  <div>
    <div v-if="!loading" class="users">
      <div class="user_card" v-for="user in usersAdmin" v-bind:key="user._id">
        <div class="user_card__main_info">
          <div class="user_card__photo">
            <img :src="require(`../../assets/images/${user.image}`)" v-if="user.hasOwnProperty('image')">
          </div>
          <div class="user_card__user_name">{{ user.name }} {{ user.surname}}</div>
          <!-- <div class="user_card__tasks_statistic">Виконано завдань - 10</div> -->
        </div>
        <div class="user_card__personal_info">
          <p class="user_card__position"><i class="fas fa-user-tie"></i>{{ user.position }}</p>
          <p class="user_card__email"><i class="fas fa-envelope"></i> {{ user.email }}</p>
          <p class="user_card__phone"><i class="fas fa-phone"></i>{{ user.phone }}</p>
          <p class="user_card__date_of_bith"><i class="fas fa-birthday-cake"></i> {{ user.data_of_birth }}</p>
        </div>
      </div>
    </div>
    <LoadingBlock v-if="loading"/> 
  </div>
</template>
<script>
  export default {
    name: 'UsersList',
    data: function() {
      return {
        usersAdmin: [],
        loading: false
      }
    },
    created: function(){
      this.showAllUsers();
    },
    methods: {
      showAllUsers: async function () {
        this.loading = true
        const response = await fetch('https://task-manager-lzi3.onrender.com/api/allUsers');
        this.usersAdmin = await response.json();
        this.loading = false
      }
    }
  }
</script>
<style scoped>
  .users {
    flex-wrap: wrap;
  }
  .user_card__photo > img {
    height: 100%;
    width: 100%
  }
  .user_card__photo {
    overflow: hidden;
  }
</style>
