

const request = require("superagent"); // http client
const Table = require("easy-table");  // table printing utility
const hours = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];


// start24 and end24 doesnt support only = and not > or < operations and all times starts or ends at start of the hour hence this query
const getQueryString = function (){
    let currentHour = new Date().getHours();
    let queryString='';
    let end24Started=false;
    for(let i=0;i<hours.length;i++){
        if(i<=currentHour){
            if(i===0){
                queryString+=`(start24='${hours[i]}'`;
            }else{
                queryString+=` OR start24='${hours[i]}'`;
            }
            
        }else{
            if(!end24Started){
                queryString+=`) AND (end24='${hours[i]}'`;
                end24Started=true;
            }else{
                queryString+=` OR end24='${hours[i]}'`;
            }
            
        }
    }
    queryString+=')';
    return queryString;
};


const getCurrentDay = () => {
    return new Date().getDay();
};

const printTable=(dataArray) => {
    let tbl = new Table();
    dataArray.forEach(function(element) {
        tbl.cell('Applicant',element.applicant);
        tbl.cell('start24',element.start24);
        tbl.cell('end24',element.end24);
        tbl.cell('Location',element.location);
        tbl.newRow();   
    });
    console.log(tbl.toString()); // print table
};

const getFoodTruckList = (successCallBack) => {
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
            successCallBack(res.body);
        }
    });

};



module.exports={printTable,getFoodTruckList};