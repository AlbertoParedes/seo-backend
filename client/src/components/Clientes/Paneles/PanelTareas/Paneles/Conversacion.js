import React, {Component} from 'react'
import moment from 'moment-with-locales-es6'
import data from '../../../../Global/Data/Data'
import 'moment/locale/es'
import firebase from '../../../../../firebase/Firebase';
import renderHTML from 'react-render-html';
import StarRatingComponent from 'react-star-rating-component';
const db = firebase.database().ref();
class Conversacion extends Component{
  constructor(props){
    super(props)
    this.state={
      //id_tarea:this.props.tarea,
      tarea:this.props.tarea,
      conversacion: {}

    }
  }

  shouldComponentUpdate = (newProps, newState) => {
    var update = false
    /*if(this.state.id_tarea!==newProps.id_tarea){
      update = true;
    }*/
    if(this.state.tarea!==newProps.tarea){
      update = true;
    }
    if(this.state.conversacion!==newState.conversacion){
      update = true;
    }
    
    return update
  }

  componentWillReceiveProps = newProps => {
    /*
    if(this.state.id_tarea!==newProps.id_tarea){
      this.setState({id_tarea:newProps.id_tarea},()=>this.getData());
    }*/
    if(this.state.tarea!==newProps.tarea){
      this.setState({tarea:newProps.tarea},()=>this.getData());
    }
  }

  componentWillMount = () => {
    this.getData()
  }

  getData = () => {

    db.child(`Servicios/Tareas/clientes/${this.state.tarea.id_cliente}/tareas/${this.state.tarea.id_tarea}/conversacion`).on("value", snapshot => {
      var conversacion = {}
      snapshot.forEach(data => {
        conversacion[data.key] = data.val();
      });
      this.setState({conversacion})
    })
    
  }

  render(){

    var creacion = {
      creacion : {
        id_empleado: this.state.tarea.creado_por,
        timestamp: this.state.tarea.fecha_creacion,
        campo:'creacion'
      }
    }
    const conversacion = {...creacion, ...this.state.conversacion}    
    
    return(
      <div className='container-conversacion'>

        {/*<ItemConversacion item={creacion} />*/}

        {Object.entries(conversacion).map((o,k,array)=>{
          var index = k
          k = o[0];
          o = o[1]
          var first = false, last=false;


          //si es el del empleado pondremos el nombre encima          
          if(o.type==='msg' &&  o.id_empleado!==this.props.empleado.id_empleado && (!array[index-1] || array[index-1][1].type==='log' || (array[index-1] && array[index-1][1].id_empleado!==o.id_empleado))  ){
            first = true
          }
          // si no existe mas mensajes o si exite y el empleado del siguiente mensaje es distinto, pintaremos el triangulo de abajo
          if(o.type==='msg' && (!array[index+1] || array[index+1][1].type==='log' || (array[index+1] && array[index+1][1].id_empleado!==o.id_empleado) ) ){
            last = true
          }
          
          return(
            o.type==='msg'?
            <ItemMensaje key={k} item={o} empleados={this.props.empleados} empleado={this.props.empleado} first={first} last={last}/>
            :
            <ItemConversacion key={k} item={o} empleados={this.props.empleados}/>
          )
        })

        }
        


      </div>
    )
  }
}

export default Conversacion

class ItemConversacion extends Component{

  constructor(props){
    super(props)
    this.state={
      item: this.props.item,
      mostrarDiferencias:false
    }
  }

  shouldComponentUpdate = (newProps,newState) => {
    var update = false;
    if(this.state.item!==newProps.item){
      update=true;
    }
    if(this.state.mostrarDiferencias!==newState.mostrarDiferencias){
      update=true;
    }
    return update
  }

  componentWillReceiveProps = newProps => {
    if(this.state.item!==newProps.item){
      this.setState({item:newProps.item})
    }
  }



