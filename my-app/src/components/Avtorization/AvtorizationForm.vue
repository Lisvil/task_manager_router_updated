<template>
  <div class="wrapper">
    <div class="block">
      <div class="img-holder"></div>
      <h3>Авторизація</h3>
      <form class="avtorization">
        <input type="name" placeholder="Ввведіть логін" v-model="userLogin">
        <input type="password" placeholder="Веедіть пароль" v-model="userPassword"><br >
        <div v-if='error' class="error">Неправильний логін або пароль</div>
        <button id = "but"  @click='checkUser' onclick="event.preventDefault()">
          <template v-if="!btnLoading">
                Вхід
          </template>
          <b-spinner v-else variant="light" small></b-spinner>
        </button>
        <!-- <input type="button" id = "but" value="Вхід" @click='checkUser'> -->
        <!-- <router-link :to="{ path: correctLogin }"><input type="button" id = "but" value="Вхід" @click='checkUser'></router-link> -->
        <!-- <router-link :to="{name: 'home', params: {id: correctLogin }}"><input type="button" id = "but" value="Вхід" @click='checkUser'></router-link> -->
      </form>
    </div>
    <div class="users_login_pass">
      <p>Login: liliasolohub, pass: 12345</p>
      <p>Login: ihor, pass: 12345</p>
      <p>Login: taras, pass: 9s5d4fqr</p>
      <p>Login: daria, pass: 1s9d3LPc</p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'AvtorizationForm',
    data() {
      return {
        userData: '',
        error: false,
        userLogin: '',
        userPassword: '',
        correctLogin: '',
        btnLoading: false
      }

    },
    created() {
      if (localStorage.length != 0){
        this.$router.push('home'); /// need to rewatch
        console.log("Success!!");
      } else {
        console.log("empty");
      }

    },
    methods: {
      checkUser: async function () {
        this.btnLoading = true
        let userInfo = {login: this.userLogin, password: this.userPassword}
        // https://task-manager-lzi3.onrender.com
        const response = await fetch(`https://task-manager-lzi3.onrender.com/api/checkUser`, { ///api/checkUser
        // const response = await fetch(`/api/checkUser`, { ///api/checkUser

            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userInfo)
          })
          let resp = await response.json();
          this.btnLoading = false
          console.log(resp);
          if (resp.length != 0) {
            this.userData = resp;
            // window.location.href = "/home";
            this.$router.push('home');
            localStorage.login = this.userData[0].login;
            localStorage.id = this.userData[0]._id;
            localStorage.name = this.userData[0].name;
            localStorage.surname = this.userData[0].surname;
            localStorage.position = this.userData[0].position;
            localStorage.isAdmin = this.userData[0].isAdmin;
            localStorage.photo = this.userData[0].image;
            this.correctLogin = '/home';
          } else {
            this.error = true
          }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .error {
    margin-top: 10px;
    padding: 15px 0px;
    background: #f5d0ce;
    color: #6e2722;
  }
  button {
    border: 0;
    border-radius: 5px;
    margin-top: 5px;
    padding: 6px 5px;
  }
</style>
