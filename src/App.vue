<template>
  <v-app>
    <Navbar :laps="laps" />    
    <v-content>
      <Timer 
        :timer="formattedTime"
        :state="timerState"
        :formatTime="formatTime"
        @start="start"
        @countdown="countdown"
        @lap="lap"
        @pause="pause"
        @stop="stop"
      >
      </Timer>      
    </v-content>

    <v-footer padless>
      <v-col
        class="text-center"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>Kontiki media</strong>
      </v-col>
    </v-footer>

    <v-snackbar
      v-model="snackbar"
      color="info"
      :timeout="3000"
    >
      New Lap {{ this.latestlap }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar';
import Timer from '@/components/Timer';

export default {
  name: 'App',

  components: {
    Navbar,
    Timer
  },

  data: () => ({
    timerState: 'stopped',
    currentTimer: 0,
    pausedtime: 0,
    formattedTime: '00:00:00',
    ticker: undefined,
    laps: [],
    latestlap: '',
    snackbar: false    
  }),
  methods: {
    start: function() {
      if (this.timerState !== 'running') {
        this.tick();
        this.timerState = 'running';
      }      
    },
    lap() {
      this.snackbar = true;
      this.laps.push({
        seconds: this.currentTimer,
        formattedTime: this.formatTime(this.currentTimer)
      });
      this.latestlap = this.formatTime(this.currentTimer);
      // this.currentTimer = 0;
    },
    tick() {
      this.ticker = setInterval(() => {
        this.currentTimer ++;
        this.formattedTime = this.formatTime(this.currentTimer);
      }, 1000);
    },
    countdown(countdownValue) {      
      if (this.timerState !== 'running' && countdownValue > 0) {        
        if (this.timerState == 'paused') {
          this.currentTimer = this.pausedtime;
        } else {
          this.currentTimer = countdownValue;
        }        
        this.timerState = 'running';        
        this.ticker = setInterval(() => {
        this.currentTimer --;
        this.formattedTime = this.formatTime(this.currentTimer);
        if (this.currentTimer == 0) {
          this.stop();
        }
      }, 1000);
      }      
    },
    formatTime (seconds) {
      let measuredTime = new Date(null);
      measuredTime.setSeconds(seconds);
      let MHSTime = measuredTime.toISOString().substr(11, 8);
      return MHSTime;
    },
    pause () {
      window.clearInterval(this.ticker);
      this.timerState = 'paused';
      this.pausedtime = this.currentTimer;
    },
    stop () {
      window.clearInterval(this.ticker);
      this.currentTimer = 0;
      this.formattedTime = '00:00:00';
      this.timerState = 'stopped';
    }

  }
};
</script>
