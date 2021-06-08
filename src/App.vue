<template>
  <v-app>
    <Navbar :laps="laps" />
    <v-content>
      <div class="pan notif-pan mt-2">
        <v-text-field          
          class="alarm-notif"
          dark
          label="Ring after (sec)"
          v-model="notifAlarm.interval"
          hide-details            
          type="number"
          :rules="[notifAlarm.interval > 1 && notifAlarm.interval <= 3600]"
        />
        <div>
          <span>Alarm ring loop: {{ notifAlarm.mode === 'off' ? 'OFF' : 'ON' }}</span>
          <v-btn 
            class="ml-2"
            :color="notifAlarm.mode === 'off' ? 'orange' : 'blue'"
            @click="notifAlarm.mode = (notifAlarm.mode === 'off') ? 'loop' : 'off'" 
            fab
          >
            <v-icon>mdi-alarm-off</v-icon>          
          </v-btn>
        </div>            
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

    <v-footer padless class="bg-primary">
      <v-col
        class="text-center"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>Timmy way</strong>
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
    notifAlarm: {
      interval: 60,
      duration: 2,
      mode: 'loop'
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
      this.notifAlarm.mode = 'loop';
      this.ticker = setInterval(() => {
        // Play a sound each <notifAlarm.interval:int> seconds
        if (this.notifAlarm.mode === 'loop') {
          if (this.notifAlarm.interval > 0 && this.currentTimer > 0
              && (this.currentTimer % this.notifAlarm.interval == 0)               
            )
          {
            this.playSound(this.notifAlarm.duration);
          }
        } else if (this.notifAlarm.mode === 'once') {
          if (this.notifAlarm.interval > 0 && this.currentTimer > 0
              && (this.currentTimer === this.notifAlarm.interval)            
            )
          {
            this.playSound(this.notifAlarm.duration);
          }  
        }
        // Display updated time
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
    formatTime(seconds) {
      // Format to h:m:s time
      let measuredTime = new Date(null);
      measuredTime.setSeconds(seconds);
      let MHSTime = measuredTime.toISOString().substr(11, 8);
      return MHSTime;
    },
    pause () {
      // Pause timer, save state for next play, then stop sound
      window.clearInterval(this.ticker);
      this.timerState = 'paused';
      this.pausedtime = this.currentTimer;
      this.stopSound();
    },
    stop () {
      // Stop can not be resumed, so timer is resetted
      window.clearInterval(this.ticker);
      this.currentTimer = 0;
      this.formattedTime = '00:00:00';
      this.timerState = 'stopped';
      this.stopSound()
    },
    playSound(duration = -1) {
      // Stop played song after x duration
      if (duration > 0) {
        this.audio.play();
        setTimeout(() => {
            this.stopSound()
          }, duration * 1000)
      }     
    },
    stopSound() {      
      this.audio.pause();
    }

  }
};
</script>
<style>
  :root {
    --primary-color: #011121;
    --secondary-color: rgb(228, 255, 26);
  }

  .theme--dark.v-app-bar.v-toolbar.v-sheet {
    background: var(--primary-color);
  }

  .bg-primary {background: var(--primary-color)!important;}
  .bg-secondary {background: var(--secondary-color)!important;}

  .v-content {
    width: 100%;    
    min-width: 360px;
    background: var(--secondary-color);
  }

  .pan {
    background: #011121;
    border-radius: 4px;
  }

  .notif-pan {
    display: flex;
    justify-content: space-between;
    min-width: 360px;
    max-width: 768px;
    margin: auto;
    padding: 0.8rem 2rem;
  }

  .alarm-notif {    
    max-width: 90px;
  }  

  .fixed--top-right {
    position: absolute;
    top: 5%; right: 2%;
    z-index: 200;    
  }
</style>