  render(){
    var item = this.state.item
    var str = ''
    var fecha = moment(item.timestamp).locale('es').format('LL')
    fecha = fecha.split(' de ');
    if(fecha[2]===moment().format('YYYY')){
      fecha = `${fecha[0]} ${fecha[1].replace('.','')}`
    }else{
      fecha = `${fecha[0]} ${fecha[1].replace('.','')}, ${fecha[2]}`
    }

    var frase = ''
    if(item.edicion==='agregar'){ frase = 'agregó '}
    else if(item.edicion==='modificar'){ frase = 'modificó '}
    else if(item.edicion==='eliminar'){ frase = 'eliminó ' }


    var oldValue=item.oldValue,newValue=item.newValue;

    if(item.campo==='title'){
      frase+= 'el título';
    }else if(item.campo==='descripcion'){
      frase+= 'la descripción';
    }else if(item.campo==='estado'){
      frase+= 'el estado';
      oldValue = data.taskStatius[oldValue]?data.taskStatius[oldValue].texto:false
      newValue = data.taskStatius[newValue]?data.taskStatius[newValue].texto:false
    }else if(item.campo==='en_proceso'){
      frase+= 'el proceso';
      if(!oldValue){

      }else if(oldValue.type==='simple'){
        oldValue = 'Simple'
      }else if(oldValue.type==='numerico'){
        oldValue = `Numérico: ${oldValue.valor.first_value} / ${oldValue.valor.last_value} ${oldValue.valor.text}`
      }
      if(!newValue){

      }else if(newValue.type==='simple'){
        newValue = 'Simple'
      }else if(newValue.type==='numerico'){
        newValue = `Numérico: ${newValue.valor.first_value} / ${newValue.valor.last_value} ${newValue.valor.text}`
      }
      //oldValue = data.taskStatius[oldValue].texto
      //newValue = data.taskStatius[newValue].texto
    }else if(item.campo==='empleados'){
      frase+= 'los empleados';
      str = ''
      if(oldValue){
        if(oldValue['cliente']){
          str = 'Cliente, '
        }
        Object.entries(oldValue).forEach(([i,o])=>{
          if(i!=='cliente'){
            str = str + `${this.props.empleados[i].nombre} ${this.props.empleados[i].apellidos}, `
          }
        })
        str+=';';str = str.replace(', ;','').replace(';','');
        oldValue = str
      }
      if(newValue){
        str = ''
        if(newValue['cliente']){
          str = 'Cliente, '
        }
        Object.entries(newValue).forEach(([i,o])=>{
          if(i!=='cliente'){
            str = str + `${this.props.empleados[i].nombre} ${this.props.empleados[i].apellidos}, `
          }
        })
        str+=';';str = str.replace(', ;','').replace(';','');
        newValue = str
      }
    }else if(item.campo==='tags'){
      frase+= 'las etiquetas';
      str = ''
      if(oldValue){
        oldValue.forEach((o,i)=>{
          str = str + `${o}, `
        })
        str+=';';str = str.replace(', ;','').replace(';','');
        oldValue = str
      }
      if(newValue){
        str = ''
        newValue.forEach((o,i)=>{
          str = str + `${o}, `
        })
        str+=';';str = str.replace(', ;','').replace(';','');
        newValue = str
      }
    }else if(item.campo==='prioridad'){
      frase+= 'la prioridad';
    }else if(item.campo==='fecha_limite'){
      frase+= 'la fecha límite';
      oldValue = oldValue.split('-')
      oldValue = oldValue[1]+'-'+oldValue[2]+'-'+oldValue[0]
      newValue = newValue.split('-')
      newValue = newValue[1]+'-'+newValue[2]+'-'+newValue[0]

      oldValue = moment(oldValue).locale('es').format('LL')
      newValue = moment(newValue).locale('es').format('LL')
      
    }else if(item.campo==='creacion'){
      frase+= 'creó esta tarea';
    }else if(item.campo==='repetir'){
      frase+= 'la repetición';
    }else if(item.campo==='intervalo'){
      frase+= 'la repetición';
      oldValue = `Repetir: ${data.repetirTask[item.oldValue.repeat].texto}`
      if(data.repetirTask[item.oldValue.repeat].intervalo){
        oldValue+= `<br>Interválo: ${data.repetirTask[item.oldValue.repeat].intervalo_text[0]} ${item.oldValue.valor?data.repetirTask[item.oldValue.repeat].intervalo[item.oldValue.valor]:data.repetirTask[item.oldValue.repeat].intervalo[0]} ${data.repetirTask[item.oldValue.repeat].intervalo_text[1]}`
      }
      if(data.repetirTask[item.oldValue.repeat].dia){
        oldValue+= `<br>${data.repetirTask[item.oldValue.repeat].dia_texto[0]} ${item.oldValue.valorExtra?item.oldValue.valorExtra:data.repetirTask[item.oldValue.repeat].dia[0]}`
      }




      newValue = `Repetir: ${data.repetirTask[item.newValue.repeat].texto}`
      if(data.repetirTask[item.newValue.repeat].intervalo){
        newValue+= `<br>Interválo: ${data.repetirTask[item.newValue.repeat].intervalo_text[0]} ${item.newValue.valor?data.repetirTask[item.newValue.repeat].intervalo[item.newValue.valor]:data.repetirTask[item.newValue.repeat].intervalo[0]} ${data.repetirTask[item.newValue.repeat].intervalo_text[1]}`
      }
      if(data.repetirTask[item.newValue.repeat].dia){
        newValue+= `<br>${data.repetirTask[item.newValue.repeat].dia_texto[0]}: ${item.newValue.valorExtra? item.newValue.valorExtra :data.repetirTask[item.newValue.repeat].dia[0]}`
      }

    }
    
    

    
    return(
      <div className={`item-conversacion`} >
        <div className={`empleado-item-conv`}>
          <span>{`${this.props.empleados[item.id_empleado].nombre} ${this.props.empleados[item.id_empleado].apellidos}`}</span>
          <div className='more-info-task-empleado more-info-task-empleado-conv' >
            {this.props.empleados[item.id_empleado].foto.startsWith('http')?<img src={this.props.empleados[item.id_empleado].foto} />
            :null}
            <div>
              <span>{`${this.props.empleados[item.id_empleado].nombre} ${this.props.empleados[item.id_empleado].apellidos}`}</span>
            </div>
          </div>
        </div>
        
        <div>
          {frase}
          {this.state.more?'mostrar mas':null}
        </div>

        {item.edicion==='agregar' || item.edicion==='modificar' || item.edicion==='eliminar'?
          <div className='show-hide-diff'>
            <span onClick={()=>{this.setState({mostrarDiferencias:this.state.mostrarDiferencias?false:true})}}>{!this.state.mostrarDiferencias?'Mostrar diferencias':'Ocultar diferencias'}</span>
          </div>
        :null}

        <div className='fecha-item-conv'>
          <div>{fecha}</div>
        </div>

        {this.state.mostrarDiferencias?
          <div className='diferencias-tsk'>
            {/*VALOR VIEJO*/}
            {!oldValue || item.edicion==='agregar'?null
            :
              <div className='oldValue-task'>

                {item.campo==='prioridad'?
                  <StarRatingComponent name="app6" starColor="#1090f7" emptyStarColor="#1090f7" value={oldValue} className='prioridad-chat'
                    renderStarIcon={(index, value) => { return (<span> <i className={index <= value ? 'fas fa-star' : 'far fa-star'} /> </span>); }}
                    renderStarIconHalf={() => { return (<span> <span style={{ position: 'absolute' }}><i className="far fa-star" /></span> <span><i className="fas fa-star-half" /></span></span>); }}
                  />
                :null}

                {item.campo!=='prioridad'?renderHTML(oldValue):null}
              </div>
            }
            
            {/*VALOR NUEVO*/}
            {!newValue || item.edicion==='eliminar'?null
            :
              <div className='newValue-task'>
                {item.campo==='prioridad'?
                  <StarRatingComponent name="app6" starColor="#1090f7" emptyStarColor="#1090f7" value={newValue} className='prioridad-chat'
                    renderStarIcon={(index, value) => { return (<span> <i className={index <= value ? 'fas fa-star' : 'far fa-star'} /> </span>); }}
                    renderStarIconHalf={() => { return (<span> <span style={{ position: 'absolute' }}><i className="far fa-star" /></span> <span><i className="fas fa-star-half" /></span></span>); }}
                  />
                :null}

                {item.campo!=='prioridad'?renderHTML(newValue):null}
              </div>
            }
            
          </div>  
        :null}


      </div>
    )
  }

}

