<template>
  <div class="settings">
    <AddUser/>
    <UsersSettingsAdmin/>
  </div>
</template>
<script>
  import AddUser from './AddUser'
  import UsersSettingsAdmin from './UsersSettingsAdmin'

  export default {
    name: 'SettingsPart',
    components: { AddUser, UsersSettingsAdmin },
  }
</script>
