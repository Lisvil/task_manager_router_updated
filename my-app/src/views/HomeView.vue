<template>
  <HeaderPart/>
  <div class="main-part">
    <AsidePart/>
    <div class="info-part">
      <router-view/>
    </div>
  </div>

</template>

<script>
// @ is an alias to /src
import HeaderPart from '../components/HeaderPart.vue'
import AsidePart from '../components/AsidePart.vue'

export default {
  name: 'HomeView',
  components: {
    HeaderPart,
    AsidePart
  }
}
</script>

<style media="screen">
  .test {
    border: 1px solid red;
  }
</style>
