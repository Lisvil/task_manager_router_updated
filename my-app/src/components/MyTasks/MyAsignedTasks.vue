<template lang="html">
  <div>
    <div v-if="!loading" class="asigned_tasks">
      <!-- <h2>Counter. Tasks not viewed - {{ countNotViewedTasks.length }}</h2>  показує к-сть непродивлених задач -->
      <template v-for="item in myTasks" v-bind:key="item._id"  >
        <div v-if="item.status !== 'Finished'" 
            class="asigned_task"   
            :class="{'new_task': !item.isLooked,
                    'asigned_task-deadline_danger' : taskDeadline(item.deadline) <= 2,
                    'asigned_task-deadline_warning': taskDeadline(item.deadline) < 5 && taskDeadline(item.deadline) > 2}"
          >
          <div class="asigned_task__header">
            <div class="task__header-container">
              <div  class="asigned_task-staus"> Task status - {{ item.status }}</div> 
              <!-- <div v-if="!item.isLooked" class="asigned_task-staus"> Task status - {{ item.status }}</div>             -->
              <div class="asigned_task__complexity ml-auto">{{ item.complication }}</div>
            </div>
          </div>
          <div class="asigned_task__body">
            <div class="asigned_task__name"> <h4>{{ item.title }} </h4> </div>
            <p class="asigned_task_text">{{ item.taskDescription }}</p>
            <div v-if="item.deadline" class="asigned_task__deadline"><i class="fas fa-calendar-week"> </i> {{ item.deadline}} </div>
            <div class="asigned_task__asigned-by"><i class="fas fa-user"> </i> {{ creatorName(item.creator) }}</div>
            <div class="asigned_task__buttons">
              <button class="show_btn" @click='transferDataToShowForm(item); '><i class="fas fa-eye"></i></button>
              <div class="coments_icon"><i class="fas fa-comment-dots"> </i> <span>({{ item.comments.length }})</span></div>
              <div class="buttons_container">
                <div v-if="item.status === 'New'" class="button_start btn" @click="changeTaskStatus(item)">
                    Start
                </div>
                <button v-else id="done_btn" @click='completeTask(item)'><i class="far fa-check-circle"></i></button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <LoadingBlock v-if="loading"/> 
  </div>
</template>

<script>
export default {
  name:'MyAsignedTasks',
  props: {
    allUsersArr: Array,
    newCommentsArr: Object
  },
  data: function(){
    return {
      myTasks: [],
      allUsers: this.allUsersArr,
      loading: false
    }
  },
  watch: {
    newCommentsArr: function() {
      if (Object.keys(this.newCommentsArr).length) {
        let task = this.myTasks.find(f => f._id == this.newCommentsArr.taskId)
        task.comments = structuredClone(this.newCommentsArr.comments)
      }
    },
  },
  created: function(){
    this.getMyTasks()
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
    this.complexityColor();
    if (this.countNotViewedTasks.length > 0) {
      document.getElementsByClassName("notification_my_tasks")[0].innerHTML = this.countNotViewedTasks.length;
    } else {
      document.getElementsByClassName("notification_my_tasks")[0].innerHTML = "";
    }

  },
  methods: {
    getMyTasks: async function () {
      this.loading = true
      let userId = {id: localStorage.id};
      const response = await fetch(`/api/myTasks`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(userId)
        })
      this.myTasks = await response.json();
      this.myTasks.forEach(task => {
        const user = this.allUsers.find(u => u._id == task.performer)
        if (user) {
          task.taskPerformer = user
        }
      })
      this.loading = false
    },
    creatorName(id) {
      const creator = this.allUsers.find(f => f._id == id)
      return creator ? creator.name + ' ' + creator.surname : ''
    },
    transferDataToShowForm: async function(item) {
      if(!item.isLooked) {
        if (this.countNotViewedTasks.length > 0) {
          document.getElementsByClassName("notification_my_tasks")[0].innerHTML = (this.countNotViewedTasks.length - 1);
        } else {
          document.getElementsByClassName("notification_my_tasks")[0].innerHTML = "";
        }
      }
      item.performerWatch = true;
      item.isLooked = true
      this.$emit('watchBtnClick', item);
  // change isLooked to TRUE
      let taskToUpdate = { "_id": item._id}

      await fetch(`/api/markAsLooked`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(taskToUpdate)
        })
    },

    completeTask: async function(task){
      this.loading = true
      let newWorkload = parseInt(task.taskPerformer.employee_workload) - parseInt(task.complication) 
      let meta = {
        taskId: { "_id": task._id},
        userObj: {'id': parseInt(task.performer), 'new_employee_workload': newWorkload},
      }
      await fetch(`/api/finishTask`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(meta)
        })
      // document.location.reload()
      this.$router.go()
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
    changeTaskStatus: async function(task) {
      task.status = 'In progress'
      let meta = {
          taskObj: {
            _id: task._id,
            status: task.status
          }
        }
        await fetch('/api/changeStatus', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(meta)
        })
    },
    taskDeadline(date) {
      if (date) {
        let currentDate = new Date() 
        let deadline = new Date (date)
        let time_line = parseInt(((deadline.getTime() - currentDate.getTime()) / (1000*60*60*24)).toFixed()) + 1 
        return time_line
      } else 
        return 100
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

<style lang="scss" scoped>
  .asigned_task-deadline_danger {
    box-shadow: 0 0 10px #f90000b8;
    background: #ffb4b454;
    :deep(.asigned_task__deadline) {
      color: #df0202;
      i {
        color: #df0202!important;
      }
    }
  }
  // .asigned_task-deadline_warning {
  //   box-shadow: 0 0 10px #ffe9c3e3;
  //   background: #ffe9c3e3;
  // }

</style>
