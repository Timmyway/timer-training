<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs12 pa-3>
        <v-card>
          <v-card-title class="secondary white--text font-weight-light display-4 text-uppercase justify-center">
            {{ timer }}
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
            <v-layout row>
              <!-- Maximum value allowed for countdown -->
              <v-flex xs12 sm6>
                <v-text-field
                  label="Max value (max 86399sec)"
                  v-model="countdownValueMax"
                  hide-details
                  type="number"
                  :rules="[countdownValueMax > 0 && countdownValueMax < 86400]"
                  style="max-width: 160px; min-width: 100px;"
                />
              </v-flex>
              <!-- Step value for countdown slider -->
              <v-flex xs12 sm6>
                <v-text-field
                  label="Step (max 3600sec)"
                  v-model="countdownValueStep"
                  hide-details                  
                  type="number"
                  :rules="[countdownValueStep > 1 && countdownValueStep <= 3600]"
                  style="max-width: 120px; min-width: 100px;"
                />                
              </v-flex>
              <!-- Slider that let selecting countdown time -->
              <v-flex xs8>
                <v-slider              
                  label="Countdown"              
                  :min="countdownValueMin"
                  :max="countdownValueMax"
                  :step="countdownValueStep"
                  v-model="countdownValue"
                ></v-slider>                  
              </v-flex>
              <v-flex xs4>
                {{ formatTime(countdownValue) }}                
              </v-flex>
            </v-layout>
          </v-card-text>

          <v-card-text>
            <v-list>
              <v-list-item-content 
                v-if="countdownMode"
                class="success mb-3"
                @click="$emit('countdown', countdownValue)"
              >
                <span class="white--text font-weight-bold text-uppercase pl-5">Countdown</span>
              </v-list-item-content>

              <v-list-item-content 
                v-if="! countdownMode"
                class="success mb-3"
                @click="$emit('start')"
              >
                <span class="white--text font-weight-bold text-uppercase pl-5">Start</span>
              </v-list-item-content>

              <v-list-item-content 
                class="info mb-3"
                @click="$emit('lap')"
                :disabled="state == 'stopped' || state == 'paused'"
              >
                <span class="white--text font-weight-bold text-uppercase pl-5">Lap</span>
              </v-list-item-content>

              <v-list-item-content 
                class="warning mb-3"
                @click="$emit('pause')"
                :disabled="state == 'stopped' || state == 'paused'"
              >
                <span class="white--text font-weight-bold text-uppercase pl-5">Pause</span>
              </v-list-item-content>

              <v-list-item-content 
               class="error mb-3"
               @click="$emit('stop')"
               :disabled="state == 'stopped'"
               >
                <span class="white--text font-weight-bold text-uppercase pl-5">Stop</span>
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
