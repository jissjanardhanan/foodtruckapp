#!/usr/bin/env node
"use strict";

const prompt = require("inquirer"); // command line Q&A utility
const {getFoodTruckList,printTable} = require('./util'); //utility functions

let truckList;
const pageSize= 10;
let totalPages;
let currentPage=1;
const question = [{
    name : "pagination",
    message : "Press enter to list the next page.",
    default :''
}];

const display = () => {
    let endIndex;
    let startIndex = (currentPage * pageSize)-pageSize;
    if(currentPage<totalPages){
        endIndex = (currentPage * pageSize)-1; 
    }else{
        endIndex = (truckList.length % pageSize)-1;
        endIndex+=startIndex;
       // console.log(`start=${startIndex} end=${endIndex}`);
    }
    printTable(truckList.slice(startIndex,endIndex+1));
    ++currentPage;
};

const pageAndDisplay = (answer) => {
    console.log(`Total pages=${totalPages}, currentPage=${currentPage}`);
    display();
    if(totalPages<currentPage){
        return; // printed final page. exit;
    }
   return prompt.prompt(question).then(pageAndDisplay); // recursive prompts for pagination

};


getFoodTruckList(function(array){
    truckList= array;
    console.log(`Total trucks = ${truckList.length}`);
    totalPages = Math.ceil(truckList.length/pageSize);
    console.log(`Total pages = ${totalPages}`);
    pageAndDisplay();
});
