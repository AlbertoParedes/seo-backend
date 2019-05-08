import React, { Component } from 'react';
import firebase from '../firebase/Firebase';
import XLSX from 'xlsx';
import functions from './Global/functions'
import data from './Global/Data/Data'
//import bbdd from './Global/Data/linkbuilding_bbdd'
import bbdd from './Global/Data/final_clientes'
import dotProp from 'dot-prop-immutable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  setClientes,
  setPanelTracking,
  setPanelHome,
  setClienteSeleccionado,
  setEmpleados,
  setEmpleado,
  //setFiltrosTrackingLista,
  //setFiltrosTrackingKeywords,
  setFiltrosClientesLista,
  setPanelClientes,

  /*Metodos linkbuilding*/
  setVistaLinkBuilding,
  setPanelClientesLinkbuilding,
  setFiltrosClientesFreeListaLinkbuilding,
  setFiltrosMediosFreeListaLinkbuilding,
  setPanelMediosFreeLinkbuilding,
  setFiltrosMediosPaidListaLinkbuilding,
  setPanelMediosPaidLinkbuilding,
  setFiltrosEnlacesFreeListaLinkbuilding,
  setFiltrosEnlacesPaidListaLinkbuilding,
  setPanelEnlacesFreeLinkbuilding,
  setPanelEnlacesPaidLinkbuilding,
  setPanelClientesFreeLinkbuilding,
  setPanelClientesPaidLinkbuilding,
  setFiltrosClientesPaidListaLinkbuilding,
  setMedioSeleccionadoPaid,
  setPlataformas,
  selectMedioMediosGratuitos,

  setMediosPaid,
  setMediosFree,

  setFiltrosFreePaid,

  setFiltrosTracking

} from '../redux/actions';

import Clientes from './Clientes/Clientes'
import Tracking from './Tracking/Tracking'
import LinkBuilding from './LinkBuilding/LinkBuilding'



