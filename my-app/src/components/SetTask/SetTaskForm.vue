<template>
  <div id="set_form" class="form_bg">
    <div class="set_task_form">
      <form  id="resForm" class="form">
        <div class="set_task_form__header">         
          <h4 v-if='edit' class="m-0">Редагування завдання</h4>
          <h4 v-else class="m-0">Нове завдання</h4>
          <input name="creator" v-model="task.creator" style="display:none">
          <div class="set_task_form__close_btn" @click="$emit('close')" >X</div>
        </div>
        <input type="text" class="set_task_form__name" placeholder="Назва задачі" name="title"  v-model='task.title' :class="{invalid_input: error && !task.title}">
        <div class="set_task_form__details">
          <div class="set_task_form__deadline">
            <span>Термін</span>
            <input type="date" id="deadline" name="deadline"  v-model='task.deadline'>
          </div>
          <div class="set_task_form__complication">
            <span>Складність</span>
            <!-- <select name="complication" id="complication" v-model='task.complication' @change="checkEmployeeWorkload" :disabled="loading" :class="{invalid_input: error && !task.complication}">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select> -->
            <select name="complication" id="complication" v-model='task.complication'  :disabled="loading" :class="{invalid_input: error && !task.complication}">
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
        <div class="set_task_form__performer">
          <span>Виконавець</span>
          <select v-if="!loading" name="performer" id="performer" v-model='task.performer' @change="changePerformer" :class="{invalid_input: error && !task.performer}">
            <option v-for="user in allUsers" :key="user._id" :value="user._id">{{user.name}}</option>
          </select>
          <b-spinner v-else variant="secondary" small></b-spinner>
        </div>
        <div v-if="error && (!task.performer || !task.complication || !task.title)" class="text-danger mb-2">Заповніть обов'язкові поля</div>
        <div class="set_task_form__asign">
            <div v-if="!loading && workload > 20" class="asign_notice">Завдання такої складності перенавантажить працівника, і може бути виконане не вчасно. <p> Для виконання даного завдання Ви можете обрати іншого. 
              <span v-if="getAltertnativeUser">
                Наприклад - {{ getAltertnativeUser }}
              </span>
              </p>
            </div>
            <template v-if="!edit">
              <button id="set_task_form__asign_btn" v-if='!edit'  @click='createTask' onclick="event.preventDefault()">
                <template v-if="!btnLoading">
                  Призначити
                </template>
                <b-spinner v-else variant="light" small></b-spinner>
              </button>
            </template>
            <button v-else id="set_task_form__asign_btn" type="button"  
                    @click='editTask' onclick="event.preventDefault()">
              <template v-if="!btnLoading">
                Редагувати
              </template>
              <b-spinner v-else variant="light" small></b-spinner>
            </button>
        </div>

        <!-- <input name="new_employee_workload" :value="checkEmployeeWorkload" style="display: none"> -->
        <!-- <input name="new_employee_workload" :value="checkEmployeeWorkload()" style="display: none" > -->
        <!-- <input name="new_employee_workload" :value="workload"> -->
      </form>
  </div>
