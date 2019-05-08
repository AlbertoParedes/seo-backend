function deleteEspacios(text){
  text = text.replace(/ /g,'');
  text = text.replace(/,/g,'');
  return text;
}
function deletePlus(text){
  text = text.replace(/\+/g,'');
  return text;
}
function deleteDots(text){
  text = text.replace(/\./g,'');
  return text;
}
function replacePlusDot(text){
  text = text.replace(/\+\./g,'');
  return text;
}
function correctTelefono(text){
  text = text.replace(/\+/g,'');
  text = text.replace(/\./g,'');
  text = text.replace(/ /g,'');
  if(text.length>=9)return false;
  return true;
}

function cleanDNI(text){
  text = text.replace(/ /g,'').trim().toUpperCase();
  return text;
}

function correctEmail(text){
  if(!text.includes('@'))return true;
  text = text.substring(text.indexOf("@"), text.length);
  if(text.includes('.')){
    return false;
  }
  return true;
}

function createId(text){
  text = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  text = text.replace(/ /g,'_');
  return text.trim()
}



function isNumber(num){
  num = num.trim();
  num = num.replace(',','.');
  if(isNaN(num)){
    return false;
  }
  return true
}

function isEmail(text){
  text = text.trim();
  text = text.replace('@','');
  if(text.includes('@')){
    return false;
  }
  return true
}

function isTelefono(text){
  text=text.trim();
  if(text.startsWith('+')){
    text =text.replace('+','')
  };
  text = text.replace('.','');
  text = text.replace(/ /g,'');
  if(isNaN(text)){ return false; }
  //if(text.length>=9)return false;
  return true;
}

function getNumber(num){
  num = num.trim();
  num = num.replace(',','.');
  return num
}

function getDay(date) {
  var weekday = new Array(7);
  weekday[0] =  "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  return weekday[date.getDay()]
}


function getDominio(dominio){

  var idiomas = ['en', 'es'];

  dominio = dominio.startsWith("http://") ?  dominio.replace('http://','') : dominio;
  dominio = dominio.startsWith("https://") ?  dominio.replace('https://','') : dominio;
  dominio = dominio.startsWith("www.") ?  dominio.replace('www.','') : dominio;


  var idioma = dominio.includes("/") ?  dominio.substring(dominio.indexOf('/')+1, dominio.length) : false;

  if(idioma && idioma.trim()!==''){
    idioma = idioma.includes("/") ?  idioma.substring(0, idioma.indexOf('/')) : idioma;
    idioma = idioma.trim().toLowerCase();
  }


  dominio = dominio.includes("/") ?  dominio.substring(0, dominio.indexOf('/')) : dominio;

  if(idioma && idiomas.includes(idioma)){
    dominio = dominio+'/'+idioma;
  }

  //con esto quitamos hasta el el .com, .es ...
  //dominio = dominio.includes(".") ?  dominio.substring(0, dominio.indexOf('.')) : dominio;

  return dominio.trim().toLowerCase();
}

function cleanWeb(dominio){
  dominio = dominio.startsWith("http://") ?  dominio.replace('http://','') : dominio;
  dominio = dominio.startsWith("https://") ?  dominio.replace('https://','') : dominio;
  dominio = dominio.startsWith("www.") ?  dominio.replace('www.','') : dominio;
  dominio = dominio.includes("/") ?  dominio.substring(0, dominio.indexOf('/')) : dominio;
  return dominio.trim();
}

function cleanProtocolo(dominio){
  dominio = dominio.startsWith("http://") ?  dominio.replace('http://','') : dominio;
  dominio = dominio.startsWith("https://") ?  dominio.replace('https://','') : dominio;
  dominio = dominio.startsWith("www.") ?  dominio.replace('www.','') : dominio;
  dominio = dominio.endsWith("/") ?  dominio.substring(0, dominio.length-1) : dominio;
  return dominio.toLowerCase().trim();
}

function isLink(dominio){
  var isLink = 0;
  if(dominio.startsWith("http://") || dominio.startsWith("https://") ){
    isLink++
  }
  if(dominio.startsWith("http://www") || dominio.startsWith("https://www")){
    dominio = dominio.replace('.','')
    if(dominio.includes('.')){
      isLink++
    }
  }else if(dominio.includes(".")){
    isLink++
  }

  return isLink===2?true:false
}

function limpiarString(text){
  text = text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  return text.trim()
}

function getFecha(){
  var d = new Date();
  var month = d.getMonth() + 1;
  var mes = month< 10 ?'0'+month:month
  return mes;
}

function getTodayDate(){
  var d = new Date();
  var month = d.getMonth() + 1;
  var mes = month< 10 ?'0'+month:month
  return d.getFullYear()+'-'+mes;
}

function getNow(){
  var d = new Date();
  var month = d.getMonth() + 1;
  var day = d.getDate()
  var mes = month< 10 ?'0'+month:month
  var dia = day< 10 ?'0'+day:day
  return d.getFullYear()+'-'+mes+'-'+dia;
}

function getDecimcals( num ) {
  var text = (+num).toString()
  if(text.includes('.')){
    var valor = (+num).toFixed(2)
    if(valor.toString().includes('.00')){
      return (+valor.replace('.00',''))
    }else{
      return (+valor)
    }

  }
  return (+num)
}

function getStringDate( date ) {
  var array = date.split('-')
  var month = getMonth((+array[1]))

  return (+array[2])+" de "+month+", "+array[0]
}
function calcularPrecioVenta (compraSinIva, beneficio)  {
  return (+compraSinIva)/(1-((+beneficio)/100))
}
function getMonth(date){
  var meses = new Array(12);
  meses[0] =  "Enero";
  meses[1] = "Febrero";
  meses[2] = "Marzo";
  meses[3] = "Abril";
  meses[4] = "Mayo";
  meses[5] = "Junio";
  meses[6] = "Julio";
  meses[7] = "Agosto";
  meses[8] = "Septiembre";
  meses[9] = "Octubre";
  meses[10] = "Noviembre";
  meses[11] = "Diciembre";

  return meses[date-1]
}

function getDateNTimeFromDate(timestamp) {
  var date = new Date(timestamp);

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var year = date.getFullYear()
  var mes = getMonth(date.getMonth()+1)

  var text=(date.getDate())+' de '+(mes)+", "+year;
  text= text+" a las "+(+hours)+":"+(+minutes)//+":"+(+seconds)
  return text
}

function getTimestamp() {
  var date = new Date()
  var timestamp = date.getTime();
  return timestamp
}

function isEmpty(obj) { for(var key in obj) { if(obj.hasOwnProperty(key)) return false; } return true;}
module.exports = {
  deleteEspacios,
  deletePlus,
  deleteDots,
  replacePlusDot,
  isEmpty,
  correctTelefono,
  correctEmail,
  createId,
  isNumber,

  getDay,
  getNumber,
  isEmail,
  cleanDNI,
  isTelefono,

  getDominio,
  cleanWeb,
  limpiarString,
  cleanProtocolo,
  getFecha,
  isLink,
  getTodayDate,
  getDecimcals,
  getMonth,
  getStringDate,

  getDateNTimeFromDate,
  getNow,
  getTimestamp,
  calcularPrecioVenta
};
