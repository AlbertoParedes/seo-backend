export function deleteEspacios(text) {
  text = text.replace(/ /g, '');
  text = text.replace(/,/g, '');
  return text;
}
export function deletePlus(text) {
  text = text.replace(/\+/g, '');
  return text;
}
export function deleteDots(text) {
  text = text.replace(/\./g, '');
  return text;
}
export function replacePlusDot(text) {
  text = text.replace(/\+\./g, '');
  return text;
}
export function correctTelefono(text) {
  text = text.replace(/\+/g, '');
  text = text.replace(/\./g, '');
  text = text.replace(/ /g, '');
  if (text.length >= 9) return false;
  return true;
}

export function cleanDNI(text) {
  text = text.replace(/ /g, '').trim().toUpperCase();
  return text;
}

export function correctEmail(text) {
  if (!text.includes('@')) return true;
  text = text.substring(text.indexOf("@"), text.length);
  if (text.includes('.')) {
    return false;
  }
  return true;
}

export function createId(text) {
  text = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  text = text.replace(/ /g, '_');
  return text.trim()
}



export function isNumber(num) {
  num = num.trim();
  num = num.replace(',', '.');
  if (isNaN(num)) {
    return false;
  }
  return true
}

export function isEmail(text) {
  text = text.trim();
  text = text.replace('@', '');
  if (text.includes('@')) {
    return false;
  }
  return true
}

export function isTelefono(text) {
  text = text.trim();
  if (text.startsWith('+')) {
    text = text.replace('+', '')
  };
  text = text.replace('.', '');
  text = text.replace(/ /g, '');
  if (isNaN(text)) { return false; }
  //if(text.length>=9)return false;
  return true;
}

export function getNumber(num) {
  num = num.trim();
  num = num.replace(',', '.');
  return num
}

export function getDay(date) {
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  return weekday[date.getDay()]
}


export function getDominio(dominio) {

  var idiomas = ['en', 'es', 'ru', 'fr'];

  dominio = dominio.startsWith("http://") ? dominio.replace('http://', '') : dominio;
  dominio = dominio.startsWith("https://") ? dominio.replace('https://', '') : dominio;
  dominio = dominio.startsWith("www.") ? dominio.replace('www.', '') : dominio;


  var idioma = dominio.includes("/") ? dominio.substring(dominio.indexOf('/') + 1, dominio.length) : false;

  if (idioma && idioma.trim() !== '') {
    idioma = idioma.includes("/") ? idioma.substring(0, idioma.indexOf('/')) : idioma;
    idioma = idioma.trim().toLowerCase();
  }


  dominio = dominio.includes("/") ? dominio.substring(0, dominio.indexOf('/')) : dominio;

  if (idioma && idiomas.includes(idioma)) {
    dominio = dominio + '/' + idioma;
  }

  //con esto quitamos hasta el el .com, .es ...
  //dominio = dominio.includes(".") ?  dominio.substring(0, dominio.indexOf('.')) : dominio;

  return dominio.trim().toLowerCase();
}

export function cleanWeb(dominio) {
  dominio = dominio.startsWith("http://") ? dominio.replace('http://', '') : dominio;
  dominio = dominio.startsWith("https://") ? dominio.replace('https://', '') : dominio;
  dominio = dominio.startsWith("www.") ? dominio.replace('www.', '') : dominio;
  dominio = dominio.includes("/") ? dominio.substring(0, dominio.indexOf('/')) : dominio;
  return dominio.trim();
}

export function cleanProtocolo(dominio) {
  dominio = dominio.startsWith("http://") ? dominio.replace('http://', '') : dominio;
  dominio = dominio.startsWith("https://") ? dominio.replace('https://', '') : dominio;
  dominio = dominio.startsWith("www.") ? dominio.replace('www.', '') : dominio;
  dominio = dominio.endsWith("/") ? dominio.substring(0, dominio.length - 1) : dominio;
  return dominio.toLowerCase().trim();
}

export function isLink(dominio) {
  var isLink = 0;
  if (dominio.startsWith("http://") || dominio.startsWith("https://")) {
    isLink++
  }
  if (dominio.startsWith("http://www") || dominio.startsWith("https://www")) {
    dominio = dominio.replace('.', '')
    if (dominio.includes('.')) {
      isLink++
    }
  } else if (dominio.includes(".")) {
    isLink++
  }

  return isLink === 2 ? true : false
}

export function limpiarString(text) {
  text = text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  return text.trim()
}

export function getFecha() {
  var d = new Date();
  var month = d.getMonth() + 1;
  var mes = month < 10 ? '0' + month : month
  return mes;
}

export function getTodayDate() {
  var d = new Date();
  var month = d.getMonth() + 1;
  var mes = month < 10 ? '0' + month : month
  return d.getFullYear() + '-' + mes;
}

export function getNow() {
  var d = new Date();
  var month = d.getMonth() + 1;
  var day = d.getDate()
  var mes = month < 10 ? '0' + month : month
  var dia = day < 10 ? '0' + day : day
  return d.getFullYear() + '-' + mes + '-' + dia;
}

export function getDateChart(date) {
  var month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var arrayDate = date.split('-');

  var stringDate = (+arrayDate[2]) + " " + month_names[(+arrayDate[1]) - 1]
  return stringDate
}

export function getDecimcals(num) {
  var text = (+num).toString()
  if (text.includes('.')) {
    var valor = (+num).toFixed(2)
    if (valor.toString().includes('.00')) {
      return (+valor.replace('.00', ''))
    } else {
      return (+valor)
    }

  }
  return (+num)
}

