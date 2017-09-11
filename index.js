#!/usr/bin/env node

const request = require("superagent"); // http client
const prompt = require("inquirer"); // command line Q&A utility
const {getQueryString,getCurrentDay,printTable} = require('./util'); //utility functions

let truckList;
const pageSize= 10;
let totalPages;
let currentPage=1;

const getFoodTruckList = () => {
    //console.log(getQueryString());
    request.get(`https://data.sfgov.org/resource/bbb8-hzi6.json?dayorder=${getCurrentDay()}`)
    .query(`$where=${getQueryString()}`) 
    .query(`$order=applicant`)
    .query('$select=applicant,location,start24,end24')
    .end((err,res) => {
        if(err){
            console.log("Error getting response from data.sfgov.org");
            console.log(err);
        }else{
            truckList= res.body;
            console.log(`Total trucks = ${truckList.length}`);
            totalPages = Math.ceil(truckList.length/pageSize);
            console.log(`Total pages = ${totalPages}`);
            pageAndDisplay();
        }
    });

};

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


getFoodTruckList();
