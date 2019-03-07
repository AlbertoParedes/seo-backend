import React, { Component } from 'react';
import Switch from '../../../Global/Switch'
import CheckBox from '../../../Global/CheckBox'
import firebase from '../../../../firebase/Firebase';
import data from '../../../Global/Data/Data'
import functions from '../../../Global/functions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setClienteSeleccionado, setPanelTracking, setKeywordTrackingSelected, setEditClientesTracking, setEditKeywordsTracking } from '../../../../redux/actions';
import $ from 'jquery'
import dotProp from 'dot-prop-immutable';
const db = firebase.database().ref();

class ItemCliente extends Component {

  constructor(props){
      super(props);
      this.state={
        showEmpleados:false,
        lista_empleados: {}
      };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.props.tracking_clientes_edit!==nextProps.tracking_clientes_edit){return true}
    if(this.props.empleado!==nextProps.empleado){return true}
    if(nextProps.cliente_seleccionado !== this.props.cliente_seleccionado){
      //solo renderizamos el componente si se ha selccionado o si estaba seleccionado pero se ha seleccionado otro. Asi evitamos renderizar cada uno de los alumnos.
      if(nextProps.cliente.id_cliente===nextProps.cliente_seleccionado.id_cliente ){ return true;
      }else if(this.props.cliente_seleccionado && nextProps.cliente.id_cliente===this.props.cliente_seleccionado.id_cliente){ return true; }
    }
    if(nextProps.cliente !== this.props.cliente){ return true; }
    if(this.state.showEmpleados!==nextState.showEmpleados)return true
    return false;
  }

  seleccionarCliente = () => {
    if(this.props.cliente_seleccionado!==this.props.cliente){
      this.props.setKeywordTrackingSelected(null);
      this.props.setClienteSeleccionado(this.props.cliente)
      this.props.setPanelTracking('keywords')


      if(
        ( this.props.empleado.clientes && this.props.empleado.clientes.tracking && this.props.empleado.clientes.tracking[this.props.cliente.id_cliente] )
        ||
        (this.props.empleado.privilegios && this.props.empleado.privilegios.tracking && this.props.empleado.privilegios.tracking.edit.edit_keywords)
      ){
        console.log('tienes permiso');
      }else{
        this.props.setEditKeywordsTracking({activo: false, seleccionados:{}})
      }


    }else{
      this.props.setPanelTracking('keywords')
    }


  }

  mensajeInformativo = (text) =>{var element = $(`#tracking-mensaje`); if(!$(element).attr('class').includes('show')){ $(element).text(text).addClass('show'); setTimeout( function(){ $(element).removeClass('show'); }, 3500 );}}

  openAlumnos = () => {
    if(this.props.n_alumnos>0){
      this.props.setClienteSeleccionado(this.props.cliente)
      this.props.setPanelTracking('panel_alumnos')
    }else{
      this.mensajeInformativo('No se han inscrito alumnos');
    }
  }

  callbackSwitch = (json) => {
    var multiPath = {}
    if(json.id==='activo'){
      //si eres el empleado de ese cliente si vas a poder modificar el activo
      if( (this.props.cliente.empleados && this.props.cliente.empleados.tracking[this.props.empleado.id_empleado])   ||   this.props.empleado.privilegios.tracking.edit.status_cliente){

        multiPath[`Clientes/${this.props.cliente.id_cliente}/tracking/activo`]=json.valor
        db.update(multiPath)
        .then(()=>{ console.log('Guardado correctamente'); })
        .catch((err)=>{ this.mensajeInformativo('Error') })
      }else{
        this.mensajeInformativo('No tiene permiso para modificar este cliente');
      }
    }
  }

  openEmpleados = () => {
    if(!this.props.cliente.empleados || (this.props.empleado.privilegios && this.props.empleado.privilegios.tracking && this.props.empleado.privilegios.tracking.edit.change_empleados) || (this.props.cliente.empleados.tracking && this.props.cliente.empleados.tracking[this.props.empleado.id_empleado])   ){

      var empleados = this.props.empleados;
      Object.entries(empleados).forEach(([k,e])=>{
        if(this.props.cliente.empleados && this.props.cliente.empleados.tracking && this.props.cliente.empleados.tracking[e.id_empleado]){
          empleados[k].checked = true
        }else{
          empleados[k].checked = false
        }
      })
      this.setState({showEmpleados:true, lista_empleados: empleados})

    }

  }

  updateCheckBox = (value) => {

    if(
      (this.props.cliente.empleados && this.props.cliente.empleados.tracking && this.props.cliente.empleados.tracking[this.props.empleado.id_empleado])
      || (this.props.empleado.privilegios && this.props.empleado.privilegios.tracking && this.props.empleado.privilegios.tracking.edit.edit_clientes )
    ){
      var seleccionados = dotProp.set(this.props.tracking_clientes_edit.seleccionados, `${this.props.cliente.id_cliente}.checked`, value) ;
      seleccionados[this.props.cliente.id_cliente].id_cliente=this.props.cliente.id_cliente
      this.props.setEditClientesTracking({ activo:this.props.tracking_clientes_edit.activo , seleccionados })
      console.log(seleccionados);
      //this.setState({empleados})
    }else{
      this.mensajeInformativo('No tiene permiso para seleccionar este cliente')
    }



  }

  render() {

    var empleados = '-';
    if(this.props.cliente.empleados && this.props.cliente.empleados.tracking){
      var empleados_ordenados = Object.entries(this.props.cliente.empleados.tracking)
      if(empleados_ordenados.length>1){
        empleados_ordenados.sort((a, b) =>{ a=a[1]; b=b[1]
          if (a.toLowerCase() > b.toLowerCase()) { return 1; }
          if (a.toLowerCase() < b.toLowerCase()) { return -1; }
          return 0;
        });
      }
      empleados_ordenados.forEach((e,k)=>{
        if(k===empleados_ordenados.length-1){ empleados = empleados+' y '+e[1];
        }else{ empleados = empleados+', '+e[1]; }
      })
      empleados = empleados.replace('-,','')
      empleados = empleados.replace('- y ','')
    }
    var permiso_edit = (this.props.cliente.empleados && this.props.cliente.empleados.tracking && this.props.cliente.empleados.tracking[this.props.empleado.id_empleado])
                      || (this.props.empleado.privilegios && this.props.empleado.privilegios.tracking && this.props.empleado.privilegios.tracking.edit.edit_clientes )? true: false

    return(
      <tr data-id={this.props.cliente.id_cliente} className={`${this.props.cliente_seleccionado && this.props.cliente_seleccionado.id_cliente===this.props.cliente.id_cliente?'active-row-table':''}`}>

        {this.props.tracking_clientes_edit.activo?

          <td className={`cli-checkbox`} >
            <CheckBox _class={`checkbox-in-table ${!permiso_edit?'no-selecionable':''}`} checked={!this.props.tracking_clientes_edit.seleccionados[this.props.cliente.id_cliente]?false:this.props.tracking_clientes_edit.seleccionados[this.props.cliente.id_cliente].checked } changeValue={value=>this.updateCheckBox(value)}/>
          </td>

          :null
        }

        <td className='cli-web'>
          <div className='edit-container'>
            <span className={`${!this.props.cliente.tracking.activo?'color_parado':''} ${this.props.cliente.eliminado?'color_eliminado':''}`} > {functions.cleanProtocolo(this.props.cliente.web)} </span>
          </div>
        </td>

        <td  className='cli-keys'>
          <span> {this.props.cliente.tracking.keywords?Object.keys(this.props.cliente.tracking.keywords).length:0} </span>
        </td>

        <td  className='cli-empleados pr' onClick={()=>this.openEmpleados()}>
          <div className={`names-empl`} > {empleados} </div>
          {this.state.showEmpleados ?<ListaEmpleados empleados={this.state.lista_empleados} cliente ={this.props.cliente} close={()=>this.setState({showEmpleados:false})}/ >:null}
        </td>

        <td className='cli-activo'>
          <div className='align-center' >
            <Switch class_div={'switch-table'} callbackSwitch={this.callbackSwitch} json={{id:'activo' }} valor={this.props.cliente.tracking.activo}/>
          </div>
        </td>

        <td onClick={()=>{this.seleccionarCliente()}} className='cli-more'>
          <i className="material-icons align-center">chevron_right</i>
        </td>
      </tr>

    )
  }
}

