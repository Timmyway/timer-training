<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <p class="time-display">{{ timer }}</p>
          </v-card-title>

          <v-card-subtitle>
            <v-switch
              v-model="countdownMode"
              label="Countdown mode"
              color="primary"
              value="primary"
              hide-details
            ></v-switch>
          </v-card-subtitle>
                    
          <v-card-text v-if="countdownMode">
            <v-layout row style="max-width: 280px" class="pa-4">
              <!-- Maximum value allowed for countdown -->
              <v-flex xs12 sm6>
                <v-text-field
                  label="MAX (max 86399sec)"
                  v-model="countdownValueMax"
                  hide-details
                  type="number"
                  :rules="[countdownValueMax > 0 && countdownValueMax < 86400]"
                  style="max-width: 120px; min-width: 100px;"
                />
              </v-flex>

              <!-- Step value for countdown slider -->
              <v-flex xs12 sm6>
                <v-text-field
                  label="STEP (max 3600sec)"
                  v-model="countdownValueStep"
                  hide-details                  
                  type="number"
                  :rules="[countdownValueStep > 1 && countdownValueStep <= 3600]"
                  style="max-width: 120px; min-width: 100px;"
                />                
              </v-flex>
              </v-layout>

              <!-- Slider that let selecting countdown time -->
              <div class="d-flex">                
                <v-slider              
                  label="Time"
                  :min="countdownValueMin"
                  :max="countdownValueMax"
                  :step="countdownValueStep"
                  v-model="countdownValue"
                ></v-slider>                  
                {{ formatTime(countdownValue) }}
              </div>            
          </v-card-text>

          <v-card-text>
            <v-list class="control">
              <v-list-item-content 
                v-if="countdownMode"
                class="success mb-3 btn-control"
                @click="$emit('countdown', countdownValue)"
              >
                <span class="white--text font-weight-bold text-uppercase pl-5">Countdown</span>
              </v-list-item-content>

              <v-list-item-content 
                v-if="! countdownMode"
                class="success btn-control"
                @click="$emit('start')"
              >
                <v-icon x-large>mdi-play</v-icon>                
              </v-list-item-content>

              <v-list-item-content 
                class="info btn-control"
                @click="$emit('lap')"
                :disabled="state == 'stopped' || state == 'paused'"
              >
                <v-icon x-large>mdi-flag</v-icon>
              </v-list-item-content>

              <v-list-item-content 
                class="warning btn-control"
                @click="$emit('pause')"
                :disabled="state == 'stopped' || state == 'paused'"
              >
                <v-icon x-large>mdi-pause</v-icon>
              </v-list-item-content>

              <v-list-item-content 
               class="error btn-control"
               @click="$emit('stop')"
               :disabled="state == 'stopped'"
               >
                <v-icon x-large>mdi-stop</v-icon>
              </v-list-item-content>
            </v-list>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'Timer',
    props: ['timer', 'state', 'formatTime'],
    data: () => ({
      countdownMode: false,
      countdownValue: 60,
      countdownValueMax: 600,
      countdownValueMin: 0,
      countdownValueStep: 30
    })    
  }
</script>

<style scoped>
  .time-display {  
    min-width: 280px;
    font-weight: 500;
    font-size: 7rem;
    text-transform: uppercase;
    text-align: center;
    border: 3px solid #E4FF1A;
    border-radius: 4px;   
    padding: 0rem 1rem;
    line-height: 1;
    margin: auto;
  }

  .v-list-item__content {
    cursor: pointer;
  }

  .control {
    display: flex;    
    justify-content: center;
    flex-direction: column;    
  }

  .btn-control {
    padding: 2rem;
    width: 100%;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  @media screen and (min-width: 768px) {
    .control {
      flex-direction: row;
      max-width: 768px;
      margin: auto;
    }

    .btn-control {      
      min-width: 70px;      
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
  }
</style>