<template>
  <div>
    <div v-if="!loading" class="calendar">
      <div class="text-center calendar__title">
        <h3 class="m-0">{{ getMonthName() }}</h3>
        <div class="calendar__text">Мої завдання </div>
      </div>
      <div class="calendar__container"> 
        <div v-for="day in days" :key=day class="calendar__block" :class="{current__day: day == currentDay}">
          <div class="calendar__day">{{ day }}</div>
          <div class="day__tasks">
            <template v-for="task in myTasks" :key="task._id">
              <div v-if="task.deadline[2] == day && task.deadline[1] == month + 1" class="day__task">
                {{ task.title }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <LoadingBlock v-if="loading"/> 

  </div>
  
</template>
<script>
  export default {
    name: 'CalandarTasks',
    data() {
      return {
        days: '',
        month: '',
        currentDay: '',
        loading: false,
        myTasks: []
      }
    },
    created() {
      let date = new Date()
      this.month = date.getMonth()
      this.currentDay = date.getDate()
      this.days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
      this.getMyTasks()
    },
    methods: {
      getMyTasks: async function () {
      this.loading = true
      let userId = {id: localStorage.id};
      const response = await fetch(`/api/myTasks`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(userId)
        })
      this.myTasks = await response.json();
      this.myTasks.forEach(item => {
        item.deadline = item.deadline.split('-')
      })
      this.loading = false
    },
    getMonthName() {
      let monthNames = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень']
      return monthNames[this.month]
    }
    }
  }
</script>
<style lang="scss">
.calendar__title {
  color: #798cd2;
  .calendar__text{
    color: #333;
  }
}
  .calendar__container {
    margin-top: 40px;
    display: flex; 
    flex-wrap: wrap;
    .calendar__block {
      width: 200px;
      height: 150px;
      overflow-y: scroll;
      border: 1px solid #fff;
      background-color: #f1efff;
      overflow: -moz-scrollbars-none;
      -ms-overflow-style: none;
      scrollbar-width: none;
        &::-webkit-scrollbar  {
          display: none

        }

      .calendar__day {
        padding: 10px 0 0 10px;
        font-size: 15px;
        color: rgb(108, 108, 108);
        font-weight: 600;
      }
      .day__tasks {
        padding: 5px 10px;
        .day__task {
          border-radius: 5px;
          padding: 5px;
          margin-bottom: 10px;
          background: #0d3aff75;
          color: #fff;
        }

      }
    }
    .current__day {
    background: #d8d5ff;
  }

  }
</style>