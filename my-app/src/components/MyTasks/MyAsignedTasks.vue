<template lang="html">
    <div class="asigned_tasks">

      <!-- <h2>Counter. Tasks not viewed - {{ countNotViewedTasks.length }}</h2>  показує к-сть непродивлених задач -->
      <div class="asigned_task" :id="item._id" v-for="item in myTasks" v-bind:key="item._id" v-bind:class="{'new_task': !item.isLooked}">
        <div class="asigned_task__header">
          <div class="asigned_task__complexity ">{{ item.complication }}</div> <!--/*******color_complexity -->
          <div class="asigned_task__name"><h3>{{ item.title }} </h3></div>
        </div>
        <div class="asigned_task__body">
          <p class="asigned_task_text">{{ item.taskDescription }}</p>
          <div class="asigned_task__deadline"><i class="fas fa-calendar-week"></i> {{ item.deadline}}</div>
          <div class="asigned_task__asigned-by"><i class="fas fa-user"></i>{{ allUsers[item.creator-1].name }}</div>
        <div class="asigned_task__buttons">
          <!-- <button id="btn_done">Виконано</button>
          <button id="btn_more">Детальніше</button> -->
          <!-- <button class="comment_btn" @click='transferDataToShowForm(item)'><i class="fas fa-comment-dots"></i></button> -->
          <button class="show_btn" @click='transferDataToShowForm(item); '><i class="fas fa-eye"></i></button>
          <div class="coments_icon"><i class="fas fa-comment-dots"></i><span>({{ item.comments.length }})</span></div>
          <button id="done_btn" @click='completeTask(item._id)'><i class="far fa-check-circle"></i></button>
      </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name:'MyAsignedTasks',
  data: function(){
    return {
      myTasks: [],
      allUsers: [],
    }
  },
  created: function(){
    this.getMyTasks()
    this.showAllUsers()

 },
  updated: function() {
    let showBtnsArr = document.querySelectorAll('.show_btn');
    showBtnsArr.forEach((item) => {
      item.onclick = () => {
        document.querySelector("#show_form").classList.add("flex");
        document.querySelector(".form").classList.add("read_only");
        document.querySelector(".set_task_form__name").setAttribute("disabled", "disabled");
      }
    });
/// commented comment btn
    // let commentBtnsArr = document.querySelectorAll('.comment_btn');
    // commentBtnsArr.forEach((item) => {
    //   item.onclick = () => {
    //     document.querySelector("#show_form").classList.add("flex");
    //     document.querySelector(".form").classList.add("read_only");
    //     document.querySelector(".set_task_form__name").setAttribute("disabled", "disabled");
    //   }
    // });
    this.complexityColor();
    if (this.countNotViewedTasks.length > 0) {
      document.getElementsByClassName("notification_my_tasks")[0].innerHTML = this.countNotViewedTasks.length;
    } else {
      document.getElementsByClassName("notification_my_tasks")[0].innerHTML = "";
    }
  },
  mounted() {
  },
  methods: {
    getMyTasks: async function () {
      let userId = {id: localStorage.id};
      const response = await fetch(`/api/myTasks`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(userId)
        })
      this.myTasks = await response.json();
    },
    showAllUsers: async function () {
      const response = await fetch('/api/allUsers');
      this.allUsers = await response.json();
      this.allUsers.sort((a, b) => {
        return a._id - b._id
      })
    },
    transferDataToShowForm: async function(item) {
      item.readOnly = true;
      item.performerWatch = true;
      item.allUsers = this.allUsers;
      this.$emit('watchBtnClick', item);
  // change isLooked to TRUE
      console.log('mark task as looked. Task id - ' + item._id);
      let taskToUpdate = { "_id": item._id}
      document.getElementById(item._id).classList.remove("new_task");

      await fetch(`/api/markAsLooked`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(taskToUpdate)
        })


    },


    // transferDataToCommentForm: function(item) {
    //   item.readOnly = true;
    //   bus.$emit('commentBtnClick', item, this.edit);
    // },
    completeTask: async function(itemId){
      console.log('complete task. Task id - ' + itemId);
      let taskToUpdate = { "_id": itemId}

      await fetch(`/api/finishTask`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(taskToUpdate)
        })
      document.location.reload()
    },
    complexityColor: function() {
      let num = '';
      let arr = document.querySelectorAll(".asigned_task__complexity");
      arr.forEach((item) => {
        num = item.textContent;
        switch (num) {
          case '1':
            item.classList.add("light-complexity");
            break;
          case '2':
            item.classList.add("normal-complexity");
            break;
          case '3':
            item.classList.add("good-complexity");
            break;
          case '4':
          item.classList.add("medium-complexity");
            break;
          case '5':
            item.classList.add("strong-complexity");
            break;
          case '6':
            item.classList.add("hard-complexity");
            break;
          default:

        }
      });

    }
  },
  computed: {
    countNotViewedTasks: function() { // показує к-сть непродивлених задач
      return this.myTasks.filter(function(task){
        return task.isLooked === false
      })
    }
  }
}
</script>

<style lang="css" scoped>

</style>
