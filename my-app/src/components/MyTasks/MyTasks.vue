<template lang="html">
  <div class="my_tasks_part">
    <ShowTaskForm :info = "infoToShowForm" />
    <MyAsignedTasks v-on:watchBtnClick="transferDataToShowForm($event)"></MyAsignedTasks>
  </div>
</template>

<script>
import ShowTaskForm from '../ShowTaskForm.vue';
import MyAsignedTasks from './MyAsignedTasks.vue';


export default {
  name:'MyTasks',
  data() {
    return {
      infoToShowForm: [],
    }
  },
  components: { ShowTaskForm, MyAsignedTasks}, // MyTasksCommentsForm
  mounted() {
  },
  methods: {
    transferDataToShowForm(event) {
      this.infoToShowForm = event;
      console.log("Emit received");
      console.log(event);
    }
  }

}
</script>

<style lang="css" scoped>
</style>
