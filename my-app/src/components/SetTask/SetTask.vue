<template>
      <div class="main-part">
        <SetTaskForm v-bind:allUsers="allUsersParent" :editInfo="dataForEditForm"/>
        <ShowTaskForm :info = "infoToShowForm"/>
        <!-- <SetTaskCommentsForm/> -->
        <div class="tasks_asign">
          <div class="set_task_btn">
            <button id="set_task">Призначити завдання</button>
          </div>
          <AsignedTasks v-bind:allUsers="allUsersParent" v-on:commentBtnClick="transferDataToShowForm($event)" v-on:editBtnClick="transferDataForEdit($event)"/>
        </div>
      </div>
</template>
<script>
  import SetTaskForm from './SetTaskForm.vue'
  import AsignedTasks from './AsignedTasks.vue'
  import ShowTaskForm from '../ShowTaskForm.vue'

  export default {
    name: 'SetTask',
    data: function(){
      return {
        allUsersParent: [],
        infoToShowForm: [],
        dataForEditForm: []
      }
    },
    components: { SetTaskForm, AsignedTasks, ShowTaskForm, }, // SetTaskCommentsForm
    created: function() {
      this.showAllUsers()
    },
    mounted() {

      document.querySelector("#set_task").onclick = () => {
        document.querySelector("#set_form").classList.add("flex");
      }
      // $(".set_task_form__close_btn").on('click', function(){
      //   $("#set_form").removeClass("flex");
      //   // $("#set_task_form__asign_btn").text("Призначити");
      //   $(".form").removeClass("read_only");
      //   $(".set_task_form__name").attr("disabled", false);
      // })
      // $(".edit_btn").on('click', function() {
      //   $("#set_form").addClass("flex");
      //   // $("#set_task_form__asign_btn").text("Змінити");
      // })
    },
    methods: {
      showAllUsers: async function () {
        const response = await fetch('/api/allUsers');
        this.allUsersParent = await response.json();
        this.allUsersParent.sort((a, b) => {
          return a._id - b._id
        })
      },
      transferDataToShowForm(event) {
        this.infoToShowForm = event;

      },
      transferDataForEdit(event) {
        this.dataForEditForm = event;
      }
    }
  }


</script>