</div>
</template>
<script>
  export default {
    name: 'SetTaskForm',
    props: {
      editInfo: Object,
      editMode: Boolean,
      allUsers: Array
    },
    data() {
      return {
        task: {
          creator: localStorage.getItem("id"),
          title: '',
          deadline: '',
          complication: '',
          performer: '',
          taskDescription: '',
          taskPerformer: {},
        },
        edit: this.editMode,
        readOnly: false,
        taskComplexityBeforeEdit: '', // складність задачі перед едітом
        taskPerformerBeforeEdit: '', // виконавець задачі перед едітом
        employeeWorkloadBeforeEdit: '', // завантаженість виконавця задачі перед едітом
        currentEmployeeWorkload: '', // можна передавати в базу для оновлення навантаження на вибраного виконавця при едіті задачі
        btnLoading: false,
        // allUsers: null,
        loading: false,
        workload: 0,
        error: false
      }

    },
    created() {
      // this.loadData()
      if (Object.keys(this.editInfo).length) {
        this.task = structuredClone(this.editInfo)
      }
    },
    methods: {
      loadData: async function () {
        this.loading = true
        // version with employee_workload

        // const response = await fetch('/api/allUsers');
        // this.allUsers = await response.json();
        // this.allUsers.sort((a, b) => {
        //   return a._id - b._id
        // })
        if (Object.keys(this.editInfo).length) {
          this.task.taskPerformer.employee_workload = this.allUsers.find(f => f._id == this.task.taskPerformer._id).employee_workload
          this.employeeWorkloadBeforeEdit = parseInt(this.task.taskPerformer.employee_workload) - parseInt(this.taskComplexityBeforeEdit);
          this.taskComplexityBeforeEdit = parseInt(this.task.complication)
          this.taskPerformerBeforeEdit = this.task.performer
          this.currentEmployeeWorkload = this.task.taskPerformer.employee_workload
        }
        this.loading = false
      },
      changePerformer() {
        this.task.taskPerformer = this.allUsers.find(u => u._id === this.task.performer)
        // v with workload 
        // this.checkEmployeeWorkload()
      }, 
      createTask: async function() {
        
        this.error = !this.task.title || !this.task.complication || !this.task.performer
        if (!this.error) {
          this.btnLoading = true
          this.task.performer = this.task.performer.toString()
          // version with employee_workload 
          // let meta = {
          //   task: this.task,
          //   workload: this.workload
          // }
          let meta = {
            task: this.task
          }
          await fetch(`https://task-manager-lzi3.onrender.com/api/createTask`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(meta) 
          })
          this.btnLoading = false 
          document.location.reload()
        }
      },
      editTask: async function(){
        this.error = !this.task.title || !this.task.performer
        if (!this.error) {
          this.btnLoading = true
          this.task.performer = this.task.performer.toString()
          let infoToUpdate = this.task;

          // version with employee_workload
          //let userObj = {'id': parseInt(this.task.performer), 'new_employee_workload': this.currentEmployeeWorkload};
          //infoToUpdate.user = userObj; // add user obj into taskObj


          // userBeforeUpdateObj для зменшення завантаженості початкового відповідального за задачу до едіту
          // якщо відповідальний був змінений

          
          // if (this.task.performer !== this.taskPerformerBeforeEdit) {
          //   let userBeforeUpdateObj = {'id': parseInt(this.taskPerformerBeforeEdit), 'new_employee_workload': this.employeeWorkloadBeforeEdit};
          //   infoToUpdate.userBeforeEdit = userBeforeUpdateObj; // add user userBeforeUpdateObj into taskObj
          // }
          await fetch(`https://task-manager-lzi3.onrender.com/api/updateTask`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(infoToUpdate) // infoToUpdate - taskObj + userObj
          })
          this.btnLoading = false
          this.$emit('editTaskObj', this.task)
          this.$emit('close')  
        }
      },
      checkEmployeeWorkload() {
        if (!this.edit) {
          if (this.task.performer === '') {
            this.workload = 0
            return;
          } else if (Object.keys(this.task.taskPerformer).length){
              this.workload = parseInt(this.task.complication) + parseInt(this.task.taskPerformer.employee_workload);
          }
        } else {
          let taskComplexityBeforeEdit = parseInt(this.taskComplexityBeforeEdit);
          let currTaskComplexity = parseInt(this.task.complication);
          let currentEmployeeWorkload = parseInt(this.task.taskPerformer.employee_workload) || 0;
          if (this.task.performer === this.taskPerformerBeforeEdit) {
            if (taskComplexityBeforeEdit === currTaskComplexity) {
              this.workload = this.currentEmployeeWorkload
            } else if (taskComplexityBeforeEdit > currTaskComplexity) {
              this.workload = this.currentEmployeeWorkload = currentEmployeeWorkload - (taskComplexityBeforeEdit - currTaskComplexity);

            } else {
              this.workload = this.currentEmployeeWorkload = currentEmployeeWorkload + (currTaskComplexity - taskComplexityBeforeEdit)
            }
          } else {
            this.workload =  this.currentEmployeeWorkload = currentEmployeeWorkload = currentEmployeeWorkload + currTaskComplexity
          }
        }
      }
    },
    computed: {
      getAltertnativeUser() {
        if (this.task.performer === '') { return;}
        let taskPerformer = this.task.taskPerformer
        let taskPerformerPosition = taskPerformer.position;
        if (parseInt(this.task.complication) + parseInt(taskPerformer.employee_workload) > 20) {
          let alternativeUser = this.allUsers.filter( (user) => {
            return (user.position === taskPerformerPosition && user._id != taskPerformer._id && (parseInt(user.employee_workload) <= 20 - parseInt(this.task.complication)));
          })
          let namesOfAltUsers = [];
          if (alternativeUser) {
            alternativeUser.forEach((user) => {
              namesOfAltUsers.push(user.name)
            });
            return namesOfAltUsers.join(', ');
          } else {
            return ''
          }
        } else {
          return '';
        }
      }
    }
  }
</script>
<style lang="scss">
  .invalid_input {
    border: 1px solid #ff4747!important;
  }
</style>