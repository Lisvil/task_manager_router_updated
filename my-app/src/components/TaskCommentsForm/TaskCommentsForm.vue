<template lang="html">
  <div class="comment_form">
      <div class="comments_part">
        <div v-for="(comment, index) in taskCommentsArr" :key="index" class="comment">
          <p class="user_author">{{ comment.userName }} </p>
          <div class="comment_text">{{ comment.comment }} </div>
        </div>
      </div>
      <div class="add_comment">
        <form class="add_comment_form">
          <textarea placeholder="Введіть текст" v-model="userComments"></textarea>
          <button class="add_comment_btn" @click="addComment" :disabled="!userComments.length">
            <template v-if="!btnLoading">
                Додати
            </template>
            <b-spinner v-else variant="light" small></b-spinner>
          </button>
        </form>
      </div>
    </div>
</template>
<script>
export default {
  name: 'MyTasksCommentsForm',
  props: {
    taskComments: Array,
    taskId: Number,
  },
  data() {
    return {
      userComments: '',
      taskCommentsArr: [],
      btnLoading: false
    }
  },
  created() {
    // this.taskCommentsArr = structuredClone(this.taskComments)
    this.taskCommentsArr = JSON.parse(JSON.stringify(this.taskComments))
    
  },
  methods: {
    addComment: async function (e) {
      this.btnLoading = true
      e.preventDefault();
      // let meta = structuredClone(this.taskCommentsArr)
      let meta = JSON.parse(JSON.stringify(this.taskCommentsArr))
      
      meta.push( /// this.taskComments
        {userName: localStorage.name,
         comment: this.userComments}
      );
      this.userComments = '';

      let commentsToUpdate = { "_id": this.taskId, comments: meta};

      await fetch(`https://task-manager-lzi3.onrender.com/api/addComment`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(commentsToUpdate)
        })
      this.btnLoading = false
      this.taskCommentsArr = meta
      let newComments = {
        comments: this.taskCommentsArr,
        taskId: this.taskId
      }
      this.$emit('newComments', newComments)

    }
  }
}
</script>

<style lang="css" scoped>
</style>
