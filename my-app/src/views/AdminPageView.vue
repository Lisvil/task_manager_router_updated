<template lang="html">
  <div class="settings">
    <AddUser/>
    <UsersSettingsAdmin/>
  </div>
</template>

<script>
import AddUser from '../components/Settings/AddUser'
import UsersSettingsAdmin from '../components/Settings/UsersSettingsAdmin'

export default {
  components: { AddUser, UsersSettingsAdmin },
}
</script>

<style lang="css" scoped>
</style>