class ItemMensaje extends Component{

  constructor(props){
    super(props)
    this.state={
      item: this.props.item,
      first:this.props.first,
      last:this.props.last
    }
  }

  shouldComponentUpdate = (newProps,newState) => {
    var update = false;
    if(this.state.item!==newProps.item){
      update=true;
    }
    if(this.state.first!==newProps.first){
      update=true;
    }
    if(this.state.last!==newProps.last){
      update=true;
    }
    return update
  }

  componentWillReceiveProps = newProps => {
    if(this.state.item!==newProps.item || this.state.first!==newProps.first || this.state.last!==newProps.last){
      this.setState({
        first:newProps.first,
        last:newProps.last,
        item:newProps.item,
      })
    }
  }



  render(){
    var item = this.state.item
    
    var fecha = moment(item.timestamp).locale('es').format('LL')
    fecha = fecha.split(' de ');
    if(fecha[2]===moment().format('YYYY')){
      fecha = `${fecha[0]} ${fecha[1].replace('.','')}`
    }else{
      fecha = `${fecha[0]} ${fecha[1].replace('.','')}, ${fecha[2]}`
    }

    var frase = ''
    if(item.edicion==='agregar'){ frase = 'agregó '}
    else if(item.edicion==='modificar'){ frase = 'modificó '}
    else if(item.edicion==='eliminar'){ frase = 'eliminó ' }

    if(item.campo==='title'){
      frase+= 'el título';
    }else if(item.campo==='descripcion'){
      frase+= 'la descripción';
    }else if(item.campo==='estado'){
      frase+= 'el estado';
    }
    
    return(
      
      
      <div className={`item-mensaje-conversacion ${this.props.empleado.id_empleado===item.id_empleado?'msg-mine':'msg-yours'} `} >
        <div className={`message ${this.state.last?'last':''} `}>
          {this.state.first?
            <div className='nombre-emple-chat'>{this.props.empleados[item.id_empleado].nombre + ' ' + this.props.empleados[item.id_empleado].apellidos}</div>  
          :null}
          {renderHTML(item.mensaje)}
          {/*FECHA DEL MENSAJE*/}
          <div className={`date-emple-chat`}>
            {fecha}
          </div>
        </div>
      </div>
    )
  }

}