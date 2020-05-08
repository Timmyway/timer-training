import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    iconfont: 'md',
    theme: {
        primary: '#B2F300',
        secondary: '#C7008B',
        info: '#00DEC0',
        warning: '#FFC865',
        danger: '#AE0946',
        light: '#F4EEDD',
        dark: '#2D3C4D'
    }
});
