<template>
    <div v-if="!loading" class="kanban__container">
      <div v-if="isAdmin" class="kanban__settings"> 
        <div class="btn kanban__settings-btn" @click="showSettings = true"><i class="fa-solid fa-gear fa-beat"></i></div>
      </div>
      <div class="kanban__board">
      <div class="row text-right"> 
        <div class="btn btn-sucess " @click="showSettings = true"><i class="flaticon-settings-1 p-0"></i></div>
      </div>
      <draggable class="dragArea w-full kanban__row" 
                :list="kanban.statuses" 
                group="statuses"
                ghost-class="ghost"
                @start="drag=true"
                @end="drag=false">
        <div class="kanban__column" v-for="(column, index) in kanban.statuses" :key="index">
          <div class="column__title" :style="'background:' + column.background"> 
            {{ column.title }}
          </div>
          <div class="column__body">
            <draggable
                :title="column.title"  
                :list="column.items" 
                group="tasks"
                ghost-class="ghost"
                class="column__body-container"
                @change="changeOrderPosition"
                @start="drag=true"
                @add="addElementToColumn"
                @end="drag=false;"> 
                <div class="column__task" :id="task._id" v-for="task in column.items" :key="task._id">

                    <div class="pl-3 pr-3 mb-2">
                      <div class="column__task-complication" :style="'background:' + getColor(task.complication) + ';'"></div>
                      <div class="column__task-title">{{ task.title }}</div>
                      <div v-if="task.deadline" class="column__task-deadline"> 
                        <i class="fa-solid fa-calendar-days"></i> {{ task.deadline }}
                      </div>
                      <div class="column__task-user">
                        <div v-if="creatorMode">
                          <i class="fa-solid fa-user"></i> {{ task.taskPerformer.name }} {{ task.taskPerformer.surname }}
                        </div>
                        <div v-else>
                          <i class="fa-solid fa-user"></i> {{ task.taskCreator.name }} {{ task.taskCreator.surname }}
                          
                        </div>
                      </div>
                    </div>
                    <!-- <div class="order__progress" 
                      :style="'width:' + showProgress(order.timer) + '%'"
                      :class="{'bg-success': showProgress(order.timer) <= 50,
                      'bg-warning': showProgress(order.timer) > 50 && showProgress(order.timer) < 80}">
                    </div> -->
                  </div>
            </draggable>            
          </div>
        </div>
      </draggable>
      </div>
      <KanbanSettingsModal v-if="showSettings" 
                          :kanban="this.kanban"
                          @saveKanban="changeKanban"
                          @cancel="showSettings = false"/>
    </div>
    <LoadingBlock v-if="loading"/> 
</template>
<script>

import {VueDraggableNext} from "vue-draggable-next";
import KanbanSettingsModal from "./KanbanSettingsModal.vue"
  export default {
    name: 'KanbanBoard',
    components: {
      'draggable': VueDraggableNext,
      KanbanSettingsModal
    },
    props: {
      allUsers: Array,
      creatorMode: Boolean
    },
    data() {
      return {
        kanban: {},
        drag: false,
        showSettings: false,
        loading: false,
        tasks: [],
        complicationColors: [
          {color: '#6bdfe3', id: '1'},
          {color: '#75ff69', id: '2'},
          {color: '#fae55f', id: '3'},
          {color: '#f79659', id: '4'},
          {color: '#ff91c5', id: '5'},
          {color: '#f76459', id: '6'},
        ],
        workload: null,
        isAdmin: localStorage.getItem("isAdmin")

      }
    },
    created() {
      this.getKanban()
      let user = this.allUsers.find(u => u._id == localStorage.getItem("id"))
      this.workload = user.employee_workload
    },
    methods: {
      disabledTask(status) {
        console.log(status)
        // return {pointerEvents: status === 'Finished' ? 'none' : 'auto'}
      },
      getColor(id) {
        return this.complicationColors.find(f => f.id == id).color || '#333'
      },
      getKanban: async function() {
        this.loading = true
        // const response = await fetch (`/api/kanban`)
        const response = await fetch (`https://task-manager-lzi3.onrender.com/api/kanban`)

        this.kanban = await response.json();
        this.kanban.statuses.forEach(s => {
          s.items = []
        })
        // console.log(this.kanban) 
        if (this.creatorMode) {
          this.getTasksSetByMe().then(res => {
            this.tasks = res
            this.tasks.forEach(task => {
              if (task.performer) {
                let user = this.allUsers.find(u => u._id == task.performer)
                // task.performerName = user.name + " " + user.surname
                task.taskPerformer = {...user}
                this.kanban.statuses.forEach(s => {
                  if (task.status === s.title) {
                    s.items.push(task)
                  }
                })
              }
            })
          }).finally(() => {
            this.loading = false
          })
        } else {
          this.getMyTasks()
        }
      },
      getMyTasks: async function () {       
        let userId = {id: localStorage.id};
        // https://task-manager-lzi3.onrender.com
        const response = await fetch(`https://task-manager-lzi3.onrender.com/api/myTasks`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userId)
          })
        this.tasks = await response.json();
        this.tasks.forEach(task => {
          const user = this.allUsers.find(u => u._id == task.creator)
          if (user) {
            task.taskCreator = user
          }
        })
        this.tasks.forEach(task => {
          this.kanban.statuses.forEach(s => {
            if (task.status === s.title) {
              s.items.push(task)
            }
          })
        })
        // this.kanban.statuses.forEach(s => {
        //   s.items = this.myTasks.filter(t => t.status === s.title)
        // })
        this.loading = false
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
      addElementToColumn: async function(e) {    /// function for moving order between columns
        const column = e.to.title
        let el = e.item._underlying_vm_ // get order object or use e.item.id
        el.status = column
        let meta = {
          taskObj: {
            _id: el._id,
            status: column
          }
        }
        // if (column === 'Finished') {
        //   let newWorkload = parseInt(this.workload) - parseInt(el.complication) 
        //   let meta = {
        //     taskId: { "_id": el._id},
        //     userObj: {'id': parseInt(el.performer), 'new_employee_workload': newWorkload},
        //   }
        //   await fetch(`/api/finishTask`, {
        //       method: 'POST',
        //       headers: {'Content-Type': 'application/json'},
        //       body: JSON.stringify(meta)
        //     })

        // } else {
          // await fetch('/api/changeStatus', {
          //   method: 'POST',
          //   headers: {'Content-Type': 'application/json'},
          //   body: JSON.stringify(meta)
          // })
        // }
        await fetch('https://task-manager-lzi3.onrender.com/api/changeStatus', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(meta)
          })
      },
      changeKanban(e) {
        this.kanban.statuses = e
      }
    }
  }