function mapStateToProps(state){return{ cliente_seleccionado: state.cliente_seleccionado, empleados:state.empleados, empleado:state.empleado, tracking_clientes_edit:state.tracking_clientes_edit, }}
function matchDispatchToProps(dispatch){ return bindActionCreators({  setClienteSeleccionado, setPanelTracking, setKeywordTrackingSelected, setEditClientesTracking, setEditKeywordsTracking }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemCliente);



class ListaEmpleados extends Component {

  constructor(props){
      super(props);
      this.state={
        empleados:this.props.empleados
      };
  }

  componentWillMount = () => {document.addEventListener('mousedown',this.clickOutSide, false);}
  componentWillUnmount = () => {document.removeEventListener('mousedown',this.clickOutSide, false);}
  clickOutSide = (e) => {if(!this.node.contains(e.target)){this.close()}}
  close = () =>{this.props.close()}
  mensajeInformativo = (text) =>{var element = $(`#tracking-mensaje`); if(!$(element).attr('class').includes('show')){ $(element).text(text).addClass('show'); setTimeout( function(){ $(element).removeClass('show'); }, 3500 );}}

  updateCheckBox = (e,value) => {
    var empleados = dotProp.set(this.state.empleados, `${e.id_empleado}.checked`, value) ;
    this.setState({empleados})
  }

  guardarEmpleados = () => {
    //obtenemos los empelados seleccionados
    var empleados_selecionados = Object.entries(this.state.empleados).filter(([k,e])=>{return e.checked})

    var objeto = {}, multiPath={}
    //creamos el nuevo objeto con los empleados para este cliente
    empleados_selecionados.forEach((a, b) =>{ a=a[1]; b=b[1];
      objeto[a.id_empleado]=a.nombre;
      multiPath[`Empleados/${a.id_empleado}/clientes/tracking/${this.props.cliente.id_cliente}`]=this.props.cliente.dominio
    });
    multiPath[`Clientes/${this.props.cliente.id_cliente}/empleados/tracking`]=objeto;

    //eliminamos al cliente de los empleados antes de sufrir la modificacion
    if(this.props.cliente.empleados && this.props.cliente.empleados.tracking){
      Object.entries(this.props.cliente.empleados.tracking).forEach(([k,e])=>{
        if(!objeto[k]){//si no existe en el nuevo objeto que hemos creado, eliminaremos del empleado a este cliente
          multiPath[`Empleados/${k}/clientes/tracking/${this.props.cliente.id_cliente}`]=null
        }
      })
    }

    db.update(multiPath)
    .then(()=>{
      this.mensajeInformativo('Empleados guardados correctamente')
      this.props.close()
    })
    .catch(err=>{
      console.log(err);
      this.mensajeInformativo('No se han podido guardar los empleados')
    })


  }

  render() {

    return(

      <div className='pop-up-empleados' onClick={e=>e.stopPropagation()} ref={node=>this.node=node}>

        <div className='container-empleados container-list-filter'>
          <div className='title-option-filter  title-empleados-pop-up'>Empleados</div>
          {Object.entries(this.state.empleados).map(([k,e])=>{
              return(
                <CheckBox key={k} text={e.nombre} checked={e.checked} changeValue={value=>this.updateCheckBox(e,value)}/>
              )
            })
          }
        </div>

          <div className="btn-aceptar-confirm" onClick={()=>{this.guardarEmpleados()}}>Guardar</div>

      </div>

    )

  }

}
//{/*<div onClick={()=>this.updateEmpleados(e)} >{e.nombre}</div>*/}
