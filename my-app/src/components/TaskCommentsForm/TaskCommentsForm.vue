<template lang="html">
  <div class="comment_form">
      <div class="comments_part">
        <div v-for="(comment, index) in taskCommentsArr" :key="index" class="comment">
          <p class="user_author">{{ comment.userName }}</p>
          <div class="comment_text">{{ comment.comment }}</div>
        </div>
      </div>
      <div class="add_comment">
        <form class="add_comment_form">
          <textarea placeholder="Введіть текст" v-model="userComments"></textarea>
          <button class="add_comment_btn" @click="addComment">Додати</button>
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
      taskCommentsArr: Array
    }
  },

  watch: {
    taskComments: function() {
      this.taskCommentsArr = this.taskComments;
    },

  },
  methods: {
    addComment: async function (e) {
      e.preventDefault();
      console.log(this.userComments);
      this.taskCommentsArr.push( /// this.taskComments
        {userName: localStorage.name,
         comment: this.userComments}
      );
      this.userComments = '';

      let commentsToUpdate = { "_id": this.taskId, comments: this.taskCommentsArr};
      console.log(toString(this.taskId));
      console.log(commentsToUpdate);

      await fetch(`/api/addComment`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(commentsToUpdate)
        })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
