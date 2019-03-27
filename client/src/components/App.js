import React, { Component } from 'react';
import firebase from '../firebase/Firebase';
import XLSX from 'xlsx';
import functions from './Global/functions'
import data from './Global/Data/Data'
import bbdd from './Global/Data/linkbuilding_bbdd'
import dotProp from 'dot-prop-immutable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  setClientes,
  setPanelTracking,
  setPanelHome,
  setClienteSeleccionado,
  setEmpleados,
  setFiltrosTrackingLista,
  setFiltrosTrackingKeywords,
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
  setPanelEnlacesFreeLinkbuilding,
  setPanelClientesFreeLinkbuilding,
  setPanelClientesPaidLinkbuilding,
  setFiltrosClientesPaidListaLinkbuilding,

  setMediosPaid,
  setMediosFree

} from '../redux/actions';

import Clientes from './Clientes/Clientes'
import Tracking from './Tracking/Tracking'
import LinkBuilding from './LinkBuilding/LinkBuilding'



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
      });
      this.props.setClientes(clientes);
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
        //multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${data.key}/activo`]=true
        //multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${data.key}/eliminado`]=false
      });
      //console.log(multiPath);
      //db.update(multiPath)
      this.props.setMediosFree(medios);
    })

    db.child('Empleados').on("value", snapshot =>{
      var empleados = {}, multiPath={};
      snapshot.forEach( data => {
        empleados[data.key]=data.val();
      });

      var empleados_linkbuilding_free = dotProp.set(this.props.filtros_lb_enlaces_free, `empleados.title`, 'Empleados');


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
      })
      var anyEmpleado = Object.entries(empleados_linkbuilding_free.empleados.items).some(([k,e])=>{return e.checked})
      if(!anyEmpleado) empleados_linkbuilding_free.empleados.todos.checked=true

      this.props.setFiltrosEnlacesFreeListaLinkbuilding(empleados_linkbuilding_free);
      this.props.setEmpleados(empleados)
      //this.props.setMediosFree(medios);
    })


/*
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

      /x*
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
      })x*8/
      //db.update(multiPath)



    })*/

    //this.restoreClientes()
    //this.restoreMediosDePago()


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


    this.props.setFiltrosEnlacesFreeListaLinkbuilding(data.filtros.lb_filtros_enlaces_free.lista);
    this.props.setPanelEnlacesFreeLinkbuilding('lista')

    this.props.setPanelClientesFreeLinkbuilding('lista')
    this.props.setPanelClientesPaidLinkbuilding('lista')
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

  restoreClientes= () => {
    var lb = bbdd;
    var clientes = lb.clientes;
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
                follows:k2!=='2019-03'?Object.keys(e).length:(+c.enlaces_gratuitos.follows.total),
                nofollows:k2!=='2019-03'?0:(+c.enlaces_gratuitos.nofollows.total),
                enlaces_follows:e
              }
            })
          }


          mensualidades_free[k2]={
            follows:(+m.total),
            nofollows:(+c.enlaces_gratuitos.nofollows.total),
            comentario:'',
            empleados:empleados_free
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


      var obj = {
        id_cliente:k,
        activo:true,
        dominio:c.dominio,
        eliminado:c.eliminado,
        web:c.web,
        blog:c.blog,
        idioma:c.idioma,
        nombre:c.nombre?c.nombre:'',
        seo:c.servicio,
        tipo:c.status,
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
                medios_usados_follows:medios_usados_paid

              },

              micronichos:{
                activo:c.micronichos && c.micronichos.activo ? c.micronichos.activo : false,
                webs:web_micronichos
              },
              mensualidades:c.enlaces_de_pago.activo?c.enlaces_de_pago.mensualidades:{}

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
    /*db.update(multiPath)
    .then(()=>{
      console.log('Ok');
    })
    .catch(err=>{
      console.log(err);
    })*/

  }
  restoreMediosFree = () => {
    var multiPath= {}
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
    //db.update(multiPath)

  }
  restoreMediosDePago = () => {
    var lb = bbdd;
    var medios = lb.medios.medios_de_pago;
    console.log(medios);
    var multiPath = {}
    multiPath[`Servicios/Linkbuilding/Paid/Medios`]=medios

    /*db.update(multiPath)
    .then(()=>{
      console.log('Ok');
    })
    .catch(err=>{
      console.log(err);
    })*/

  }

  render() {
    if(!this.state.empleado)return null;
    return (
      <div className="container-app">

        {/*<div onClick={()=>this.restoreClientes()}>realizar copia</div>*/}

        {/*Barra lateral con los botones para cambiar los paneles*/}
        <div className='menu-bar'>

          {/*BOTON CLIENTES*/}
          <div className='container-icons-bar'>
            <div id='btn-clientes' onClick={()=>this.props.setPanelHome('clientes')} className={`${this.props.panel_home==='clientes'?'active':''}`} ><i className="material-icons"> person </i></div>
          </div>

          {/*BOTON TRACKING*/}
          <div className='container-icons-bar'>
            <div id='btn-tracking' onClick={()=>this.props.setPanelHome('tracking')} className={`${this.props.panel_home==='tracking'?'active':''}`} ><i className="material-icons"> track_changes </i></div>
          </div>

          {/*BOTON LINKBUILDING*/}
          <div className='container-icons-bar'>
            <div id='btn-linkbuilding' onClick={()=>this.props.setPanelHome('linkbuilding')} className={`${this.props.panel_home==='linkbuilding'?'active':''}`} ><i className="material-icons"> link </i></div>
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
}

function mapStateToProps(state){return{
  clientes : state.clientes,
  empleado:state.empleado,
  panel_home:state.panel_home,
  cliente_seleccionado:state.cliente_seleccionado,
  filtros_tracking_lista:state.filtros_tracking_lista,

  filtros_lb_enlaces_free:state.linkbuilding.enlaces.tipos.free.paneles.lista.filtros

}}
function matchDispatchToProps(dispatch){ return bindActionCreators({
  setClientes,
  setPanelTracking,
  setPanelHome,
  setClienteSeleccionado,
  setEmpleados,
  setFiltrosTrackingLista,
  setFiltrosTrackingKeywords,
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
  setPanelEnlacesFreeLinkbuilding,
  setPanelClientesFreeLinkbuilding,
  setPanelClientesPaidLinkbuilding,
  setFiltrosClientesPaidListaLinkbuilding,

  setMediosPaid,
  setMediosFree

}, dispatch) }

export default connect(mapStateToProps, matchDispatchToProps)(Home);
