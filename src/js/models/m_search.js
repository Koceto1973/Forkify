import axios from 'axios';
import {proxy, key} from '../config';

export default class Search{
    constructor(query){
        this.query = query;
        // this.getResults();
    }

    async getResults(){       
    
        try{
            const info = await axios(`${proxy}https://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = info.data.recipes;
        } catch(err) {
            alert(err);
        }    
    }

}