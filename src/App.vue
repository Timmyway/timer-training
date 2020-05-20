<template>
  <v-app>
    <Navbar :laps="laps" />
    <v-content>
      <div class="flex fl-x--reverse fixed--top-right">
        <v-text-field
          dark
          label="Notif time in second"
          v-model="notifTime.spacing"
          hide-details            
          type="number"
          :rules="[notifTime.spacing > 1 && notifTime.spacing <= 3600]"
          style="max-width: 120px; min-width: 100px;"
        />        
        <v-switch
          v-model="notifTime.loop"
          append-icon="mdi-alarm"
          color="primary"
          :value="false"
          hide-details
        ></v-switch>
        <v-btn 
          @click="stopSound" 
          fab
        >
          <v-icon>mdi-alarm-off</v-icon>
        </v-btn>
      </div>
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
    publicPath: process.env.BASE_URL,
    timerState: 'stopped',
    currentTimer: 0,
    pausedtime: 0,
    formattedTime: '00:00:00',
    ticker: undefined,
    laps: [],
    latestlap: '',
    snackbar: false,
    notifTime: {
      spacing: 10,
      duration: 3,
      loop: false
    },
    audio: null
  }),
  mounted() {
    this.audio = new Audio(`${this.publicPath}alarm.mp3`);
  },
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
        // Play a sound when current timer's time is equal to <notifTime.spacing:int>
        if (this.notifTime.spacing > 0 && (this.currentTimer % this.notifTime.spacing == 0) && this.currentTimer > 0)
        {
          if (this.notifTime.loop) {
            this.playSound(this.notifTime.duration);
          } else {
            this.playSound(10);
          }
          
        }
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
          this.playSound(5)          
        }
      }, 1000);
      }      
    },
    formatTime (seconds) {
      // Format to h:m:s time
      let measuredTime = new Date(null);
      measuredTime.setSeconds(seconds);
      let MHSTime = measuredTime.toISOString().substr(11, 8);
      return MHSTime;
    },
    pause () {
      window.clearInterval(this.ticker);
      this.timerState = 'paused';
      this.pausedtime = this.currentTimer;
      this.stopSound()
    },
    stop () {
      window.clearInterval(this.ticker);
      this.currentTimer = 0;
      this.formattedTime = '00:00:00';
      this.timerState = 'stopped';
      this.stopSound()
    },
    playSound(duration = -1) {
      if (duration > 0) {
        this.audio.play();
        setTimeout(() => {
            this.stopSound()
          }, duration * 1000)
      } else {
        this.audio.play();
      }      
    },
    stopSound() {      
      this.audio.pause();
    }

  }
};
</script>
<style scoped>
  .fixed--top-right {
    position: absolute;
    top: 5%; right: 2%;
    z-index: 200;    
  }
  .flex {
    display: flex;
  }
  .fl-x {    
    flex-direction: row;
  }
  .fl-x--reverse {    
    flex-direction: row-reverse;
  }
  .fl-y {    
    flex-direction: column;
  }
  .fl-y--reverse {    
    flex-direction: column-reverse;
  }
</style>