<template>
  <div class="asigned_tasks_part">
    <h2>Призначені завдання</h2>
    <!-- <h2>Finished task - {{ finihsedTaskCounter }} </h2> finished task counter -->
    <div class="asigned_tasks">

      <div class="asigned_task" v-for="item in tasksSetByMe" v-bind:key="item._id" v-bind:class="{'finished': item.status == 'finished'}">
        <div class="asigned_task__header">

          <p>Task status - {{ item.status }}</p>  <!-- task status for tests -->
          <div class="asigned_task__complexity">{{ item.complication }}</div>
          <div class="asigned_task__name"><h3>{{ item.title }} </h3></div>
        </div>
        <div class="asigned_task__body">
          <p class="asigned_task_text">{{ item.taskDescription }}</p>
          <div class="asigned_task__deadline"><i class="fas fa-calendar-week"></i> {{ item.deadline}}</div>
          <div class="asigned_task__asigned-by"><i class="fas fa-user"></i>{{ allUsers[item.performer-1].name}} </div>

          <div class="asigned_task__buttons">
            <button class="comment_btn" @click='transferDataToShowForm(item)'><i class="fas fa-comments"></i><span>({{ item.comments.length }})</span></button>
            <button class="edit_btn" @click='transferDataToForm(item)'><i class="fas fa-edit"></i></button>
            <button id="delete_btn" @click='deleteTask(item._id)'><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
<script>

  export default {
    name: 'AsignedTasks',
    data() {
      return {
        tasksSetByMe: [],
        edit: true,
        counter_completed: ''
        // finihsedNotAccepted: finihsedTaskCounter()
      }
    },

    props: {
      allUsers: Array
    },
    created: function() {
      this.getTasksSetByMe()
    },
    updated: function() {
      this.complexityColor();
      console.log(this.finishedTaskCounter);
      this.complexityColor();
      if (parseInt(this.finishedTaskCounter) > 0) {
        document.getElementsByClassName("notification_completed_tasks")[0].innerHTML = this.finishedTaskCounter;
      } else {
        document.getElementsByClassName("notification_completed_tasks")[0].innerHTML = "";
      }
    },
    mounted() {
    },
    computed: {
      finishedTaskCounter: function(){
        let counter = 0;
        this.tasksSetByMe.forEach((item) => {
          if (item.status === 'finished') {
            counter ++
          }
        });
        return counter
      }
    },
    methods: {
      transferDataToForm: function(item) {
        item.edit = true;
        document.querySelector("#set_form").classList.add("flex");
        this.$emit('editBtnClick', item); // just commented
      },
      transferDataToShowForm: function(item) {
        item.readOnly = true;
        item.allUsers = this.allUsers;
        this.$emit('commentBtnClick', item);
        document.querySelector("#show_form").classList.add("flex");


      },
      getTasksSetByMe: async function () { // calls automatically hool crated
        let userId = {id: localStorage.id};
        const response = await fetch(`/api/tasksSetByMe`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userId)
          })
        this.tasksSetByMe = await response.json();
      },
      deleteTask: async function(itemId){
        console.log('deleteTask func started. Task id - ' + itemId);
        let taskId = {id: itemId};
        await fetch(`/api/deleteTask`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(taskId)
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
      },
  }
}
</script>
<style>
</style>
