<template>
  <HeaderPart/>
  <div class="main-part">
    <AsidePart />
    <div class="info-part">
      <router-view/>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import HeaderPart from '../components/HeaderPart/HeaderPart.vue'
import AsidePart from '../components/AsidePanel/AsidePart.vue'

export default {
  name: 'HomeView',
  data() {
    return {
      myTasksForNotification: [],
      asignTasksForNotification: [],
      finishedTasks: Number,
      unwatchedTasks: Number
    }
  },
  components: {
    HeaderPart,
    AsidePart
  },
  created() {
    this.getMyTasks();
    this.getTasksSetByMe();
  },
  updated() {
    this.getMyTasks();
    this.getTasksSetByMe();
  },
  methods: {
    getMyTasks: async function () {
      let userId = {id: localStorage.id};
      const response = await fetch(`/api/myTasks`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(userId)
        })
      this.myTasksForNotification = await response.json();
      this.unwatchedTasks = this.countNotViewedTasks().length;
      if (this.unwatchedTasks > 0) {
        document.getElementsByClassName("notification_my_tasks")[0].innerHTML = this.unwatchedTasks;
      } else {
        document.getElementsByClassName("notification_my_tasks")[0].innerHTML = "";
      }
    },
    getTasksSetByMe: async function () { // calls automatically hool crated
      let userId = {id: localStorage.id};
      const response = await fetch(`/api/tasksSetByMe`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(userId)
        })
      this.asignTasksForNotification = await response.json();
      this.finishedTasks = this.finihsedTaskCounter();
      if (this.finishedTasks > 0) {
        document.getElementsByClassName("notification_completed_tasks")[0].innerHTML = this.finishedTasks;
      } else {
        document.getElementsByClassName("notification_completed_tasks")[0].innerHTML = "";
      }
    },
    finihsedTaskCounter: function(){ /// for finished tasks setted by me
      let counter = 0;
      this.asignTasksForNotification.forEach((item) => {
        if (item.status === 'Finished') {
          counter ++
        }
      });
      return counter
    },
    countNotViewedTasks: function() { // показує к-сть непродивлених задач
      return this.myTasksForNotification.filter(function(task){
        return task.isLooked === false
      })
    }
  }
}
</script>

<style media="screen">

</style>
