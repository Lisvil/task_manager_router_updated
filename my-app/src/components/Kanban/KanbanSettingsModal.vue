<template>
  <div class="settings__container">
    <div class="settings__block">
      <div class="settings__header">
        <h5 class="settings__title m-0">Kanban board settings</h5>  
        <div class="settings__close"><i class="fa-solid fa-xmark" @click="$emit('cancel')"></i></div>
      </div>
      <div class="settings__body">
        <div class="settings__column" v-for="(item, i) in columns" :key="i">
          <div class="form-group m-1 column__container">
            <label class="column__label">Column title</label>
            <input class="form-control column__input" placeholder="Enter column title" v-model="item.title" :disabled="!item.custom" />
          </div>
          <div class="column__color mt-4">
            <ColorPicker
              v-model:pureColor="item.background"
              shape="circle"
              format="prgb"
              />
          </div>
          <button  v-if="item.custom" class="btn btn-danger mt-4 cursor-pointer" @click="handleDeleteColumn(item)">
            <i class="fa-solid fa-trash-can "></i>
          </button>
        </div>
      
        <button  class="btn btn-secondary btn-bold mt-2 mb-2 " @click="addNewColumn" >
            Add new column
        </button>
      </div>
      <div class="settings__buttons">
        <button @click="saveSettings" class="btn btn-success mr-2">
          <template v-if="!btnLoading">
            Save
          </template>
          <b-spinner v-else small></b-spinner>
        </button>
        <button  @click="$emit('cancel')" class="btn btn-danger">Cansel</button>
        <!-- <i class="fa-solid fa-xmark" @click="$emit('cancel')"></i> -->
      </div>
    </div>
  </div>
</template>
<script>

import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
export default {
  name: 'KanbanSettingsModal',
  props: {
    kanban: Object
  },
  components: {
    ColorPicker
  },
  data() {
    return {
      columns: [],
      btnLoading: false 
    }
  },
  created() {
    // this.columns = structuredClone(this.kanban.statuses)
    this.columns = JSON.parse(JSON.stringify(this.kanban.statuses))

  },
  methods: {
    addNewColumn() {
      this.columns.push({
        title: 'New column',
        background: '#5463e296',
        items: [],
        custom: true
      })
    },
    handleDeleteColumn(item) {
      this.columns.splice(this.columns.findIndex(f => f.title === item.title), 1)
    },

    saveSettings: async function () {
      let meta = {
        id: this.kanban._id,
        statuses: this.columns
      }
      this.btnLoading = true
      await fetch('https://task-manager-lzi3.onrender.com/api/changeKanban', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(meta)
          })
      this.btnLoading = false
      this.$emit('saveKanban', this.columns)
    }
  }
}
</script>
<style lang="scss" scoped>
.settings__container {
  position: absolute;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #191818bf;
  top: 0;
  // top: 100px;
  // width: 400px;
  width: max-content;
  width: 100%;
  right: 0;
  height: 100%;
  z-index: 1;
}
.settings__block {
  padding: 20px 0;
  width: 450px;
  min-height: 300px;
  background: #fff;
  box-shadow: 0 0 10px #393939;
}
.settings__header {
  padding-inline: 25px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid #c0c0c066;
  padding-bottom: 10px;
}
.settings__title {
  color: #525252;
}
.settings__close {
  color: #797979;
  font-size: 20px;
  i {
    cursor: pointer;
    &:hover {
      color: darken(#797979, 20)
    }
  }
}
.settings__body {
  padding-inline: 25px;
}
.settings__column {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.column__container {
  width: 80%;
  margin-right: 10px!important;
}
.column__label {
  color: #575757e6;
  font-size: 15px;
  margin-bottom: 0;
}
.column__input {
  border: 1px solid #aeaeae4d;
  background: #bbc5ce38;
}
.settings__buttons {
  padding-inline: 25px;
  border-top: 1px solid #c0c0c066;
  padding-top: 10px;
  text-align: end;
}
</style>