const db = firebase.database().ref();
var PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

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

    if(this.props.medios_paid!==newProps.medios_paid){
      if(this.props.medio_seleccionado_paid){
        if(!newProps.medios_paid[newProps.medio_seleccionado_paid.id_medio]){
          this.props.setMedioSeleccionadoPaid(null)
        }else{
          this.props.setMedioSeleccionadoPaid(newProps.medios_paid[newProps.medio_seleccionado_paid.id_medio])
        }
      }
    }

    if(this.props.medios_free!==newProps.medios_free){
      if(this.props.medio_seleccionado_free && this.props.categoria_seleccionada){
        if(!newProps.medios_free[this.props.categoria_seleccionada.id].medios[newProps.medio_seleccionado_free.id_medio]){
          this.props.selectMedioMediosGratuitos(null)
        }else{
          this.props.selectMedioMediosGratuitos(newProps.medios_free[this.props.categoria_seleccionada.id].medios[newProps.medio_seleccionado_free.id_medio])
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
    var date = functions.getTodayDate()

    db.child('Clientes').on("value", snapshot =>{
      var clientes = {}, multiPath={};
      snapshot.forEach( data => {
        clientes[data.key]=data.val();

        //comprobamos que existe la mensualidad de los enlaces Gratuitos
        if( (!data.val().servicios.linkbuilding.free.home.mensualidades || !data.val().servicios.linkbuilding.free.home.mensualidades[date]) && data.val().servicios.linkbuilding.free.activo){
          var empleadosFree = data.val().empleados && data.val().empleados.linkbuilding_free?data.val().empleados.linkbuilding_free:null
          multiPath[`Clientes/${data.key}/servicios/linkbuilding/free/home/mensualidades/${date}`]={ comentario:'', follows:data.val().follows, nofollows:data.val().nofollows, empleados: empleadosFree}
        }
        //sumaremos al bote y añadiremos la mensualidad de los enlaces de pago a los clientes que tengan activado el linkbuilding de pago
        if(!data.val().eliminado && data.val().servicios.linkbuilding.paid.activo && !data.val().servicios.linkbuilding.paid.home.mensualidades[date]){
          var empleadosPaid = data.val().empleados && data.val().empleados.linkbuilding_paid?data.val().empleados.linkbuilding_paid:null
          multiPath[`Clientes/${data.key}/servicios/linkbuilding/paid/home/mensualidades/${date}`]={
            beneficio:(+data.val().servicios.linkbuilding.paid.beneficio),
            comentario:'',
            empleados:empleadosPaid,
            inversion_mensual:(+data.val().servicios.linkbuilding.paid.inversion_mensual),
            porcentaje_perdida:(+data.val().servicios.linkbuilding.paid.porcentaje_perdida),

          }
          //sumamos al bote la inversion mensual sin la comision
          var disponible_mensual = data.val().servicios.linkbuilding.paid.inversion_mensual * ( (100 - data.val().servicios.linkbuilding.paid.beneficio) / 100)
          multiPath[`Clientes/${data.key}/servicios/linkbuilding/paid/bote`]=disponible_mensual + data.val().servicios.linkbuilding.paid.bote
        }

        /*try {
          if(!data.val().eliminado && data.val().linkbuilding.free.home.mensualidades['2019-05'].empleados['-LJEKACe0OpW5cD3OCod'].eliminado){
            multiPath[`Clientes/${data.key}/servicios/linkbuilding/free/home/mensualidades/2019-05/empleados/-LJEKACe0OpW5cD3OCod/eliminado`] = null
            multiPath[`Clientes/${data.key}/servicios/linkbuilding/free/home/mensualidades/2019-05/empleados/-LJEKACe0OpW5cD3OCod/follows`] = data.val().linkbuilding.free.home.mensualidades['2019-05'].empleados['-LJEKACe0OpW5cD3OCod'].follows
            multiPath[`Clientes/${data.key}/servicios/linkbuilding/free/home/mensualidades/2019-05/empleados/-LJEKACe0OpW5cD3OCod/nofollows`] = data.val().linkbuilding.free.home.mensualidades['2019-05'].empleados['-LJEKACe0OpW5cD3OCod'].nofollows
          }
        } catch (e) {

        }*/



      });
      if(Object.keys(multiPath).length>0){
        db.update(multiPath)
        .then(()=>{console.log('OK')})
        .catch(err=>console.log(err))
      }else{

        //Asignamos las sesiones guardadas
        if(this.props.empleado.session && this.props.empleado.session.cliente_seleccionado){
          this.props.setClienteSeleccionado(clientes[this.props.empleado.session.cliente_seleccionado])
        }
        this.props.setClientes(clientes);
      }

    })

    db.child('Servicios/Linkbuilding/Paid/Medios/medios').on("value", snapshot =>{
      var medios = {}, multiPath={};
      snapshot.forEach( data => {
        medios[data.key]=data.val();
        //multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${data.key}/activo`]=true
        //multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${data.key}/eliminado`]=false
      });
      //console.log(multiPath);
      //db.update(multiPath)
      this.props.setMediosPaid(medios);
    })

    db.child('Servicios/Linkbuilding/Free/Medios/categorias').on("value", snapshot =>{
      var medios = {}, multiPath={};
      snapshot.forEach( data => {
        medios[data.key]=data.val();
        medios[data.key].valor=data.val().nombre;//Este nuevo atributo nos sirve para ver el desplegable de categorias en cada enlace gratuito que se haga
        Object.entries(data.val().medios).forEach(([k,m])=>{
          multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${data.key}/medios/${k}/activo`]=true
        })
        //multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${data.key}/activo`]=true
        //multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${data.key}/eliminado`]=false
      });
      //console.log(multiPath);
      //db.update(multiPath)
      this.props.setMediosFree(medios);
    })

    db.child('Servicios/Linkbuilding/Paid/Plataformas/lista').once("value", snapshot =>{
      var plataformas = {}
      snapshot.forEach( data => {
        plataformas[data.key]=data.val();
      });
      this.props.setPlataformas(plataformas);
    })

    db.child('Empleados').on("value", snapshot =>{
      var empleados = {}, multiPath={};
      snapshot.forEach( data => {
        empleados[data.key]=data.val();
      });

      var empleados_linkbuilding_free = dotProp.set(this.props.filtros_lb_enlaces_free, `empleados.title`, 'Empleados');
      var empleados_linkbuilding_paid = dotProp.set(this.props.filtros_lb_enlaces_paid, `empleados.title`, 'Empleados');
      var empleados_tracking_clientes = dotProp.set(this.props.filtros_tracking_clientes, `empleados.title`, 'Empleados');

      Object.entries(empleados).forEach(([k,e])=>{
        if(e.acceso && e.acceso.linkbuilding_free){
          if(!empleados_linkbuilding_free.empleados.items[k]){
            empleados_linkbuilding_free.empleados.items[k]={
              text: e.nombre,
              text_info: e.nombre,
              checked:this.props.empleado.id_empleado===k?true:false,
              valor:e.nombre
            }
          }
        }

        if(e.acceso && e.acceso.linkbuilding_paid){
          if(!empleados_linkbuilding_paid.empleados.items[k]){
            empleados_linkbuilding_paid.empleados.items[k]={
              text: e.nombre,
              text_info: e.nombre,
              checked:this.props.empleado.id_empleado===k?true:false,
              valor:e.nombre
            }
          }
        }

        if(e.acceso && e.acceso.tracking){
          if(!empleados_tracking_clientes.empleados.items[k]){
            empleados_tracking_clientes.empleados.items[k]={
              text: e.nombre,
              text_info: e.nombre,
              checked:this.props.empleado.id_empleado===k?true:false,
              valor:e.nombre,
              tiene_clientes:e.clientes && e.clientes.tracking?true:false
            }
          }
        }

        console.log(e);

      })
      var anyEmpleado = Object.entries(empleados_linkbuilding_free.empleados.items).some(([k,e])=>{return e.checked})
      if(!anyEmpleado) {
        empleados_linkbuilding_free.empleados.todos.checked=true
        Object.entries(empleados_linkbuilding_free.empleados.items).forEach(([k,e])=>{
          empleados_linkbuilding_free.empleados.items[k].checked=true
        })
      }

      var anyEmpleadoPaid = Object.entries(empleados_linkbuilding_paid.empleados.items).some(([k,e])=>{return e.checked})
      if(!anyEmpleadoPaid){
        empleados_linkbuilding_paid.empleados.todos.checked=true
        Object.entries(empleados_linkbuilding_paid.empleados.items).forEach(([k,e])=>{
          empleados_linkbuilding_paid.empleados.items[k].checked=true
        })
      }

      var anyEmpleadoTracking = Object.entries(empleados_tracking_clientes.empleados.items).some(([k,e])=>{ return e.checked && e.tiene_clientes})
      if(!anyEmpleadoTracking){
        empleados_tracking_clientes.empleados.todos.checked=true
        Object.entries(empleados_tracking_clientes.empleados.items).forEach(([k,e])=>{
          empleados_tracking_clientes.empleados.items[k].checked=true
        })
      }

      this.props.setFiltrosEnlacesFreeListaLinkbuilding(empleados_linkbuilding_free);
      this.props.setFiltrosEnlacesPaidListaLinkbuilding(empleados_linkbuilding_paid);

      this.props.setFiltrosTracking(empleados_tracking_clientes);
      this.props.setEmpleados(empleados)
      //this.props.setMediosFree(medios);

    })

    var empleado = null;
    db.child(`Empleados/${this.state.empleado.id_empleado}`).on("value", snapshot => {
      empleado=snapshot.val();
      this.props.setEmpleado(empleado);
    })

    //introducimos las sesiones
    if(this.props.empleado.session){
      var session = this.props.empleado.session.panel ? this.props.empleado.session.panel : false
      if(session){
        this.props.setPanelHome(session)
      }
      var subpanel = this.props.empleado.session.subpanel ? this.props.empleado.session.subpanel : false
      var type ={ items:{ 'free':{checked:true}, 'paid':{checked:false}, }}
      if(subpanel==='linkbuilding_free'){
        this.props.setFiltrosFreePaid(type)
      }else if(subpanel==='linkbuilding_paid'){
        type.items.free.checked = false;
        type.items.paid.checked = true;
        this.props.setFiltrosFreePaid(type)
      }
      var vista = this.props.empleado.session.vista ? this.props.empleado.session.vista : false
      var vistas = {title:'Vistas',type:'radiobutton',
        items:{
          'clientes':{text:'Clientes',text_info:'Clientes',checked:false},
          'medios':{text:'Medios',text_info:'Medios',checked:false},
          'enlaces':{text:'Enlaces',text_info:'Enlaces',checked:true},
        }
      }
      if(vista){
        Object.entries(vistas.items).forEach(([k,v])=>{
          if(k===vista){
            vistas.items[k].checked=true
          }else{
            vistas.items[k].checked=false
          }
        })
        this.props.setVistaLinkBuilding(vistas)
      }
    }

    var empleado = {
      apellidos: 'Roy',
      email: 'celiaroy@yoseomarketing.com',
      foto: 'x',
      id_empleado: 'x',
      nombre: 'Celia',
      password: 'celiaroy',
      role: 'Consultor seo',
      username: 'celiaroy',
      acceso:{
        linkbuilding_free:false,
        linkbuilding_paid:false,
        tracking: true
      },
      privilegios:{
        tracking:{
          edit:{
            info:true,
            edit_clientes:true
          },
          view:true
        }
      }
    }
    //db.child('Empleados').push(empleado);

    var multiPath={}
    //multiPath[`Servicios/Tracking/Resultados/clientes/activo`]=true;
    //db.update(multiPath)

  }
  componentWillMount = () => {
    this.props.setPanelHome('clientes')


    //this.props.setPanelTracking('lista');
    //this.props.setFiltrosTrackingKeywords(data.filtros.filtro_tracking.keywords)

    /*Clientes*/
    this.props.setPanelClientes('lista');
    this.props.setFiltrosClientesLista(data.filtros.filtro_clientes.lista)
    //this.props.setPanelAlumnos('lista');

    //Linkbuilding
    this.props.setVistaLinkBuilding(data.vistas.vistas_linkbuilding.vistas)
    this.props.setFiltrosClientesFreeListaLinkbuilding(data.filtros.lb_filtros_clientes_free.lista)
    this.props.setFiltrosClientesPaidListaLinkbuilding(data.filtros.lb_filtros_clientes_paid.lista)

    this.props.setFiltrosMediosFreeListaLinkbuilding(data.filtros.lb_filtros_medios_free.lista)
    this.props.setPanelMediosFreeLinkbuilding('lista')
    this.props.setFiltrosMediosPaidListaLinkbuilding(data.filtros.lb_filtros_medios_paid.lista)
    this.props.setPanelMediosPaidLinkbuilding('lista');




    this.props.setPanelClientesFreeLinkbuilding('lista')
    this.props.setPanelClientesPaidLinkbuilding('lista')

    //ajustes panel enlaces del linkbuilding
    this.props.setFiltrosEnlacesFreeListaLinkbuilding(data.filtros.lb_filtros_enlaces_free.lista);
    this.props.setPanelEnlacesFreeLinkbuilding('lista')

    this.props.setFiltrosEnlacesPaidListaLinkbuilding(data.filtros.lb_filtros_enlaces_paid.lista);
    this.props.setPanelEnlacesPaidLinkbuilding('lista')
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
      element.download = `tracking_bbdd_importada.json`;
      element.click();
    })
  }

  changePanel = (panel) => {
    /*if(panel==='tracking'){
      return null
    }*/
    var multiPath = {}
    multiPath[`Empleados/${this.props.empleado.id_empleado}/session/panel`] = panel
    if(this.props.empleado){
      db.update(multiPath)
    }


    this.props.setPanelHome(panel)
  }

  datosTracking = () => {

    var clientes = bbdd;
    console.log(this.props.clientes);var multiPath = {}

    Object.entries(this.props.clientes).forEach(([k,cliente])=>{

      if(clientes[k]){
        var c = clientes[k]
        console.log('OK');
        //multiPath[`Clientes/${k}/servicios/tracking/activo`]=c.tracking.activo
        //multiPath[`Clientes/${k}/servicios/tracking/dominio_a_buscar`]=c.dominio
        //multiPath[`Clientes/${k}/servicios/tracking/keywords`]=c.tracking.keywords? c.tracking.keywords : null

        //
        var empleado = {}
        if(c.empleados && c.empleados.tracking['-LZ3or_qR1GoIxVr3KM-']){//poop
          empleado = { ['-LeMocMvgdqdDMey9wvo']:{id_empleado:'-LeMocMvgdqdDMey9wvo',nombre:'Adrian'} }
          multiPath[`Empleados/-LeMocMvgdqdDMey9wvo/clientes/tracking/${k}`]=c.dominio;
        }else if(c.empleados && c.empleados.tracking['-LZZEFnLLIoFYFnkeOnL']){//diana
          empleado = { ['-LNUwE1-PIeXzUxqV3dl']:{id_empleado:'-LNUwE1-PIeXzUxqV3dl',nombre:'Diana'} }
          multiPath[`Empleados/-LNUwE1-PIeXzUxqV3dl/clientes/tracking/${k}`]=c.dominio;
        }else if(c.empleados && c.empleados.tracking['-LZZEl0gB6llRZCTVi2v']){//alina
          empleado = { ['-LeMoqkVtGUFB2e8VjdR']:{id_empleado:'-LeMoqkVtGUFB2e8VjdR',nombre:'Alina'} }
          multiPath[`Empleados/-LeMoqkVtGUFB2e8VjdR/clientes/tracking/${k}`]=c.dominio;
        }else if(c.empleados && c.empleados.tracking['-LZZHB0s-RtOROzBUAXt']){//carolina
          empleado = { ['-LeMp2BgtynVyk5-DUEj']:{id_empleado:'-LeMp2BgtynVyk5-DUEj',nombre:'Carolina'} }
          multiPath[`Empleados/-LeMp2BgtynVyk5-DUEj/clientes/tracking/${k}`]=c.dominio;
        }else if(c.empleados && c.empleados.tracking['-LZZHZQzZqV5P_OYjQ5J']){//jose
          empleado = { ['-LeMpCQWLhaoreWIxAjO']:{id_empleado:'-LeMpCQWLhaoreWIxAjO',nombre:'José Ramon'} }
          multiPath[`Empleados/-LeMpCQWLhaoreWIxAjO/clientes/tracking/${k}`]=c.dominio;
        }else if(c.empleados && c.empleados.tracking['-LZZHmePurHr0rqtXZ6M']){//edu
          empleado = { ['-LZZHmePurHr0rqtXZ6M']:{id_empleado:'-LZZHmePurHr0rqtXZ6M',nombre:'Eduardo'} }
          multiPath[`Empleados/-LZZHmePurHr0rqtXZ6M/clientes/tracking/${k}`]=c.dominio;
        }else if(c.empleados && c.empleados.tracking['-LZZHmePurHr0rqtXZ6N']){//celia
          empleado = { ['-LeMpPBX6_LWkzxCrxem']:{id_empleado:'-LeMpPBX6_LWkzxCrxem',nombre:'Celia'} }
          multiPath[`Empleados/-LeMpPBX6_LWkzxCrxem/clientes/tracking/${k}`]=c.dominio;
        }
        multiPath[`Clientes/${k}/empleados/tracking`]=empleado
        console.log(cliente.web, empleado);
      }else{
        //multiPath[`Clientes/${k}/servicios/tracking/activo`]=false
        //multiPath[`Clientes/${k}/servicios/tracking/dominio_a_buscar`]=functions.getDominio(cliente.web)
        //console.log(k);
      }
      //multiPath[`Clientes/${k}/dominio`]=functions.getDominio(cliente.web)

    })

    console.log(multiPath);
    db.update(multiPath)
    .then(()=>{
      console.log('Ok');
    })
    .catch(err=>{
      console.log(err);
    })
  }

  render() {
    if(!this.state.empleado)return null;
    return (
      <div className="container-app">

        {/*<div onClick={()=>this.realizarCopia()}>restaurar</div>*/}

        {/*Barra lateral con los botones para cambiar los paneles*/}
        <div className='menu-bar'>

          {/*BOTON CLIENTES*/}
          <div className='container-icons-bar'>
            <div id='btn-clientes' onClick={()=>this.changePanel('clientes')} className={`${this.props.panel_home==='clientes'?'active':''}`} ><i className="material-icons"> person </i></div>
          </div>

          {/*BOTON TRACKING*/}
          <div className='container-icons-bar'>
            <div id='btn-tracking' onClick={()=>this.changePanel('tracking')} className={`${this.props.panel_home==='tracking'?'active':''}`} ><i className="material-icons"> track_changes </i></div>
          </div>

          {/*BOTON LINKBUILDING*/}
          <div className='container-icons-bar'>
            <div id='btn-linkbuilding' onClick={()=>this.changePanel('linkbuilding')} className={`${this.props.panel_home==='linkbuilding'?'active':''}`} ><i className="material-icons"> link </i></div>
          </div>

        </div>

        <div className='container-paneles'>

          {this.props.clientes && this.props.panel_home==='clientes'? <Clientes visibility={this.props.panel_home==='clientes'?true:false} />:null }
          {this.props.clientes && this.props.panel_home==='tracking'? <Tracking visibility={this.props.panel_home==='tracking'?true:false} />:null }
          {this.props.clientes && this.props.panel_home==='linkbuilding'? <LinkBuilding visibility={this.props.panel_home==='linkbuilding'?true:false} />:null }

        </div>


      </div>
    );
  }

  restoreClientes= () => {

    //var multiPath = {}
    //multiPath[`Clientes`]=null;
    //multiPath[`Servicios/Linkbuilding/Free/Enlaces`]=null;
    //multiPath[`Servicios/Linkbuilding/Paid/Enlaces`]=null;

    var lb = bbdd;
    var clientes = lb.clientes;
    var enlaces_paid = lb.enlaces.enlaces_de_pago
    var multiPath = {}

    Object.entries(clientes).forEach(([k,c])=>{

      var mensualidades_free = {}
      if(c.enlaces_gratuitos.follows.mensualidades){
        Object.entries(c.enlaces_gratuitos.follows.mensualidades).forEach(([k2,m])=>{

          var empleados_free = {}
          if(m.enlaces){
            Object.entries(m.enlaces).forEach(([k3,e])=>{
              //console.log(k2,k3,e);
              empleados_free[k3]={
                follows:k2!=='2019-05'?Object.keys(e).length:(+c.enlaces_gratuitos.follows.total),
                nofollows:k2!=='2019-05'?0:(+c.enlaces_gratuitos.nofollows.total),
                enlaces_follows:e
              }
            })
          }else if(k2==='2019-05'){
            empleados_free['-LJEKACe0OpW5cD3OCod']={
              follows:(+c.enlaces_gratuitos.follows.total),
              nofollows:(+c.enlaces_gratuitos.nofollows.total),
            }
          }


          mensualidades_free[k2]={
            follows:(+m.total),
            nofollows:(+c.enlaces_gratuitos.nofollows.total),
            comentario:'',
            empleados:empleados_free
          }
        })
      }

      var mensualidades_paid = {}
      if(c.enlaces_de_pago.mensualidades){
        Object.entries(c.enlaces_de_pago.mensualidades).forEach(([k2,m])=>{

          var enlaces = {}
          if(enlaces_paid[k] && enlaces_paid[k][k2]){
            Object.entries(enlaces_paid[k][k2]).forEach(([k3,e])=>{
              enlaces[k3]=e.enlace?true:false
            })
          }


          var empleados_paid = {
            "-LJEKACe0OpW5cD3OCod": {
                enlaces_follows:enlaces
            }
          }
          mensualidades_paid[k2]={
            beneficio:m.beneficio?(+m.beneficio):0,
            inversion_mensual:m.inversion_mensual?(+m.inversion_mensual):0,
            comentario:'',
            porcentaje_perdida:m.porcentaje_perdida?(+m.porcentaje_perdida):0,
            empleados:empleados_paid
          }
        })
      }

      var medios_usados_free={}
      if(c.enlaces_gratuitos.medios_usados){
        Object.entries(c.enlaces_gratuitos.medios_usados).forEach(([k2,m])=>{

          var categoria = ''
          if(m.categoria==='blogs_gratuitos'){
            categoria='webs2_0'
          }
          else if(m.categoria==='comentarios_en_webs'){
            categoria='comentarios'
          }else if(m.categoria==='herramientas_de_analisis'){
            categoria='herramientas_de_analisis'
          }
          else if(m.categoria==='directorios'){
            categoria='directorios'
          }else if(m.categoria==='foros'){
            categoria='foros'
          }
          else if(m.categoria==='marcadores'){
            categoria='marcadores'
          }
          else if(m.categoria==='perfiles'){
            categoria='perfiles'
          }else if(m.categoria==='redes_sociales_o_agregadores'){
            categoria='redes_sociales_o_agregadores'
          }
          else if(m.categoria==='enlaces_contextuales' || m.categoria==='enlaces_de_interes' || m.categoria==='enlaces_rotos' || m.categoria==='guestblogging'){
            //Object.entries(c.medios).forEach(([k2,m])=>{

              if(m.id_medio==='-LSGEHAjfP9xgFmQ_FeK' || m.id_medio==='-LSGFEMe30srKt0nwuZ7' || m.id_medio==='-LSHCQIphvKad6PQr1N3' || m.id_medio==='-LSJFBXcDfVwrx4RsspZ' || m.id_medio==='-LSOv9x9eic4wgkl4LVI' || m.id_medio==='-LSP763RnvnJCC-aOXa4' || m.id_medio==='-LSPvXVT2_MqeH3JbSIq' || m.id_medio==='-LSUS8iaE7Kxow6co_ZY' ){
                //medios.pbn.medios[k2]=m;
                categoria='pbn'
              }else{
                //medios.colaboraciones.medios[k2]=m;
                categoria='colaboraciones'
              }
            //})
          }



          medios_usados_free[k2]={
            categoria:categoria,
            fechas:{
              [m.fecha]:true
            },
            id_medio:k2
          }





        })
      }

      var web_micronichos = {};
      if(c.micronichos.webs){
        Object.entries(c.micronichos.webs).forEach(([k2,m])=>{
          var medios_usados_micro = {}
          if(m.medios_usados){
            Object.entries(m.medios_usados).forEach(([k3,m2])=>{
              medios_usados_micro[k3]={
                id_medio:k3,
                fechas:{
                  [m2.fecha]:true
                },
                tipo:m2.tipo
              }
            })
          }


          web_micronichos[k2]={
            activo: true,
            presupuesto_dedicado: false,
            tipo_de_presupuesto:'grupal',
            medios_usados:medios_usados_micro,
            web:m.web
          }

        })
      }

      var medios_usados_paid={}
      if(c.enlaces_de_pago.medios_usados){
        Object.entries(c.enlaces_de_pago.medios_usados).forEach(([k2,m])=>{
          medios_usados_paid[k2]={
            tipo:m.tipo,
            fechas:{
              [m.fecha]:true
            },
            id_medio:k2
          }
        })
      }


      var linkbuilding_free_empleados = {};
      if(c.enlaces_gratuitos.follows.empleados){
        Object.entries(c.enlaces_gratuitos.follows.empleados).forEach(([k2,m])=>{
          linkbuilding_free_empleados[k2]={
            id_empleado:k2,
            nombre:m.name,
            follows:m.total,
            nofollows:(+c.enlaces_gratuitos.nofollows.total)
          }
        })
      }


      var linkbuilding_paid_empleados = {};

      if(c.enlaces_de_pago.follows && c.enlaces_de_pago.follows.empleados){

        Object.entries(c.enlaces_de_pago.follows.empleados).forEach(([k2,m])=>{
          linkbuilding_paid_empleados[k2]={
            id_empleado:m.name?k2:null,
            nombre:m.name?m.name:null,
          }
        })
      }

      var destinos_free = {};
      if(c.destinos){
        Object.entries(c.destinos).forEach(([k, d])=>{
          destinos_free[k]={
            id_destino:k,
            web:d.destino
          }
        })
      }

      var seo = '';
      if(c.servicio==='lite'){
        seo='Lite'
      }else if(c.servicio==='pro'){
        seo= 'Pro'
      }else if(c.servicio==='premium'){
        seo = 'Premium'
      }else if(c.servicio==='medida'){
        seo ='A medida'
      }

      var idioma = ''

      if(c.idioma=='ESP'){
        idioma='Español'
      }else if(c.idioma=='ING'){
        idioma='Inglés'
      }else if(c.idioma=='ENG'){
        idioma='Inglés'
      }else if(c.idioma=='ARAB'){
        idioma='Árabe'
      }else{
        idioma='Español'
      }

      var obj = {
        id_cliente:k,
        activo:c.status==='pause'?false:true,
        dominio:c.dominio,
        eliminado:c.eliminado,
        web:c.web,
        blog:c.blog,
        idioma:idioma,
        nombre:c.nombre?c.nombre:'',
        seo:seo,
        tipo:c.status==='pause'?'old':c.status,
        follows:(+c.enlaces_gratuitos.follows.total),
        nofollows:(+c.enlaces_gratuitos.nofollows.total),
        empleados:{
          tracking:{},
          linkbuilding_free:linkbuilding_free_empleados,
          linkbuilding_paid:linkbuilding_paid_empleados
        },
        servicios:{

          tracking:{
            activo:false
          },


          linkbuilding:{

            free:{
              activo:c.enlaces_gratuitos.activo,
              home:{
                activo:true,
                mensualidades:mensualidades_free,
                medios_usados_follow:medios_usados_free,
                anchors:c.anchors?c.anchors:null,
                destinos:destinos_free
              }
            },

            paid:{
              activo:c.enlaces_de_pago.activo,
              bote:c.enlaces_de_pago.datos_actuales?(+c.enlaces_de_pago.datos_actuales.bote):0,
              inversion_mensual:c.enlaces_de_pago.datos_actuales?(+c.enlaces_de_pago.datos_actuales.inversion_mensual):0,
              beneficio:c.enlaces_de_pago.datos_actuales?(+c.enlaces_de_pago.datos_actuales.beneficio):0,
              porcentaje_perdida:c.enlaces_de_pago.datos_actuales?(+c.enlaces_de_pago.datos_actuales.porcentaje_perdida):0,

              home:{
                activo: true,
                presupuesto_dedicado: false,
                tipo_de_presupuesto:'grupal',
                medios_usados_follows:medios_usados_paid,
                mensualidades:mensualidades_paid,
                anchors:c.anchors?c.anchors:null,
                destinos:destinos_free
              },

              micronichos:{
                activo:c.micronichos && c.micronichos.activo ? c.micronichos.activo : false,
                webs:web_micronichos
              },


            }


          }

        }

      }

      multiPath[`Clientes/${k}`]=obj

    })

    console.log('Clientes',lb.clientes);
    console.log(multiPath);

    db.update(multiPath)
    .then(()=>{
      console.log('Ok');
    })
    .catch(err=>{
      console.log(err);
    })


  }

  /*

    restoreEnlacesFree = () => {
      var multiPath= {}
      var enlaces = bbdd.enlaces.enlaces_gratuitos;

      Object.entries(enlaces).forEach(([k,e])=>{


        Object.entries(e).forEach(([k2,f])=>{
          Object.entries(f).forEach(([k3,r])=>{

            if(r.categoria==='blogs_gratuitos'){
              //medios.webs2_0.medios=c.medios;
              r.categoria='webs2_0'
            }
            else if(r.categoria==='comentarios_en_webs'){
              //medios.comentarios.medios=c.medios;
              r.categoria='comentarios'
            }else if(r.categoria==='herramientas_de_analisis'){
              //medios.herramientas_de_analisis.medios=c.medios;
              r.categoria='herramientas_de_analisis'
            }
            else if(r.categoria==='directorios'){
              //medios.directorios.medios=c.medios;
              r.categoria='directorios'
            }else if(r.categoria==='foros'){
              //medios.foros.medios=c.medios;
              r.categoria='foros'
            }
            else if(r.categoria==='marcadores'){
              //medios.marcadores.medios=c.medios;
              r.categoria='marcadores'
            }
            else if(r.categoria==='perfiles'){
              //medios.perfiles.medios=c.medios;
              r.categoria='perfiles'
            }else if(r.categoria==='redes_sociales_o_agregadores'){
              //medios.redes_sociales_o_agregadores.medios=c.medios;
              r.categoria='redes_sociales_o_agregadores'
            }

            else if(r.categoria==='enlaces_contextuales' || r.categoria==='enlaces_de_interes' || r.categoria==='enlaces_rotos' || r.categoria==='guestblogging'){
              //Object.entries(c.medios).forEach(([k2,m])=>{

                if(r.id_medio==='-LSGEHAjfP9xgFmQ_FeK' || r.id_medio==='-LSGFEMe30srKt0nwuZ7' || r.id_medio==='-LSHCQIphvKad6PQr1N3' || r.id_medio==='-LSJFBXcDfVwrx4RsspZ' || r.id_medio==='-LSOv9x9eic4wgkl4LVI' || r.id_medio==='-LSP763RnvnJCC-aOXa4' || r.id_medio==='-LSPvXVT2_MqeH3JbSIq' || r.id_medio==='-LSUS8iaE7Kxow6co_ZY' ){
                  //medios.pbn.medios[k2]=m;
                  r.categoria='pbn'
                }else{
                  //medios.colaboraciones.medios[k2]=m;
                  r.categoria='colaboraciones'
                }
              //})
            }

            multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${k}/mensualidades/${k2}/enlaces/${k3}`]=r

          })
        })
      })
      //multiPath[`Servicios/Linkbuilding/Free/Enlaces`]=null
      //console.log(enlaces);
      console.log(multiPath);
      //multiPath= {}
      //multiPath[`Servicios/Linkbuilding/Free/Enlaces`]=null;
      db.update(multiPath)
      .then(()=>{
        console.log('Ok');
      })
      .catch(err=>{
        console.log(err);
      })

    }

    restoreEnlacesPaid = () => {
      /*var multiPath= {}
      var enlaces = bbdd.enlaces.enlaces_de_pago;

      Object.entries(enlaces).forEach(([k,c])=>{

        Object.entries(c).forEach(([k2,m])=>{
          multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${k}/mensualidades/${k2}/enlaces/`]=m
        })

      })

      console.log(enlaces);
      db.update(multiPath)
      .then(()=>{
        console.log('Ok');
      })
      .catch(err=>{
        console.log(err);
      })
      *-/
    }
    restoreMediosFree = () => {
      /*
      var multiPath= {}
      //[`Servicios/Linkbuilding/Free/Medios/categorias`]=null
      var categorias = bbdd.medios.medios_gratuitos.categorias;
      console.log(bbdd.medios.medios_gratuitos.categorias);

      var medios = {
        colaboraciones:{id:'colaboraciones',nombre:'Colaboraciones',medios:{}},
        comentarios:{id:'comentarios',nombre:'Comentarios',medios:{}},
        directorios:{id:'directorios',nombre:'Directorios',medios:{}},
        foros:{id:'foros',nombre:'Foros',medios:{}},
        herramientas_de_analisis:{id:'herramientas_de_analisis',nombre:'Herramientas de análisis',medios:{}},
        marcadores:{id:'marcadores',nombre:'Marcadores',medios:{}},
        pbn:{id:'pbn',nombre:'PBN',medios:{}},
        perfiles:{id:'perfiles',nombre:'Perfiles',medios:{}},
        redes_sociales_o_agregadores:{id:'redes_sociales_o_agregadores',nombre:'RRSS y agregadores',medios:{}},
        webs2_0:{id:'webs2_0',nombre:'Webs 2.0',medios:{}},
      }

      Object.entries(categorias).forEach(([k,r])=>{

        if(k==='blogs_gratuitos'){
          medios.webs2_0.medios=r.medios;
        }
        else if(k==='comentarios_en_webs'){
          medios.comentarios.medios=r.medios;
        }else if(k==='herramientas_de_analisis'){
          medios.herramientas_de_analisis.medios=r.medios;
        }
        else if(k==='directorios'){
          medios.directorios.medios=r.medios;
        }else if(k==='foros'){
          medios.foros.medios=r.medios;
        }
        else if(k==='marcadores'){
          medios.marcadores.medios=r.medios;
        }
        else if(k==='perfiles'){
          medios.perfiles.medios=r.medios;
        }else if(k==='redes_sociales_o_agregadores'){
          medios.redes_sociales_o_agregadores.medios=r.medios;
        }

        else if(k==='enlaces_contextuales' || k==='enlaces_de_interes' || k==='enlaces_rotos' || k==='guestblogging'){
          Object.entries(r.medios).forEach(([k2,m])=>{

            if(m.id_medio==='-LSGEHAjfP9xgFmQ_FeK' || m.id_medio==='-LSGFEMe30srKt0nwuZ7' || m.id_medio==='-LSHCQIphvKad6PQr1N3' || m.id_medio==='-LSJFBXcDfVwrx4RsspZ' || m.id_medio==='-LSOv9x9eic4wgkl4LVI' || m.id_medio==='-LSP763RnvnJCC-aOXa4' || m.id_medio==='-LSPvXVT2_MqeH3JbSIq' || m.id_medio==='-LSUS8iaE7Kxow6co_ZY' ){
              medios.pbn.medios[k2]=m;
            }else{
              medios.colaboraciones.medios[k2]=m;
            }
          })
        }

        //multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${k}/mensualidades/${k2}/enlaces/${k3}`]=r

      })
      //multiPath[`Servicios/Linkbuilding/Free/Enlaces`]=null
      //console.log(enlaces);
      console.log(medios);
      multiPath[`Servicios/Linkbuilding/Free/Medios/categorias`]=medios
      db.update(multiPath)
      *-/
    }
    restoreMediosDePago = () => {
      /*var lb = bbdd;
      var medios = lb.medios.medios_de_pago;
      var multiPath = {}
      multiPath[`Servicios/Linkbuilding/Paid/Medios`]=medios
      console.log(medios);
      console.log(multiPath);
      db.update(multiPath)
      .then(()=>{
        console.log('Ok');
      })
      .catch(err=>{
        console.log(err);
      })
  *-/
    }
    //Añadiremos el campo timestamp a los enlaces comprados para que se pueda ordenar los enlaces segun la fecha de compra
    addTimestampToEnlacesPaid = () => {
      /*var multiPath = {}
      console.log(this.props.medios_paid);
      Object.entries(this.props.medios_paid).forEach(([k,m])=>{

        if(m.enlaces){
          Object.entries(m.enlaces).forEach(([k2,e])=>{
            var timestamp = this.decode(k2);
            multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${k}/enlaces/${k2}/timestamp`]=timestamp
            multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${k}/enlaces/${k2}/compartir`]='unico'
          })
        }
      })
      console.log(multiPath);
      db.update(multiPath)
      .then(()=>{
        console.log('Ok');
      })
      .catch(err=>{
        console.log(err);
      })
      *-/
    }
    decode = (id) => {
      id = id.substring(0,8);
      var timestamp = 0;
      for (var i=0; i < id.length; i++) {
        var c = id.charAt(i);
        timestamp = timestamp * 64 + PUSH_CHARS.indexOf(c);
      }
      return timestamp;
    }
    setPlataformas = () => {
      var prensalink = {
        texto:'Prensalink',
        id_plataforma:'x',
      }
      db.child('Servicios/Linkbuilding/Paid/Plataformas/lista/').push(prensalink)

      var prensalink = {
        texto:'Prensarank',
        id_plataforma:'x',
      }
      db.child('Servicios/Linkbuilding/Paid/Plataformas/lista/').push(prensalink)

      var prensalink = {
        texto:'Que',
        id_plataforma:'x',
      }
      db.child('Servicios/Linkbuilding/Paid/Plataformas/lista/').push(prensalink)

      var prensalink = {
        texto:'La razón',
        id_plataforma:'x',
      }
      db.child('Servicios/Linkbuilding/Paid/Plataformas/lista/').push(prensalink)

      var prensalink = {
        texto:'El imparcial',
        id_plataforma:'x',
      }
      db.child('Servicios/Linkbuilding/Paid/Plataformas/lista/').push(prensalink)
    }
    fixPlataformasMediosPaid = ()=>{
      console.log(this.props.medios_paid);
      var multiPath = {}
      Object.entries(this.props.medios_paid).forEach(([k,m])=>{

        if(m.enlaces){

          Object.entries(m.enlaces).forEach(([k2,e])=>{

            if(!e.id_plataforma){
              var id_plataforma='';
              if(e.plataforma==='prensalink'){
                id_plataforma='-Lbu77UnGFOVrm8ibAzh'
              }else if(e.plataforma==='prensarank'){
                id_plataforma='-Lbu77UpOCg7Zp7Jq6KC'
              }else if(e.plataforma==='que'){
                id_plataforma='-Lbu77UpOCg7Zp7Jq6KD'
              }else if(e.plataforma==='la razón'){
                id_plataforma='-Lbu77Uq0IAjypRxrIyB'
              }else if(e.plataforma==='elimparcial'){
                id_plataforma='-Lbu77Uq0IAjypRxrIyC'
              }

              multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${k}/enlaces/${k2}/id_plataforma`]=id_plataforma
              multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${k}/enlaces/${k2}/plataforma`]=null

            }

          })

        }

      })

      console.log(multiPath);
      db.update(multiPath)
      .then(()=>{
        console.log('Ok');
      })
      .catch(err=>{
        console.log(err);
      })

    }
    */
}

