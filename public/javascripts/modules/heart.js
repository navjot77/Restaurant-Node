import axios from 'axios'
import {$,$$} from './bling'

function heartEvent(e){

   // console.log('HEart clicked...')
    e.preventDefault();
    axios.post(this.action).then((res)=>{
    const isChecked=this.heart__button.classList.toggle('heart__button--hearted');
    $('.heart-count').textContent=res.data.hearts.length;

    }).catch(err=>{
        console.log(err);
    })


};

export default heartEvent;