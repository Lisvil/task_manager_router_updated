<template>
  <div id="show_form" class="form_bg">
    <div class="set_task_form">
      <form action="api/createTask" method="post" class="form" :class="{read_only: readOnly }">
        <div class="set_task_form__header">
          <h4>Поточне завдання</h4>
          <input name="creator" v-bind:value='creator_id' style="display:none">
          <div class="show_task_form__close_btn comments_form_btn_close" @click="$emit('close')" >X</div> 
        </div>
        <input type="text" class="set_task_form__name" placeholder="Назва задачі" name="title"  v-model='task.title'>
        <div class="set_task_form__details">
          <div class="set_task_form__deadline">
            <span>Термін</span>
            <input type="date" id="deadline" name="deadline"  v-model='task.deadline'>
          </div>
          <div class="set_task_form__complication">
            <span>Складність</span>
            <select name="complication" id="complication" v-model='task.complication'>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>
        </div>
        <div class="set_task_form__description">
          <p>Опис завдання</p>
          <textarea name="taskDescription" rows="8" cols="80" v-model='task.taskDescription'></textarea>
        </div>
        <div class="set_task_form__performer" v-if='!task.performerWatch'>
          <span >Виконавець</span>
          <select name="performer" id="performer" v-model='task.performer'>
            <option v-for="user in usersArray" v-bind:key="user._id" v-bind:value="user._id">{{user.name}}</option>
          </select>
        </div>
        <div class="set_task_form__performer" v-else>
          <span>Постановник</span>
          <span class="creator_name" >
            {{ creatorName()}}
          </span>
        </div>
        <div class="set_task_form__asign" v-if="!commentMode">
            <div id="asign_notice"></div>
            <button id="set_task_form__asign_btn" @click='completeTask' onclick="event.preventDefault()">
              <template v-if="!btnLoading">
                Виконано
              </template>
              <b-spinner v-else variant="light" small></b-spinner>
            </button>
        </div>
      </form>

  </div>
  <MyTasksCommentsForm :taskComments="task.comments" 
                       :taskId="task._id"
                       @newComments="(e) => $emit('newComments', e)"/>
</div>
</template>
<script>
  import MyTasksCommentsForm from '../TaskCommentsForm/TaskCommentsForm.vue';
  export default {
    name: 'ShowTaskForm',
    data() {
      return {
        taskComments: [],
        readOnly: true,
        taskPerformerComment: '',
        taskPerformerName: '',
        usersArray: this.users,
        task: {},
        btnLoading: false
      }
    },
    components: {
      MyTasksCommentsForm
    },
    props: {
      info: Object, // for test $emit event from parent component
      users: Array,
      commentMode: Boolean
    },
    created() {
      this.task = structuredClone(this.info)
    },
    methods: {
      creatorName() {
        const creator = this.usersArray.find(f => f._id == this.task.creator)     
        return  creator ? creator.name + ' ' + creator.surname : ''
      },
      completeTask: async function(){
        this.btnLoading = true
        let newWorkload = parseInt(this.task.taskPerformer.employee_workload) - parseInt(this.task.complication) 
        let meta = {
          taskId: { "_id": this.task._id},
          userObj: {'id': parseInt(this.task.performer), 'new_employee_workload': newWorkload},
        }
        console.log(meta)
        await fetch(`https://task-manager-lzi3.onrender.com/api/finishTask`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(meta)
          })
        // document.location.reload()
        this.$router.go()
      }
    }
  }
</script>
<style>
.comments_form_btn_close {
  background: #6a9ce6;
  padding: 3px 5px;
  cursor: pointer;
  border: 0px;
  border-radius: 5px;
  color: #fff;
}
.comments_form_btn_close:hover {
  transition: all 0.2s ease;
  background: #4582de;
}
.creator_name {
  color: #666666!important;
}
</style>
