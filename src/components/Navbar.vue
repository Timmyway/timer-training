<template>
  <nav class="navbar">
      <v-app-bar app>
          <v-app-bar-nav-icon @click="isDrawerOpen = !isDrawerOpen" />
          <v-toolbar-title class="headline text-uppercase">
              <span class="font-weight-light">Timer by</span>
              <span class="font-weight-black primary--text"> Timmy Way</span>              
          </v-toolbar-title>
      </v-app-bar>

      <v-navigation-drawer app v-model="isDrawerOpen">
          <v-toolbar>
              <v-toolbar-title class="title">Laps</v-toolbar-title>
              <v-list></v-list>
          </v-toolbar>
          <v-list>
              <v-list-item-content v-for="(lap, index) in laps" :key="index">
                  Lap {{ index + 1 }}: {{ lap.formattedTime }}
              </v-list-item-content>
          </v-list>
      </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
    name: 'Navbar',
    props: ['laps'],
    data: function() {
        return {
            isDrawerOpen: false
        }
    }
}
</script>

<style> 
</style>