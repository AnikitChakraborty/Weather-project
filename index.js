const dotenv =require('dotenv');
dotenv.config({path : './config.env'})
const http = require("http");
const fs = require("fs");


const axios = require('axios'); // let requests = require("requests");
const url = require('url');
const homeFile = fs.readFileSync("index.html","utf-8");

const port = process.env.port || 8000;



const api_key = process.env.ID;
console.log(typeof(api_key));

// Function for converting kelvin to celcious.
const chanceToCel = (tmpInkelvin) =>{
  let newCel = parseFloat(tmpInkelvin) - 273.15;
  newCel =  (newCel).toFixed(2).toString();
  return  newCel;
  
};
const showcloud =(clouds) =>{
  let cloudPersent = parseInt(clouds);
  if(cloudPersent >= 40){
    return "clouds_dis";
  }
  return " "
}
const replaceVal = (tempVal,orgVal)=>{
    
    let temperature = tempVal.replace("{%tempval%}",chanceToCel(orgVal.main.temp));
     temperature = temperature.replace("{%tempmin%}",chanceToCel(orgVal.main.temp_min));
     temperature = temperature.replace("{%tempmax%}",chanceToCel(orgVal.main.temp_max));
     temperature = temperature.replace("{%location%}",orgVal.name);
     temperature = temperature.replace("{%country%}",orgVal.sys.country);
     temperature = temperature.replace("{%humidity%}",orgVal.main.humidity);
     temperature = temperature.replace("{%clouds_dis%}",showcloud(orgVal.clouds.all));
     temperature = temperature.replace("{%Clouds%}",orgVal.clouds.all);
     return temperature;

};

const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Assam&appid=${process.env.ID}`;
//Creating server
const server = http.createServer((req,res)=>{
  console.log(req.url);
  const {query , pathname} = url.parse(req.url, true);

 if(pathname == "/"  ){
axios.get(apiUrl)
  .then(response => {
    // Handle the API response data here
    const responseData = response.data;
    console.log(responseData);

   // const objdata = JSON.parse(response.data); // JSON => OBJECT
        const arrData =[responseData];         // OBJECT => ARRAY
      console.log(arrData);
      const realTimeData = arrData
      .map((val)=>replaceVal(homeFile,val))
        .join("");
    
      res.write( realTimeData);
      res.end()

  })
  .catch(error => {
    // Handle errors
    console.error('Error fetching data from the API:', error);
  });

 }

 else if(pathname == "/place"  ){
  const newPlace = query.location;
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${newPlace}&appid=${process.env.ID}`)
    .then(response => {
      // Handle the API response data here
      const responseData = response.data;
      console.log(responseData);
  
     // const objdata = JSON.parse(response.data); // JSON => OBJECT
          const arrData =[responseData];         // OBJECT => ARRAY
        console.log(arrData);
        const realTimeData = arrData
        .map((val)=>replaceVal(homeFile,val))
          .join("");
      
        res.write( realTimeData);
        res.end()
  
    })
    .catch(error => {
      // Handle errors
      console.error('Error fetching data from the API:', error);
    });
  
   }
});






server.listen(port, ()=>{
  console.log(`listening to port no at ${port}`);
});