// app controller

import axios from 'axios';

async function getResults(query){
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = 'd106bea5d86aaa8d143ddf7d6ea96ee1';

    try{
        const result = await axios(`${proxy}https://food2fork.com/api/search?key=${key}&q=${query}`);
        const info = result.data.recipes;
        console.log(info);
    } catch(err) {
        alert(err);
    }    
}

getResults('pizza');

