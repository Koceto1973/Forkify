// app controller

import Search from './models/Search';

var search = new Search('pizza');
search.getResults();
console.log(search);