<template>
        <div class="asigned_task">
        <div class="asigned_task__header">
          <div class="task__header-container">
            <p>Task status - {{ taskInfo.status }}</p>              
            <div class="asigned_task__complexity">{{ taskInfo.complication }}</div>
          </div>
        </div>
        <div class="asigned_task__body">
          <div class="asigned_task__name"><h4>{{ taskInfo.title }} </h4></div>
          <p class="asigned_task_text">{{ taskInfo.taskDescription }}</p>
          <div class="asigned_task__deadline"><i class="fas fa-calendar-week"></i> {{ taskInfo.deadline}}</div>
          <div class="asigned_task__asigned-by"><i class="fas fa-user"></i>{{ taskInfo.taskPerformer.name}} {{ taskInfo.taskPerformer.surname }} </div>

          <div class="asigned_task__buttons">
            <button v-if="taskInfo.status !== 'Finished'" class="comment_btn" @click=commentTask><i class="fas fa-comments"></i><span>({{ taskInfo.comments.length }})</span></button>
            <button v-if="taskInfo.status !== 'Finished'" class="edit_btn" @click=editTask><i class="fas fa-edit"></i></button>
            <button id="delete_btn" @click='deleteTask(taskInfo)'><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>

      </div>
</template>
<script>
  export default {
    name: 'TaskCard',
    props: {
      taskInfo: Object
    },
    methods: {
      commentTask() {
        this.$emit('commentTask', this.taskInfo)
      },
      editTask() {
        this.$emit('editTask', this.taskInfo)
      },
      deleteTask(task) {
        this.$emit('deleteTask', task)
      }
    }
  }
</script>