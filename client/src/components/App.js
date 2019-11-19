import React, { Component } from 'react';
import firebase from '../firebase/Firebase';
import * as functions from './Global/functions'
import moment from 'moment';
import data from './Global/Data/Data'
//import bbdd from './Global/Data/linkbuilding_bbdd'
//import bbdd from './Global/Data/final_clientes'
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

  setFiltrosClientesLista,
  setPanelClientes,

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

  setFiltrosTracking,
  setNotificaciones,
  setTareasEmpleado

} from '../redux/actions';

import Clientes from './Clientes/Clientes'
import Tracking from './Tracking/Tracking'
import LinkBuilding from './LinkBuilding/LinkBuilding'
import PopupInfo from './Global/PopupInfo';
import Empleado from './Empleado/Empleado'

import Firebase from 'firebase'

const db = firebase.database().ref();
const dbCloud = firebase.firestore();



class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: data,
      listeners: false,
      empleado: this.props.empleado,

      id_tiempo: false,
      panel_home: this.props.panel_home,
      vistasLinkbuilding: this.props.vistasLinkbuilding,
      filtros_lb_enlaces_free: this.props.filtros_lb_enlaces_free,
      timeCliente: this.props.timeCliente

    }
  }

  componentWillReceiveProps = newProps => {
    if (this.state.empleado !== newProps.empleado) {
      if (newProps.empleado && this.state.listeners === false) {
        this.setState({ empleado: newProps.empleado, listeners: true }, () => {
          this.getData()
        })
      }
    }

    if (this.props.clientes !== newProps.clientes) {
      if (this.props.cliente_seleccionado) {
        if (!newProps.clientes[newProps.cliente_seleccionado.id_cliente]) {
          this.props.setClienteSeleccionado(null)
        } else {

          //solo actualizaremos el cliente seleccionado siempre y cuando sea el mismo cliente que esta seleccionado en la app
          if (this.props.cliente_seleccionado.id_cliente === newProps.cliente_seleccionado.id_cliente) {
            this.props.setClienteSeleccionado(newProps.clientes[newProps.cliente_seleccionado.id_cliente])
          }



        }
      }
    }

    if (this.props.medios_paid !== newProps.medios_paid) {
      if (this.props.medio_seleccionado_paid) {
        if (!newProps.medios_paid[newProps.medio_seleccionado_paid.id_medio]) {
          this.props.setMedioSeleccionadoPaid(null)
        } else {
          this.props.setMedioSeleccionadoPaid(newProps.medios_paid[newProps.medio_seleccionado_paid.id_medio])
        }
      }
    }

    if (this.props.medios_free !== newProps.medios_free) {
      if (this.props.medio_seleccionado_free && this.props.categoria_seleccionada) {
        if (!newProps.medios_free[this.props.categoria_seleccionada.id].medios[newProps.medio_seleccionado_free.id_medio]) {
          this.props.selectMedioMediosGratuitos(null)
        } else {
          this.props.selectMedioMediosGratuitos(newProps.medios_free[this.props.categoria_seleccionada.id].medios[newProps.medio_seleccionado_free.id_medio])
        }
      }
    }


    if (this.state.panel_home !== newProps.panel_home ||
      this.state.vistasLinkbuilding !== newProps.vistasLinkbuilding ||
      this.state.filtros_lb_enlaces_free !== newProps.filtros_lb_enlaces_free ||
      this.state.timeCliente !== newProps.timeCliente
    ) {
      this.setState({
        panel_home: newProps.panel_home,
        vistasLinkbuilding: newProps.vistasLinkbuilding,
        filtros_lb_enlaces_free: newProps.filtros_lb_enlaces_free,
        timeCliente: newProps.timeCliente
      }, () => {

        this.disconnect()

      })

    }

  }


  componentDidMount = () => {
    if (this.state.empleado) {
      this.setState({ listeners: true }, () => {
        this.getData()
      })
    }

  }




  getData = () => {
    console.log('INICIO!!!!!!!', this.props.empleado.id_empleado);

    var id_tiempo = db.child(`Servicios/Times/empleados/${this.props.empleado.id_empleado}/mensualidades/${moment().format('YYYY-MM')}`).push().key;

    db.update({
      [`Servicios/Times/empleados/${this.props.empleado.id_empleado}/mensualidades/${moment().format('YYYY-MM')}/${id_tiempo}`]: { id_tiempo, begin: (+ new Date()), end: false }
    })
      .then(() => {
        this.setState({ id_tiempo }, () => this.requestData())
      })
      .catch(err => { console.log(err); })




  }

  requestData = () => {
    this.disconnect()

    //console.log(functions.getTimestamp());
    // 12 de mayo a las 1:28 de la madrugada,  12 de mayo a las 1:36 de la madrugada (fecha inicion, fecha final)
    /*var diferencia = functions.diferenciaEntreFechas(1557620917411, 1557621409065)
    console.log('diferencia entre fechas:', diferencia);
    console.log('diferencia entre fechas:', functions.diferenciaEntreFechas(1557414371864, 1557621409065));

    db.child('.info/connected').on("value", snapshot =>{
      console.log('Sesion:',snapshot.val());
    })
*/
    //  console.log('Getting data...');


    var date = functions.getTodayDate()

    db.child('Clientes').on("value", snapshot => {

      var clientes = {}, multiPath = {}, notificaciones = []
      snapshot.forEach(data => {
        var cliente = data.val()
        clientes[data.key] = cliente;

        //comprobamos que existe la mensualidad de los enlaces Gratuitos
        if ((!cliente.servicios.linkbuilding.free.home.mensualidades || !cliente.servicios.linkbuilding.free.home.mensualidades[date]) && cliente.servicios.linkbuilding.free.activo) {
          var empleadosFree = data.val().empleados && data.val().empleados.linkbuilding_free ? data.val().empleados.linkbuilding_free : null
          multiPath[`Clientes/${data.key}/servicios/linkbuilding/free/home/mensualidades/${date}`] = { comentario: '', follows: data.val().follows, nofollows: data.val().nofollows, empleados: empleadosFree }
        }
        //sumaremos al bote y añadiremos la mensualidad de los enlaces de pago a los clientes que tengan activado el linkbuilding de pago
        if (!cliente.eliminado && cliente.servicios.linkbuilding.paid.activo && !cliente.servicios.linkbuilding.paid.home.mensualidades[date]) {
          var empleadosPaid = data.val().empleados && data.val().empleados.linkbuilding_paid ? data.val().empleados.linkbuilding_paid : null
          multiPath[`Clientes/${data.key}/servicios/linkbuilding/paid/home/mensualidades/${date}`] = {
            beneficio: (+data.val().servicios.linkbuilding.paid.beneficio),
            comentario: '',
            empleados: empleadosPaid,
            inversion_mensual: (+data.val().servicios.linkbuilding.paid.inversion_mensual),
            porcentaje_perdida: (+data.val().servicios.linkbuilding.paid.porcentaje_perdida),

          }
          //sumamos al bote la inversion mensual sin la comision
          var disponible_mensual = data.val().servicios.linkbuilding.paid.inversion_mensual * ((100 - data.val().servicios.linkbuilding.paid.beneficio) / 100)
          multiPath[`Clientes/${data.key}/servicios/linkbuilding/paid/bote`] = disponible_mensual + data.val().servicios.linkbuilding.paid.bote
        }
        //SEO ENTERPRISE comprobar y añadir b100 euros al bote si fuera necesario
        if (cliente.seo === 'Enterprise') {
          if (cliente.servicios.linkbuilding.free.activo) {

            if (!cliente.servicios.linkbuilding.paid.enlaces_por_seo) {
              multiPath[`Clientes/${data.key}/servicios/linkbuilding/paid/enlaces_por_seo`] = {
                bote: 100,
                mensualidades: { [moment().format('YYYY-MM')]: { seo: 'Enterprise', inversion_mensual: 100 } }
              }
            } else if (!cliente.servicios.linkbuilding.paid.enlaces_por_seo.mensualidades || !cliente.servicios.linkbuilding.paid.enlaces_por_seo.mensualidades[moment().format('YYYY-MM')]) {

              console.log();

              multiPath[`Clientes/${data.key}/servicios/linkbuilding/paid/enlaces_por_seo/bote`] = (+cliente.servicios.linkbuilding.paid.enlaces_por_seo.bote) + 100
              multiPath[`Clientes/${data.key}/servicios/linkbuilding/paid/enlaces_por_seo/mensualidades/${moment().format('YYYY-MM')}`] = { seo: 'Enterprise', inversion_mensual: 100 }
            }
          }
        }
        //Comprobar clientes notificaciones

        if (cliente.activo && !cliente.eliminado) {

          //comprobamos que hay almenos un empleado asigando al linkbuilding gratuito si este apartado esta activado
          if (cliente.servicios.linkbuilding.free.activo && (!cliente.empleados || !cliente.empleados.linkbuilding_free)) {
            notificaciones.push({ prioridad: 1, icon: 'link', title: 'Linkbuilding gratuito: añadir empleados', subtitle: cliente.web, id_cliente: cliente.id_cliente, panelHome: 'clientes', panelClientes: 'linkbuilding_gratuito' })
          } else if (cliente.servicios.linkbuilding.free.activo && cliente.empleados && cliente.empleados.linkbuilding_free) {
            //comprobaremos si la suma de los enlaces asignados es igual a la de los enlaces metidos
            var followsAsignados = 0, noFollowsAsignados = 0;
            Object.entries(cliente.empleados.linkbuilding_free).forEach(([k, i]) => {
              followsAsignados += i.follows
              noFollowsAsignados += i.nofollows
            })
            if (cliente.follows !== followsAsignados || cliente.nofollows !== noFollowsAsignados) {
              notificaciones.push({ prioridad: 1, icon: 'link', title: 'Linkbuilding gratuito: error al asignar enlaces', subtitle: cliente.web, id_cliente: cliente.id_cliente, panelHome: 'clientes', panelClientes: 'linkbuilding_gratuito' })
            }
          }

          //comprobamos que hay almenos un empleado asigando al linkbuilding de pago si este apartado esta activado
          if (cliente.servicios.linkbuilding.paid.activo && (!cliente.empleados || !cliente.empleados.linkbuilding_paid)) {
            notificaciones.push({ prioridad: 1, icon: 'link', title: 'Linkbuilding de pago: añadir empleados', subtitle: cliente.web, id_cliente: cliente.id_cliente, panelHome: 'clientes', panelClientes: 'linkbuilding_pagado' })
          }

          //Comprobamos error en el nombre
          if (!cliente.nombre || cliente.nombre.trim() === '') {
            notificaciones.push({ prioridad: 3, icon: 'person', title: 'Información: error en el nombre', subtitle: cliente.web, id_cliente: cliente.id_cliente, panelHome: 'clientes', panelClientes: 'info' })
          }

          if (cliente.servicios.tracking.activo && (!cliente.empleados || !cliente.empleados.tracking)) {
            notificaciones.push({ prioridad: 2, icon: 'track_changes', title: 'Tracking: añadir empleados', subtitle: cliente.web, id_cliente: cliente.id_cliente, panelHome: 'clientes', panelClientes: 'tracking' })
          }
          if (cliente.servicios.tracking.activo && (!cliente.servicios.tracking.dominios || !Object.entries(cliente.servicios.tracking.dominios).some(([k,d])=>{return d.status==='activo'})    )) {
            notificaciones.push({ prioridad: 1, icon: 'track_changes', title: 'Tracking: error en el dominio', subtitle: cliente.web, id_cliente: cliente.id_cliente, panelHome: 'clientes', panelClientes: 'tracking' })
          }
        }

      });


      this.props.setNotificaciones(notificaciones)

      if (Object.keys(multiPath).length > 0) {
        console.log(multiPath);

        db.update(multiPath)
          .then(() => { console.log('OK') })
          .catch(err => console.log(err))
      } else {

        //Asignamos las sesiones guardadas
        if (this.props.empleado.session && this.props.empleado.session.cliente_seleccionado) {
          if (this.props.cliente_seleccionado && this.props.cliente_seleccionado.id_cliente === this.props.empleado.session.cliente_seleccionado) {
            this.props.setClienteSeleccionado(clientes[this.props.empleado.session.cliente_seleccionado])
          } else if (!this.props.cliente_seleccionado) {
            this.props.setClienteSeleccionado(clientes[this.props.empleado.session.cliente_seleccionado])
          }
        }
        this.props.setClientes(clientes);
      }

    })

    db.child('Servicios/Linkbuilding/Paid/Medios/medios').on("value", snapshot => {
      var medios = {}
      snapshot.forEach(data => {
        medios[data.key] = data.val();
      });
      this.props.setMediosPaid(medios);
    })

    db.child('Servicios/Linkbuilding/Free/Medios/categorias').on("value", snapshot => {
      var medios = {}, multiPath = {};
      snapshot.forEach(data => {
        medios[data.key] = data.val();
        medios[data.key].valor = data.val().nombre;//Este nuevo atributo nos sirve para ver el desplegable de categorias en cada enlace gratuito que se haga
        Object.entries(data.val().medios).forEach(([k, m]) => {
          multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${data.key}/medios/${k}/activo`] = true
        })
        //multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${data.key}/activo`]=true
        //multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${data.key}/eliminado`]=false
      });
      //console.log(multiPath);
      //db.update(multiPath)
      this.props.setMediosFree(medios);
      console.log(medios);
      
    })

    db.child('Servicios/Linkbuilding/Paid/Plataformas/lista').once("value", snapshot => {
      var plataformas = {}
      snapshot.forEach(data => {
        plataformas[data.key] = data.val();
      });
      this.props.setPlataformas(plataformas);
    })

    db.child('Empleados').on("value", snapshot => {
      var empleados = {};
      snapshot.forEach(data => {
        empleados[data.key] = data.val();
      });

      var empleados_linkbuilding_free = dotProp.set(this.state.filtros_lb_enlaces_free, `empleados.title`, 'Empleados');
      var empleados_linkbuilding_paid = dotProp.set(this.props.filtros_lb_enlaces_paid, `empleados.title`, 'Empleados');
      var empleados_tracking_clientes = dotProp.set(this.props.filtros_tracking_clientes, `empleados.title`, 'Empleados');

      Object.entries(empleados).forEach(([k, e]) => {
        if (e.acceso && e.acceso.linkbuilding_free) {
          if (!empleados_linkbuilding_free.empleados.items[k]) {
            empleados_linkbuilding_free.empleados.items[k] = {
              text: e.nombre,
              text_info: e.nombre,
              checked: this.props.empleado.id_empleado === k ? true : false,
              valor: e.nombre
            }
          }
        }

        if (e.acceso && e.acceso.linkbuilding_paid) {
          if (!empleados_linkbuilding_paid.empleados.items[k]) {
            empleados_linkbuilding_paid.empleados.items[k] = {
              text: e.nombre,
              text_info: e.nombre,
              checked: this.props.empleado.id_empleado === k ? true : false,
              valor: e.nombre
            }
          }
        }

        if (e.acceso && e.acceso.tracking) {
          if (!empleados_tracking_clientes.empleados.items[k]) {
            empleados_tracking_clientes.empleados.items[k] = {
              text: e.nombre,
              text_info: e.nombre,
              checked: this.props.empleado.id_empleado === k ? true : false,
              valor: e.nombre,
              tiene_clientes: e.clientes && e.clientes.tracking ? true : false
            }
          }
        }

      })

      //si el empleado es Guillermo mostraremos todos los empleados para que no tenga excusa de que no lo ha visto
      var excepcionesVerTodos = this.props.empleado.id_empleado === '-LJEKACe0OpW5cD3OCod'

      var anyEmpleado = Object.entries(empleados_linkbuilding_free.empleados.items).some(([k, e]) => { return e.checked })

      if (!anyEmpleado || excepcionesVerTodos) {
        empleados_linkbuilding_free.empleados.todos.checked = true
        Object.entries(empleados_linkbuilding_free.empleados.items).forEach(([k, e]) => {
          empleados_linkbuilding_free.empleados.items[k].checked = true
        })
      }

      var anyEmpleadoPaid = Object.entries(empleados_linkbuilding_paid.empleados.items).some(([k, e]) => { return e.checked })
      if (!anyEmpleadoPaid || excepcionesVerTodos) {
        empleados_linkbuilding_paid.empleados.todos.checked = true
        Object.entries(empleados_linkbuilding_paid.empleados.items).forEach(([k, e]) => {
          empleados_linkbuilding_paid.empleados.items[k].checked = true
        })
      }

      var anyEmpleadoTracking = Object.entries(empleados_tracking_clientes.empleados.items).some(([k, e]) => { return e.checked && e.tiene_clientes })
      if (!anyEmpleadoTracking || excepcionesVerTodos) {
        empleados_tracking_clientes.empleados.todos.checked = true
        Object.entries(empleados_tracking_clientes.empleados.items).forEach(([k, e]) => {
          empleados_tracking_clientes.empleados.items[k].checked = true
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
      var multiPath = {}
      empleado = snapshot.val();

      if (!empleado.online_state) {
        multiPath[`Empleados/${this.state.empleado.id_empleado}/online_state`] = true;
        db
        .update(multiPath)
        .then(() => {})
        .catch(err => {
          console.log(err);
        })
      }

      this.props.setEmpleado(empleado);
    })

    console.log('kknn', this.state.empleado);
    

    var taskRef = dbCloud.collection('Servicios/Tareas/tareas');
    taskRef = taskRef.where(`empleados.${this.state.empleado.id_empleado}`, '==', true)
    taskRef = taskRef.where(`completado`, '==', false)
    
    taskRef.onSnapshot(snapshot => {
      var tareas = {}
      snapshot.forEach(doc => {
        tareas[doc.id] = doc.data()
        var a = moment();
        var b = moment(doc.data().fecha_limite)
        tareas[doc.id].diferencia_dias = a.diff(b, 'days')  
      });
      this.props.setTareasEmpleado(tareas)
          
    })

    //introducimos las sesiones
    if (this.props.empleado.session) {
      var session = this.props.empleado.session.panel ? this.props.empleado.session.panel : false
      if (session) {
        this.props.setPanelHome(session)
      }
      var subpanel = this.props.empleado.session.subpanel ? this.props.empleado.session.subpanel : false
      var type = { items: { 'free': { checked: true }, 'paid': { checked: false }, } }
      if (subpanel === 'linkbuilding_free') {
        this.props.setFiltrosFreePaid(type)
      } else if (subpanel === 'linkbuilding_paid') {
        type.items.free.checked = false;
        type.items.paid.checked = true;
        this.props.setFiltrosFreePaid(type)
      }
      var vista = this.props.empleado.session.vista ? this.props.empleado.session.vista : false
      var vistas = {
        title: 'Vistas', type: 'radiobutton',
        items: {
          'clientes': { text: 'Clientes', text_info: 'Clientes', checked: false },
          'medios': { text: 'Medios', text_info: 'Medios', checked: false },
          'enlaces': { text: 'Enlaces', text_info: 'Enlaces', checked: true },
        }
      }
      if (vista) {
        Object.entries(vistas.items).forEach(([k, v]) => {
          if (k === vista) {
            vistas.items[k].checked = true
          } else {
            vistas.items[k].checked = false
          }
        })
        this.props.setVistaLinkBuilding(vistas)
      }
    }

    var empleado = {
      apellidos: 'Abdenaji',
      email: 'zabdenaji@yoseomarketing.com',
      foto: 'x',
      id_empleado: 'x',
      nombre: 'Zouhair',
      password: 'zabdenaji',
      role: 'Consultor seo',
      username: 'zabdenaji',
      acceso: {
        linkbuilding_free: false,
        linkbuilding_paid: false,
        tracking: true
      },
      privilegios: {

        info_cliente: {
          edit: {
            add_clientes: false,
            info: false,
            info_adicional: false,
            servicios: false,
          }
        },

        linkbuilding_free: {
          edit: {
            change_estrategia: false,
            empleados: false,
            info: false,
            info_adicional: false
          }
        },
        linkbuilding_paid: {
          edit: {
            change_bote: false,
            change_estrategia: false,
            change_inversion: false,
            empleados: false,
            info_adicional: false
          }
        },

        tracking: {
          edit: {
            add_cliente: false,
            add_keyword: false,
            change_empleados: false,
            edit_clientes: false,
            edit_keywords: false,
            info: false,
            info_adicional: false,
            status_cliente: false,
            status_keyword: false
          },
          view: true
        }
      }
    }

    //db.child('Empleados').push(empleado);


    var multiPathFin = {}


    //multiPathFin[`Empleados/${this.props.empleado.id_empleado}/online_state`] = false


  }

  disconnect = () => {
    db.onDisconnect().cancel()

    if (!this.props.empleado || !this.state.id_tiempo) return null
    //console.log('disconect', !this.props.empleado || !this.state.id_tiempo);
    //if(!!this.props.empleado )
    var multiPath = {}
    multiPath[`Empleados/${this.props.empleado.id_empleado}/online_state`] = false;
    multiPath[`Servicios/Times/empleados/${this.props.empleado.id_empleado}/mensualidades/${moment().format('YYYY-MM')}/${this.state.id_tiempo}/end`] = Firebase.database.ServerValue.TIMESTAMP;
    //console.log(this.state.vistasLinkbuilding);

    if (this.state.panel_home === 'linkbuilding' && this.state.vistasLinkbuilding.items.enlaces.checked) {

      if (this.state.filtros_lb_enlaces_free.type.items.free.checked) {
        //console.log('panel enlaces y vista gratuita', this.state.timeCliente);
        if (this.state.timeCliente && this.state.timeCliente.date && this.state.timeCliente.date === moment().format('YYYY-MM')) {
          multiPath[`Servicios/Times/clientes/${this.state.timeCliente.id_cliente}/servicios/linkbuilding/free/mensualidades/${this.state.timeCliente.date}/empleados/${this.state.empleado.id_empleado}/registro/${this.state.timeCliente.id_tiempo}/end`] = Firebase.database.ServerValue.TIMESTAMP;
        }
      } else if (this.state.filtros_lb_enlaces_free.type.items.paid.checked) {
        //console.log('panel enlaces y vista de pago', this.state.timeCliente);
        if (this.state.timeCliente && this.state.timeCliente.date && this.state.timeCliente.date === moment().format('YYYY-MM')) {
          multiPath[`Servicios/Times/clientes/${this.state.timeCliente.id_cliente}/servicios/linkbuilding/paid/mensualidades/${this.state.timeCliente.date}/empleados/${this.state.empleado.id_empleado}/registro/${this.state.timeCliente.id_tiempo}/end`] = Firebase.database.ServerValue.TIMESTAMP;
        }
      }
    }

    db.onDisconnect().update(multiPath)
      .then(() => {
        //console.log('OOK');
      })
      .catch(e => console.log(e));
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

  realizarCopia = () => {
    db.once("value", snapshot => {
      var database = {};
      snapshot.forEach(data => {
        database[data.key] = data.val();
      });
      console.log(database);
      var element = document.createElement("a");
      var file = new Blob([JSON.stringify(database)], { type: 'text/json' });
      element.href = URL.createObjectURL(file);
      element.download = `tracking_bbdd_importada.json`;
      element.click();
    })
  }

  changePanel = (panel) => {
    var multiPath = {}
    multiPath[`Empleados/${this.props.empleado.id_empleado}/session/panel`] = panel
    if (this.props.empleado) {
      db.update(multiPath)
    }
    this.props.setPanelHome(panel)
  }

  render() {
    if (!this.state.empleado) return null;
    return (
      <div className="container-app">

        {/*<div onClick={()=>this.realizarCopia()}>restaurar</div>*/}

        {/*Barra lateral con los botones para cambiar los paneles*/}
        <div className='menu-bar'>

          {/*BOTON CLIENTES*/}
          <div className='container-icons-bar'>
            <div id='btn-clientes' onClick={() => this.changePanel('clientes')} className={`${this.props.panel_home === 'clientes' ? 'active' : ''}`} ><i className="material-icons"> person </i></div>
          </div>

          {/*BOTON TRACKING*/}
          <div className='container-icons-bar'>
            <div id='btn-tracking' onClick={() => this.changePanel('tracking')} className={`${this.props.panel_home === 'tracking' ? 'active' : ''}`} ><i className="material-icons"> track_changes </i></div>
          </div>

          {/*BOTON LINKBUILDING*/}
          <div className='container-icons-bar'>
            <div id='btn-linkbuilding' onClick={() => this.changePanel('linkbuilding')} className={`${this.props.panel_home === 'linkbuilding' ? 'active' : ''}`} ><i className="material-icons"> link </i></div>
          </div>


          {/*BOTON EMPLEADO*/}
          <div className='container-icons-bar'>

            {this.props.tareasEmpleado && Object.entries(this.props.tareasEmpleado).length>0?
              <div className='globo-tareas'>
                {Object.entries(this.props.tareasEmpleado).length}
              </div>
              :
              null
            }
            <div id='btn-linkbuilding' onClick={() => this.changePanel('empleado')} className={`${this.props.panel_home === 'empleado' ? 'active' : ''}`} ><i className="material-icons"> assignment_ind </i></div>
          </div>

        </div>

        <div className='container-paneles'>

          {this.props.clientes && this.props.panel_home === 'clientes' ? <Clientes visibility={this.props.panel_home === 'clientes' ? true : false} /> : null}
          {this.props.clientes && this.props.panel_home === 'tracking' ? <Tracking visibility={this.props.panel_home === 'tracking' ? true : false} /> : null}
          {this.props.clientes && this.props.panel_home === 'linkbuilding' ? <LinkBuilding visibility={this.props.panel_home === 'linkbuilding' ? true : false} /> : null}
          {this.props.clientes && this.props.panel_home === 'empleado' ? <Empleado visibility={this.props.panel_home === 'empleado' ? true : false} /> : null}

        </div>



        <PopupInfo />


      </div>
    );
  }

  /*
  datosTracking = () => {

    var clientes = bbdd;


    }
    */
}

function mapStateToProps(state) {
  return {
    clientes: state.clientes,
    empleado: state.empleado,
    tareasEmpleado: state.panelEmpleado.tareasEmpleado,
    panel_home: state.panel_home,
    vistasLinkbuilding: state.linkbuilding.vistas,
    cliente_seleccionado: state.cliente_seleccionado,
    timeCliente: state.global.timeCliente,

    filtros_lb_enlaces_free: state.linkbuilding.enlaces.tipos.free.paneles.lista.filtros,
    filtros_lb_enlaces_paid: state.linkbuilding.enlaces.tipos.paid.paneles.lista.filtros,

    medios_paid: state.linkbuilding.medios.tipos.paid.medios,
    medio_seleccionado_paid: state.linkbuilding.medios.tipos.paid.medio_seleccionado,

    categoria_seleccionada: state.linkbuilding.medios.tipos.free.categoria_seleccionada,
    medios_free: state.linkbuilding.medios.tipos.free.medios,
    medio_seleccionado_free: state.linkbuilding.medios.tipos.free.medio_seleccionado,

    filtros_tracking_clientes: state.tracking.paneles.lista.filtros,

  }
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
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

    setFiltrosTracking,
    setNotificaciones,
    setTareasEmpleado

  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Home);
