import React, {Component} from 'react'
import ListaVistas from '../../../../../Filtros/ListaVistas'
import ItemsFiltro from '../../../../../Filtros/ItemsFiltro'
import ListaFiltros from '../../../../../Filtros/ListaFiltros'
import Fecha from '../../../../../Global/Fecha';
import data from '../../../../../Global/Data/Data';
import functions from '../../../../../Global/functions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setVistaLinkBuilding, setFiltrosEnlacesFreeListaLinkbuilding, setFechaEnlaces, setFiltrosFreePaid } from '../../../../../../redux/actions';
import PopUpLista from '../../../../../Global/Popups/ListaOpciones'
import dotProp from 'dot-prop-immutable';

import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();

class Filtros extends Component{

  constructor(props){
    super(props)
    this.state={
      show_filtros:false,
      show_vistas: false,
      show_calendar:false,
      stringMes:'',
      fecha:this.props.fecha,
      show_new_enlaces:false,
      show_medios:false,
      medios_usados:{},

      new_enlaces:{
        follows:{valor:'Follow'},
        nofollows:{valor:'Nofollow'}
      }
    }
  }

  changeFiltros = (filtros) => {


    if(this.props.filtros.type!==filtros.type){
      this.props.setFiltrosFreePaid(filtros.type)
    }else{
      this.props.setFiltrosEnlacesFreeListaLinkbuilding(filtros)
    }

    //this.props.setFiltrosEnlacesFreeListaLinkbuilding(filtros)

  }

  setFecha = () => {
    var array = this.state.fecha.split('-');
    var mes = (+array[1]);
    var stringMes = data.months[mes-1]
    this.setState({stringMes})
  }

  componentWillReceiveProps = newProps =>{
    if(this.state.fecha!==newProps.fecha){
      this.setState({fecha:newProps.fecha},()=>{this.setFecha()})
    }
  }
  componentWillMount = () => {
    this.setFecha()
  }

