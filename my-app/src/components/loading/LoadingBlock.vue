<template>
  <div class="loader-container">
    <div class="loader"></div>
  </div>
</template>
<script>
  export default {
    name: 'LoadingBlock'
  }
</script>
<style lang="sass" scoped>
  .loader-container 
    top: 0
    left: 0
    width: 100%
    height: 100%
    display: flex
    position: absolute
    .loader  
      left: 50% 
      top: 40%
      width: 35px
      height: 35px
      border-radius: 50%
      position: relative
      background: #333
      background: linear-gradient(to right, transparent, #9873e9)
      animation: animate 0.7s linear infinite  
      z-index: 1

      &::before
        position: absolute
        content: '',
        top: 0
        bottom: 0
        width: 100%
        height: 100% 
        background: #fff
        transform: scale(0.75) 
        border-radius: 50%

@keyframes animate 
  0% 
    transform: rotate(0deg)        
  100% 
    transform: rotate(360deg)  
</style>