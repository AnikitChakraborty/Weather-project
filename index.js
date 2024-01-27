const http = require("http");
const fs = require("fs");
let requests = require("requests");
const url = require('url');
const homeFile = fs.readFileSync("index.html","utf-8");
const port = process.env.port || 8000;



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



// Creating server
const server = http.createServer((req,res)=>{
  console.log(req.url);
  const {query , pathname} = url.parse(req.url, true);

 if(pathname == "/"  ){

   requests('https://api.openweathermap.org/data/2.5/weather?q=Assam&appid=978d6e4eba38337be6e72667f9668fbd')
  .on('data',(chunk)=> {
    const objdata = JSON.parse(chunk); // JSON => OBJECT
    const arrData =[objdata];         // OBJECT => ARRAY
  console.log(arrData);

  const realTimeData = arrData
  .map((val)=>replaceVal(homeFile,val))
    .join("");
    //console.log(realTimeData);
  res.write(realTimeData);

})
.on('end', function (err) {
  if (err) return console.log('connection closed due to errors', err);
 
  console.log('end');
});

    }
    else if(pathname == '/place'){
      const newPlace = query.location;

      requests(`https://api.openweathermap.org/data/2.5/weather?q=${newPlace}&appid=978d6e4eba38337be6e72667f9668fbd`)
      .on('data',(chunk)=> {
        const objdata = JSON.parse(chunk); // JSON => OBJECT
        const arrData =[objdata];         // OBJECT => ARRAY
      console.log(arrData);
    
      const realTimeData = arrData
      .map((val)=>replaceVal(homeFile,val))
        .join("");
    
      res.write(realTimeData);
    
    })
    .on('end', function (err) {
      if (err) return console.log('connection closed due to errors', err);
     
      console.log('end');
    });
    

    }

});
server.listen(port, ()=>{
  console.log(`listening to port no at ${port}`);
});