</script>
<style lang="scss">
  .kanban__container {
    width: 100%;
  }
  .kanban__settings-btn {
    cursor: pointer!important;
    margin-left: auto;
    margin-bottom: 10px;
    i {
      font-size: 20px;
      font-weight: bold!important;
    }
    &:hover {
      background-color: #5d78ff3d;   
    }
  }
  .kanban__row {
    display: flex;   
    overflow-x: scroll; 
    padding-bottom: 40px;
    // padding: 10px 0 40px 0;
  }
  .kanban__column  {
    min-width: 350px;
    padding: 0;
    margin: 0 10px;
    min-height: 200px;
    height: min-content;
    border-radius: 10px;
    max-width: 400px;
    background: #fff;
    background: #f2f2f2;
    box-shadow: 0 0 10px rgba(189, 189, 189, 0.96);
  }

  .column__title {
    border-radius: 10px 10px 0 0;
    text-align: center;
    padding: 8px 0;
    color: #fff;
    font-weight: 700;
    // background: #5463e296;
  }
  .column__body::-webkit-scrollbar {
    display: none
  }
  .column__body {
    padding: 10px;
    min-height: 200px;
    height: min-content;
    max-height: 60vh;
    scrollbar-width: none;
    overflow: -moz-scrollbars-none;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .column__body-container {
    min-height: 200px;
    .column__task {
      // border: 1px solid #ccc;
      box-shadow: 0 0 7px #a9a9a982;
      padding: 10px 0 5px 0;
      // background: #f5f5f5;
      background: #fff;
      // background: #fdfdfd;
      // color: #000;
      border-radius: 10px;
      margin-bottom: 10px; 
      color: #7c7c7c;
      cursor: pointer;
      border: 1px solid #e4e4e4;
      font-size: 0.9rem; 
    }
  }
  .column__task-complication {
    width: 40px;
    height: 8px;
    border-radius: 8px;
    margin-bottom: 5px; 
  }
  .column__task-title {
    font-size: 18px;
    color: #3f3f3f;
    // color: #000;
  }
// .column__task-deadline {
//   box-shadow: 0 0 5px #ff1717f5;
//   background: #ffeaea!important ;
//   animation: animate 1s linear infinite alternate; 
// }
// @keyframes animate {
//   0% {
//     box-shadow: 0 0 0px #ff1717f5;
//   }
//   100% {
//     box-shadow: 0 0 7px #ff1717f5;
//   }
// }
.order__customer {
  font-weight: 700;
  font-size: 0.9rem;   
  color: #000;
  i {
    color: #7c7c7c;
  } 
}
.creator_mode {
  pointer-events: none;
}
.kanban__settings {
  position: absolute;
  top: 42px;
  right: 0;
  padding: 0 60px;
  text-align: end;
}
.kanban__settings-btn {
  background: #b4c8ff;
  color: #4b5684eb;
  padding: 10px 15px;
  line-height: 10px;
  &:hover {
    background: #94a5d3;
    color: #323a58eb;
  }
}
</style>