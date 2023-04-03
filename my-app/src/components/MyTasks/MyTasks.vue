<template lang="html">
  <div >
    <div v-if="!show_kanban" class="my_tasks__control-button btn ml-auto mb-2" @click="show_kanban = true">Kanban board </div>
    <!-- <span v-if="!show_kanban" class="my_tasks__control-hint">Click to switch to kanban view</span> -->
    <div v-if="show_kanban" class="my_tasks__control-button btn ml-auto mb-2" @click="switchToCards">Switch to cards view</div>
    <div class="my_tasks_part" v-if="!loading">
        <ShowTaskForm v-if="show" :info="infoToShowForm" 
        :users="allUsers"  
        @newComments="newCommentsNumber" 
        @close="closeForm"/>
        <MyAsignedTasks v-if="!show_kanban"
        :allUsersArr="allUsers" 
        :newCommentsArr="comments"
        @watchBtnClick="transferDataToShowForm($event)" />
        <KanbanBoard v-if="show_kanban" :allUsers="allUsers"/>                
      </div>
    <LoadingBlock v-if="loading"/> 
  </div>
</template>

<script>
import ShowTaskForm from '../ShowTaskForm/ShowTaskForm.vue';
import MyAsignedTasks from './MyAsignedTasks.vue';
import KanbanBoard from '../Kanban/KanbanBoard.vue';
export default {
  /*eslint-disable*/
  name:'MyTasks',
  data() {
    return {
      infoToShowForm: {},
      show: false,
      allUsers: [],
      loading: false,
      comments: {},
      show_kanban: false  
    }
  },
  components: { ShowTaskForm, MyAsignedTasks, KanbanBoard}, // MyTasksCommentsForm
  created() {
    this.showAllUsers()
  },
  methods: {
    showAllUsers: async function () {
        this.loading = true
        const response = await fetch('/api/allUsers');
        this.allUsers = await response.json();
        this.allUsers.sort((a, b) => {
          return a._id - b._id
        })
        this.loading = false
      },
    switchToCards() {
      // this.showAllUsers()
      this.show_kanban = false
    },  
    transferDataToShowForm(event) {
      this.show = true
      this.infoToShowForm = event;
    },
    newCommentsNumber(e) {
        this.comments = e
    },
    closeForm() {
        this.show = false
        this.infoToShowForm = {}       
      },

  }

}
</script>

<style lang="scss" scoped>
  .my_tasks__control-button {
    background: #3f4df3a1;
    color: #fff;
    cursor: pointer;
    &:hover {
      background: darken(#3f4df3a1, 20);
    }
    animation: animate 1s linear infinite alternate;

  }
  .my_tasks__control-hint {
    width: 100px;
    border: 1px solid red;
  }
  @keyframes animate {
    0% {
      box-shadow: 0 0 10px transparent;
    }
    100% {
      box-shadow: 0 0 10px #313dc0;
    }
    
  }
</style>