function mapStateToProps(state){return{
  clientes : state.clientes,
  empleado:state.empleado,
  panel_home:state.panel_home,
  cliente_seleccionado:state.cliente_seleccionado,

  filtros_lb_enlaces_free:state.linkbuilding.enlaces.tipos.free.paneles.lista.filtros,
  filtros_lb_enlaces_paid:state.linkbuilding.enlaces.tipos.paid.paneles.lista.filtros,

  medios_paid : state.linkbuilding.medios.tipos.paid.medios,
  medio_seleccionado_paid: state.linkbuilding.medios.tipos.paid.medio_seleccionado,

  categoria_seleccionada: state.linkbuilding.medios.tipos.free.categoria_seleccionada,
  medios_free : state.linkbuilding.medios.tipos.free.medios,
  medio_seleccionado_free: state.linkbuilding.medios.tipos.free.medio_seleccionado,

  filtros_tracking_clientes:state.tracking.paneles.lista.filtros,

}}
function matchDispatchToProps(dispatch){ return bindActionCreators({
  setClientes,
  setPanelTracking,
  setPanelHome,
  setClienteSeleccionado,
  setEmpleados,
  setEmpleado,
  //setFiltrosTrackingLista,
  //setFiltrosTrackingKeywords,
  setFiltrosClientesLista ,
  setPanelClientes,

  /*Metodos linkbuilding*/
  setVistaLinkBuilding,
  setPanelClientesLinkbuilding,
  setFiltrosClientesFreeListaLinkbuilding,
  setFiltrosMediosFreeListaLinkbuilding,
  setPanelMediosFreeLinkbuilding,
  setFiltrosMediosPaidListaLinkbuilding,
  setPanelMediosPaidLinkbuilding,
  setFiltrosEnlacesFreeListaLinkbuilding,
  setFiltrosEnlacesPaidListaLinkbuilding,
  setPanelEnlacesFreeLinkbuilding,
  setPanelEnlacesPaidLinkbuilding,
  setPanelClientesFreeLinkbuilding,
  setPanelClientesPaidLinkbuilding,
  setFiltrosClientesPaidListaLinkbuilding,
  setMedioSeleccionadoPaid,
  setPlataformas,
  selectMedioMediosGratuitos,

  setMediosPaid,
  setMediosFree,

  setFiltrosFreePaid,

  setFiltrosTracking

}, dispatch) }

export default connect(mapStateToProps, matchDispatchToProps)(Home);
