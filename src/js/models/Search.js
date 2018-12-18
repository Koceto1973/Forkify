import axios from 'axios';

export default class Search{
    constructor(query){
        this.query = query;
        // this.getResults();
    }

    async getResults(){
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = 'd106bea5d86aaa8d143ddf7d6ea96ee1';
    
        try{
            const info = await axios(`${proxy}https://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = info.data.recipes;
        } catch(err) {
            alert(err);
        }    
    }

}