import React, { Component } from 'react';
import firebase from '../firebase/Firebase';
import XLSX from 'xlsx';
import functions from './Global/functions'
import data from './Global/Data/Data'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setClientes, setPanelTracking, setPanelHome, setClienteSeleccionado, setEmpleados, setFiltrosTrackingLista, setFiltrosTrackingKeywords } from '../redux/actions';

import Tracking from './Tracking/Tracking'


const db = firebase.database().ref();

class Home extends Component {

  constructor(props){
      super(props);
      this.state={
        data: data,
        listeners:false,
        empleado: this.props.empleado,
      }
    }

  componentWillReceiveProps = newProps => {
    if(this.state.empleado!==newProps.empleado){
      if(newProps.empleado && this.state.listeners===false){
        this.setState({empleado:newProps.empleado,listeners:true},()=>{
          this.getData()
        })
      }
    }

    if(this.props.clientes!==newProps.clientes){
      if(this.props.cliente_seleccionado){
        if(!newProps.clientes[newProps.cliente_seleccionado.id_cliente]){
          this.props.setClienteSeleccionado(null)
        }else{
          this.props.setClienteSeleccionado(newProps.clientes[newProps.cliente_seleccionado.id_cliente])
        }
      }
    }

  }


  componentDidMount = () => {
    if(this.state.empleado){
      this.setState({listeners:true},()=>{
        this.getData()
      })
    }

  }
  getData = () => {
    //console.log('Getting data...');

    db.child('Clientes').on("value", snapshot =>{
      var clientes = {}, multiPath={};
      snapshot.forEach( data => {
        clientes[data.key]=data.val();
        clientes[data.key].id_colegio=data.key;
      });
      this.props.setClientes(clientes);
    })

    db.child('Empleados').on("value", snapshot =>{
      var empleados = {}, multiPath={},checkedAll = false, filtro=data.filtros.filtro_tracking.lista;

      if(!this.props.empleado.clientes || !this.props.empleado.clientes.tracking) checkedAll=true;

      snapshot.forEach( data => {
        empleados[data.key]=data.val();

        filtro.empleados.items[data.key]={
          text: data.val().nombre,
          text_info: data.val().nombre,
          checked: checkedAll || (data.val().clientes && data.val().clientes.tracking && this.props.empleado.id_empleado===data.key) ? true : false
        }

      });

      this.props.setEmpleados(empleados);

      if(!this.props.filtros_tracking_lista.empleados || (this.props.filtros_tracking_lista.empleados && Object.keys(this.props.filtros_tracking_lista.empleados.items).length !== Object.keys(filtro.empleados.items).length) ){
        filtro.empleados.todos.checked = checkedAll
        this.props.setFiltrosTrackingLista(filtro)
      }

      /*
      Object.entries(empleados).forEach(([k,o])=>{
        multiPath[`Empleados/${k}/acceso/tracking`]=true;
        multiPath[`Empleados/${k}/privilegios/tracking`]={
          view:true,
          edit:{
              add_cliente:false,
              status_cliente:true,
              add_keyword: true,
              status_keyword: true
          }
        }
      })*/
      //db.update(multiPath)



    })



    var empleado = {
      apellidos: 'Laserna',
      email: 'eduardolaserna@yoseomarketing.com',
      foto: 'x',
      id_empleado: 'x',
      nombre: 'Eduardo',
      password: 'eduardolaserna',
      role: 'Consultor seo',
      username: 'eduardolaserna',
    }
    //db.child('Empleados').push(empleado);

  }
  componentWillMount = () => {
    this.props.setPanelHome('linkbuilding')
    //this.props.setFiltrosAlumnos(data.filtros.filtros_alumnos);
    //this.props.setFiltrosColegios(data.filtros.filtros_colegios);
    this.props.setPanelTracking('lista');
    this.props.setFiltrosTrackingKeywords(data.filtros.filtro_tracking.keywords)
    //this.props.setPanelAlumnos('lista');

  }

  realizarCopia = () =>{
    db.once("value", snapshot =>{
      var database = {};
      snapshot.forEach( data => {
        database[data.key]=data.val();
      });
      console.log(database);
      var element = document.createElement("a");
      var file = new Blob([JSON.stringify(database)], {type: 'text/json'});
      element.href = URL.createObjectURL(file);
      element.download = `tracking_bbdd_error.json`;
      element.click();
    })
  }

  render() {
    if(!this.state.empleado)return null;
    return (
      <div className="container-app">

      {/*<div onClick={()=>this.realizarCopia()}>realizar copia</div>*/}

        <div className='menu-bar'>

          <div className='container-icons-bar'>
            <div id='btn-colegio' onClick={()=>this.props.setPanelHome('linkbuilding')} className={`${this.props.panel_home==='linkbuilding'?'active':''}`} ><i className="material-icons"> track_changes </i></div>
          </div>

        </div>

        <div className='container-paneles'>

          {this.props.clientes? <Tracking visibility={this.props.panel_home==='linkbuilding'?true:false} />:null }

        </div>


      </div>
    );
  }
}

function mapStateToProps(state){return{ clientes : state.clientes, empleado:state.empleado, panel_home:state.panel_home, cliente_seleccionado:state.cliente_seleccionado, filtros_tracking_lista:state.filtros_tracking_lista  }}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setClientes, setPanelTracking, setPanelHome, setClienteSeleccionado, setEmpleados, setFiltrosTrackingLista, setFiltrosTrackingKeywords }, dispatch) }

export default connect(mapStateToProps, matchDispatchToProps)(Home);
