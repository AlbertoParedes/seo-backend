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

function limpiarString(text){
  text = text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  return text.trim()
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
  cleanProtocolo
};
