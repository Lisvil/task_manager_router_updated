<template>
      <div class="setting-tasks">
        <div v-if="!loading">
          <SetTaskForm  v-if="openForm"     
                        :editInfo="dataForEditForm" 
                        :editMode="edit"
                        :allUsers="allUsersArr"
                        @editTaskObj="handleEditTask" 
                        @close="closeForm"/>
          <ShowTaskForm v-if="show" 
                        :info="infoToShowForm" 
                        :users="allUsersArr" 
                        :commentMode='commentTask'
                        @newComments="newCommentsNumber"      
                        @close="show=false"/>
          <div class="tasks_asign">
            <div class="set_task_btn">
              <button  v-if="!show_kanban" id="set_task" @click="openForm = true">Призначити завдання</button>
              <div v-if="!show_kanban" class="set_tasks__control-button btn mb-2"    
                  @click="show_kanban = true">Kanban board </div>
              <!-- <span v-if="!show_kanban" class="my_tasks__control-hint">Click to switch to kanban view</span> -->
              <div v-else class="set_tasks__control-button btn mb-2" 
                    @click="switchToCards">Switch to cards view</div>
            </div>
            <AsignedTasks v-if="!show_kanban"
                          :allUsers="allUsersArr"
                          :newCommentsArr="comments"
                          :editedTask="editedTask"  
                          @commentBtnClick="transferDataToShowForm($event)"
                          @editBtnClick="transferDataForEdit"
                          @refreshUsers="handleRefreshUsers"/>
            <KanbanBoard v-if="show_kanban" 
                          :allUsers="allUsersArr"
                          :creatorMode="true"
                          />                   
          </div> 
        </div>
        <LoadingBlock v-if="loading"/>             
      </div>
</template>
<script>
  import SetTaskForm from './SetTaskForm.vue'
  import AsignedTasks from './AsignedTasks.vue'
  import ShowTaskForm from '../ShowTaskForm/ShowTaskForm.vue'
  import KanbanBoard from '../Kanban/KanbanBoard.vue';

  export default {
    name: 'SetTask',
    components: { 
      SetTaskForm, 
      AsignedTasks, 
      ShowTaskForm, 
      KanbanBoard
    },
    data() {
      return {
        allUsersArr: [],
        infoToShowForm: {},
        dataForEditForm: {},
        edit: false,
        show: false,
        openForm: false,
        loading: false,
        commentTask: false,
        comments: {},
        editedTask: {},
        show_kanban: false
      }
    },
    created() {
      this.showAllUsers()
    },
    methods: {
      showAllUsers: async function () {
        this.loading = true
        const response = await fetch('/api/allUsers');
        this.allUsersArr = await response.json();
        this.allUsersArr.sort((a, b) => {
          return a._id - b._id
        })
        this.loading = false
      },
      transferDataToShowForm(event) {
        this.infoToShowForm = event;
        this.show = true
        this.commentTask = true

      },
      transferDataForEdit(event) {
        this.dataForEditForm = event;
        this.openForm = true
        this.edit = true
      },
      newCommentsNumber(e) {
        this.comments = e
      },
      handleEditTask(e) {
        this.editedTask = e
      },
      closeForm() {
        this.openForm = false 
        this.edit = false
        this.dataForEditForm = {},
        this.infoToShowForm = {}       
      },
      handleRefreshUsers() {
        this.showAllUsers()
      },
      switchToCards() {
        this.show_kanban = false
      }
    }
  }


</script>
<style lang="scss" scoped>
.set_task_btn {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  button {
    display: block;
    margin-right: 10px;
  }
}
.setting-tasks{
  height: 100%;
}
.set_tasks__control-button {
  padding: 10px;
  background: #3f4df3a1;
  color: #fff;

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