  selectOpcionNewEnlace = (id) =>{

    if(this.props.cliente_seleccionado.eliminado || !this.props.cliente_seleccionado.activo || !this.props.cliente_seleccionado.servicios.linkbuilding.free.activo){
      console.log('No se pueden crear enlaces a clientes eliminados o desactivados');
      return null
    }


    if(id==='follows'){

      var num_follows = Object.entries(this.props.enlaces).filter(([k,e])=>e.tipo==='follow');
      if(num_follows.length >= (+this.props.cliente_seleccionado.follows)){
        console.log('Ya se han creado todos los follows para este cliente');
      }else{
        var key = db.child(`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces`).push().key, multiPath = {};
        multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces/${key}`] = {
          id_empleado:this.props.empleado.id_empleado, status:'new',id_enlace:key, tipo:'follow'
        }
        db.update(multiPath)
        .then(()=>{ console.log('OK'); })
        .catch( err => console.log(err));
      }

    }else if(id==='nofollows'){
      var num_nofollows = Object.entries(this.props.enlaces).filter(([k,e])=>e.tipo==='nofollow');
      if(num_nofollows.length >= (+this.props.cliente_seleccionado.nofollows)){
        console.log('Ya se han creado todos los nofollows para este cliente');
      }else{
        var key = db.child(`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces`).push().key, multiPath = {};
        multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces/${key}`] = {
          id_empleado:this.props.empleado.id_empleado, status:'new',id_enlace:key, tipo:'nofollow'
        }
        db.update(multiPath)
        .then(()=>{ console.log('OK'); })
        .catch( err => console.log(err));
      }
    }
  }

  changeMediosUsados = () => {
    var medios_usados = {};
    Object.entries(this.props.cliente_seleccionado.servicios.linkbuilding.free.home.medios_usados_follow).forEach(([k,m])=>{
      medios_usados[k]={
        valor:this.props.medios[m.categoria].medios[k].web
      }
    })
    this.setState({medios_usados, show_medios:true})
  }

  goLink = (id) =>{
    console.log(id);
  }


  unlockCliente = () => {

    try { if(this.props.cliente_seleccionado.servicios.linkbuilding.free.editando_por.id_empleado===this.props.empleado.id_empleado){return null}} catch (e) { }

    var multiPath = {}
    multiPath[`Empleados/${this.props.empleado.id_empleado}/session/cliente_seleccionado`]=this.props.cliente_seleccionado.id_cliente
    multiPath[`Empleados/${this.props.empleado.id_empleado}/session/subpanel`]='linkbuilding_free'
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/editando_por`]={ id_empleado: this.props.empleado.id_empleado, nombre: this.props.empleado.nombre+' '+this.props.empleado.apellidos, subpanel:'linkbuilding_free'}

    try {
      if(this.props.cliente_seleccionado.servicios.linkbuilding.paid.editando_por.id_empleado===this.props.empleado.id_empleado){
          multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/editando_por`]=null
      }
    } catch (e) {}

    try {
      if(this.props.empleado.session.cliente_seleccionado && this.props.empleado.session.cliente_seleccionado !== this.props.cliente_seleccionado.id_cliente){
        multiPath[`Clientes/${this.props.empleado.session.cliente_seleccionado}/servicios/linkbuilding/free/editando_por`]=null
        multiPath[`Empleados/${this.props.empleado.id_empleado}/session/subpanel`]='linkbuilding_free'
      }
    } catch (e) { }
    console.log(multiPath);
    if(Object.keys(multiPath).length>0){
      db.update(multiPath)
      .then(()=>{console.log('Ok');})
      .catch(err=>{console.log(err);})
    }

  }

  changeVista = (vistas) => {
    var multiPath = {}
    var vistaDisponible = Object.entries(vistas.items).find(([k,v])=>{return v.checked})
    if(vistaDisponible){
      multiPath[`Empleados/${this.props.empleado.id_empleado}/session/vista`]=vistaDisponible[0]
      db.update(multiPath)
    }
    this.props.setVistaLinkBuilding(vistas)
  }


  render(){


    var blocked = false;
    var nombreEmpleado = ''
    try {
      if(this.props.cliente_seleccionado.servicios.linkbuilding.free.editando_por.id_empleado!==this.props.empleado.id_empleado /*&& this.props.empleado.session.linkbuilding.editando_a!==this.props.cliente_seleccionado.id_cliente*/){
        blocked = true;
        nombreEmpleado = this.props.cliente_seleccionado.servicios.linkbuilding.free.editando_por.nombre
      }
    } catch (e) {}



    return(
      <div className='pr'>
        <ItemsFiltro filtros={this.props.filtros} updateFiltros={(filtros=>this.changeFiltros(filtros))}/>
        <div className='opciones-alumnos'>
          <div className='deg-opt'></div>

          <div className='btn-options pr'>
            <i className="material-icons"> calendar_today </i> <span>{this.state.stringMes}</span>
            <Fecha setFecha={fecha=>this.props.setFechaEnlaces(fecha)} clss={'input-fecha-enlaces'} id={'date-enlaces-free'} position={'fecha_enlaces_position'} month={this.props.fecha.split('-')[1]} year={this.props.fecha.split('-')[0]}/>
          </div>

          <div className='btn-options pr' onClick={()=>this.setState({show_filtros:this.state.show_filtros?false:true})}>
            <i className="material-icons"> filter_list </i> <span>Filtros</span>
            {this.state.show_filtros?
                <ListaFiltros filtros={this.props.filtros} updateFiltros={(filtros=>this.changeFiltros(filtros))} close={()=>this.setState({show_filtros:false})}/>:null
            }
          </div>

          <div className='btn-options pr' onClick={()=>this.setState({show_vistas:this.state.show_vistas?false:true})}>
            <i className="material-icons"> visibility </i> <span>Vistas</span>
            {this.state.show_vistas?
                <ListaVistas vistas={this.props.vistas} updateVistas={(vistas)=>this.changeVista(vistas)} close={()=>this.setState({show_vistas:false})}/>:null
            }
          </div>

          {/*Items barra*/}

          {this.props.cliente_seleccionado?
            <div className={`item-container-icon-top-bar pr ${this.state.show_medios?' color-azul':''}`} >
              <i onClick={()=>this.changeMediosUsados()} className="material-icons hover-azul middle-item">account_balance</i>
              {this.state.show_medios ?
                <PopUpLista
                  selectOpcion={(id)=>{this.goLink(id)}}
                  opciones={this.state.medios_usados} title='Medios usados'
                  _class='rigth-popup-medios-usados' _class_div='max-width' _class_container='size-medios-popup scroll-bar-exterior'
                  close={()=>this.setState({show_medios:false})}
                  tag='a' buscar={true}/>
              :null}
            </div>
            :null
          }

          {this.props.cliente_seleccionado?
            <div className={`item-container-icon-top-bar pr ${this.state.show_new_enlaces?'color-azul':''}`} >
              <i onClick={()=>this.setState({show_new_enlaces:true})} className="material-icons hover-azul middle-item">add</i>
              {this.state.show_new_enlaces?
                <PopUpLista selectOpcion={(id)=>this.selectOpcionNewEnlace(id)} opciones={this.state.new_enlaces} _class='opciones-search-show position-add-enlaces' close={()=>this.setState({show_new_enlaces:false})}/>:null
              }
            </div>
            :null
          }



          {/*
          <div className={`item-container-icon-top-bar pr ${this.state.show_new_cliente?' color-azul':''}`} >
            <i onClick={()=>this.changeEdit()} className="material-icons hover-azul middle-item">save_alt</i>
          </div>
          */}



          {blocked && this.props.cliente_seleccionado?
            <div className={`item-container-icon-top-bar pr ${this.state.show_new_cliente?'middle-item color-azul':''}`} >
              <i onClick={()=>this.unlockCliente()} className="material-icons lock-cliente" data-lock='lock' data-open-lock='lock_open'></i>
              <PopUpLista selectOpcion={()=>{var click = null;}} hover={true} opciones={{cliente:{valor:'Editando por '+nombreEmpleado}}} _class='opciones-search-show position-add-enlaces-lock' close={()=>{var click=null;}}/>
            </div>
            :null
          }



        </div>

      </div>
    )
  }

}

function mapStateToProps(state){return{
  vistas : state.linkbuilding.vistas,
  fecha:state.linkbuilding.enlaces.fecha ,
  filtros: state.linkbuilding.enlaces.tipos.free.paneles.lista.filtros,
  enlaces:state.linkbuilding.enlaces.tipos.free.enlaces,
  cliente_seleccionado: state.cliente_seleccionado,
  empleado:state.empleado,
  medios: state.linkbuilding.medios.tipos.free.medios
}}
function  matchDispatchToProps(dispatch){ return bindActionCreators({ setVistaLinkBuilding, setFiltrosEnlacesFreeListaLinkbuilding, setFechaEnlaces, setFiltrosFreePaid }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(Filtros);
