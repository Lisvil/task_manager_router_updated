<template>
  <div v-if="!loading" class="asigned_tasks_part" >
    <h2>Призначені завдання</h2>
    <!-- <h2>Finished task - {{ finihsedTaskCounter }} </h2> finished task counter -->
    <div class="asigned_tasks">

      <TaskCard  v-for="item in tasksSetByMe" :key="item._id" 
                :taskInfo="item"
                :class="{'finished': item.status == 'Finished'}"
                @commentTask="transferDataToShowForm"
                @editTask="transferDataToForm"
                @deleteTask="deleteTask"/>
    </div>
  </div>
  <LoadingBlock v-if="loading"/>  
</template>
<script>
  import TaskCard from '../TaskCard/TaskCard.vue'
  export default {
    name: 'AsignedTasks',
    props: {
      allUsers: Array,
      newCommentsArr: Object,
      editedTask: Object
    },
    components: {
      TaskCard
    },
    data() {
      return {
        tasksSetByMe: [],
        edit: true,
        counter_completed: '',
        loading: true
        // finihsedNotAccepted: finihsedTaskCounter()
      }
    },
    created() {
      this.loading = true
      this.getTasksSetByMe().then(res => {
        this.tasksSetByMe = res
        this.tasksSetByMe.forEach(task => {
          if (task.performer) {
            let user = this.allUsers.find(u => u._id == task.performer)
            // task.performerName = user.name + " " + user.surname
              task.taskPerformer = {...user}
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },
    updated() {
      this.complexityColor();
      if (parseInt(this.finishedTaskCounter) > 0) {
        document.getElementsByClassName("notification_completed_tasks")[0].innerHTML = this.finishedTaskCounter;
      } else {
        document.getElementsByClassName("notification_completed_tasks")[0].innerHTML = "";
      }
    },
    watch: {
      newCommentsArr: function() {
        if (Object.keys(this.newCommentsArr).length) {
          let task = this.tasksSetByMe.find(f => f._id == this.newCommentsArr.taskId)
          task.comments = JSON.parse(JSON.stringify(this.newCommentsArr.comments))
        }
      },
      editedTask: function() {
        if (Object.keys(this.editedTask).length) {
          // this.tasksSetByMe[this.tasksSetByMe.findIndex(f => f._id == this.editedTask._id)] = structuredClone(this.editedTask)
          this.tasksSetByMe[this.tasksSetByMe.findIndex(f => f._id == this.editedTask._id)] = JSON.parse(JSON.stringify(this.editedTask))

        }
      },
      allUsers: function() {
        this.tasksSetByMe.forEach(task => {
          if (task.performer) {
            let user = this.allUsers.find(u => u._id == task.performer)
              task.taskPerformer = {...user}
          }
        })
      }
    },
    computed: {
      finishedTaskCounter: function(){
        let counter = 0;
        this.tasksSetByMe.forEach((item) => {
          if (item.status === 'Finished') {
            counter ++
          }
        });
        return counter
      }
    },
    methods: {
      transferDataToForm(item) {
        this.$emit('editBtnClick', item)
      },
      transferDataToShowForm(item) {
        this.$emit('commentBtnClick', item);
      },
      getTasksSetByMe()  {
        let userId = localStorage.id;
        return new Promise(  (resolve) => {
           const res =  fetch(`https://task-manager-lzi3.onrender.com/api/tasksSetByMe`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: userId})
          })
          res.then((resp) => resolve(resp.json()))
          })
          .catch(function(error) {
            console.log(error)
          })
      },

      deleteTask: async function(task){
        
        let meta = {
          taskId: {id: task._id}
        }
        /// add for version with employee_workload
        
        // let newWorkload = parseInt(task.taskPerformer.employee_workload) - parseInt(task.complication) 
        // let meta = {}
        // if (task.status !== 'finished') {
        //   meta = {
        //   userObj: {'id': parseInt(task.performer), 'new_employee_workload': newWorkload},
        //   taskId: {id: task._id}
        //   }
        // } else {
        //   meta = {
        //     taskId: {id: task._id}
        //   }
        // }
        this.tasksSetByMe.splice(this.tasksSetByMe.findIndex(f => f._id === task._id), 1)
        await fetch(`https://task-manager-lzi3.onrender.com/api/deleteTask`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(meta)
          })
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