export function getStringDate(date) {
  var array = date.split('-')
  var month = getMonth((+array[1]))

  return (+array[2]) + " de " + month + ", " + array[0]
}
export function calcularPrecioVenta(compraSinIva, beneficio) {
  return (+compraSinIva) / (1 - ((+beneficio) / 100))
}
export function getMonth(date) {
  var meses = new Array(12);
  meses[0] = "Enero";
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

  return meses[date - 1]
}

export function getDateNTimeFromDate(timestamp) {
  var date = new Date(timestamp);

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var year = date.getFullYear()
  var mes = getMonth(date.getMonth() + 1)

  var text = (date.getDate()) + ' de ' + (mes) + ", " + year;
  text = text + " a las " + (+hours) + ":" + (+minutes)//+":"+(+seconds)
  return text
}

export function getTimestamp() {
  var date = new Date()
  var timestamp = date.getTime();
  return timestamp
}

export function diferenciaEntreFechas(date1, date2) {

  var difference = date2 - date1;

  //var daysDifference = Math.floor(difference/1000/60/60/24);
  //difference -= daysDifference*1000*60*60*24

  var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  difference -= hoursDifference * 1000 * 60 * 60

  var minutesDifference = Math.floor(difference / 1000 / 60);
  difference -= minutesDifference * 1000 * 60

  var secondsDifference = Math.floor(difference / 1000);

  var resultado = 'difference = ' + 'daysDifference' + ' day/s ' + hoursDifference + ' hour/s ' + minutesDifference + ' minute/s ' + secondsDifference + ' second/s ';
  return resultado
}


export function checkNumber(valor) {

  valor = getNumber(valor)
  if (valor.toString().includes('.') || valor.toString().includes(',')) {
    var decimales = valor.toString().substring(valor.toString().indexOf('.'), valor.toString().length)
    if (decimales.length > 2) {
      return getDecimcals(valor)
    } else {
      return valor
    }
  } else {
    return getDecimcals(valor)
  }
}


export function createLogs(multiPath, timestamp, oldValue, newValue, campo, id_empleado, path) {
  var edicion = 'modificar';

  //si es indefinido y no es falso y existe newValue la edicion será agregar
  if (!oldValue && oldValue !== false) {
    edicion = 'agregar'
  }

  //borrar 
  try {
    if (oldValue.toString() !== '' && newValue.toString() === '') {
      edicion = 'borrar'
    }
  } catch (error) { }

  try {
    if (oldValue.toString() === '' && newValue.toString() !== '') {
      edicion = 'agregar'
    }
  } catch (error) { }



  multiPath[path] = {
    id_empleado,
    oldValue: oldValue ? oldValue : false,
    newValue,
    campo,
    timestamp,
    edicion
  }
}

export function getEnlacesRestantesFree(cliente, fecha, filtros_empleados){
  var mes = false;
  var enlaces_restante = 0;
  try {
    mes = cliente.servicios.linkbuilding.free.home.mensualidades[fecha]?cliente.servicios.linkbuilding.free.home.mensualidades[fecha]:false
  } catch (e) {}
  var follows = mes?mes.follows:0
  //var nofollows = mes?mes.nofollows:0
  var follows_done_all = 0

  var follows_empleados = 0, follows_done_empleados = 0
  if(mes && mes.empleados){
    var empleados_filtro = filtros_empleados.items
    Object.entries(mes.empleados).forEach(([k,c])=>{
      if(c.enlaces_follows){ follows_done_all = follows_done_all + Object.entries(c.enlaces_follows).filter(([k2,e])=>{return e===true}).length }//enlaces totales hechos sin tener encuenta a los empleados
      if(empleados_filtro[k] && empleados_filtro[k].checked){
        follows_empleados = follows_empleados + c.follows;
        try {
          follows_done_empleados = follows_done_empleados + Object.entries(c.enlaces_follows).filter(([k2,e])=>{return e===true}).length
        } catch (e) {}
      }
    })
    if(filtros_empleados.todos.checked){ follows_empleados=follows; follows_done_empleados=follows_done_all}

    enlaces_restante = follows_empleados - follows_done_empleados;
  }else{
    //si no tiene empelados asignados habrá que que restarle el total
    enlaces_restante = follows - follows_done_empleados;
  }
  return {enlaces_restante, follows, follows_done_all}
}

export function isEmpty(obj) { for (var key in obj) { if (obj.hasOwnProperty(key)) return false; } return true; }

export function getProcentajeDfDomain(rdDomain,rdDomainDF){

  //(rdDomainDF/rdDomain)*100

  //si alguna de las dos variables esta vacia la sustituiremos por 0
  if(rdDomain==='')rdDomain=0
  if(rdDomainDF==='')rdDomainDF=0

  //convertimos las variables a number, ya que de primeras son strings
  rdDomain = (+rdDomain)
  rdDomainDF = (+rdDomainDF)

  return (rdDomainDF/rdDomain)*100

}

export function getRatioDomain(rdDomain,ldDomain){

  //rdDomain/ldDomain

  //si alguna de las dos variables esta vacia la sustituiremos por 0
  if(rdDomain==='')rdDomain=0
  if(ldDomain==='')ldDomain=0

  //convertimos las variables a number, ya que de primeras son strings
  rdDomain = (+rdDomain)
  ldDomain = (+ldDomain)

  return rdDomain/ldDomain

}
export function getRatioInternas(rdInternas,ldInternas){

  //rdDomain/ldDomain

  //si alguna de las dos variables esta vacia la sustituiremos por 0
  if(rdInternas==='')rdInternas=0
  if(ldInternas==='')ldInternas=0

  //convertimos las variables a number, ya que de primeras son strings
  rdInternas = (+rdInternas)
  ldInternas = (+ldInternas)

  return rdInternas/ldInternas

}


export default getEnlacesRestantesFree;
