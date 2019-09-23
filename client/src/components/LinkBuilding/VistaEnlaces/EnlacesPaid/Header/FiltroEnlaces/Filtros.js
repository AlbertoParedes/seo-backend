import React, { Component } from 'react'
import ListaVistas from '../../../../../Filtros/ListaVistas'
import ItemsFiltro from '../../../../../Filtros/ItemsFiltro'
import ListaFiltros from '../../../../../Filtros/ListaFiltros'
import Fecha from '../../../../../Global/Fecha';
import data from '../../../../../Global/Data/Data';
import * as functions from '../../../../../Global/functions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setVistaLinkBuilding, setFiltrosEnlacesPaidListaLinkbuilding, setFechaEnlaces, setFiltrosFreePaid, setPopUpInfo } from '../../../../../../redux/actions';
import PopUpLista from '../../../../../Global/Popups/ListaOpciones'

import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();

class Filtros extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show_filtros: false,
      show_vistas: false,
      show_calendar: false,
      stringMes: '',
      fecha: this.props.fecha,
      show_new_enlaces: false,

      show_medios: false,
      medios_usados: {},
      micronichos: false,
      micronicho_selecionado: 'home',

      new_enlaces_enterprise: {
        follows: { valor: 'Follow normales' },
        enterprise: { valor: 'Follow Enterprise' }
      }

    }
  }

  changeFiltros = (filtros) => {

    if (this.props.filtros.type !== filtros.type) {
      this.props.setFiltrosFreePaid(filtros.type)
    } else {
      this.props.setFiltrosEnlacesPaidListaLinkbuilding(filtros)
    }
    //this.props.setFiltrosEnlacesFreeListaLinkbuilding(filtros)
  }

  setFecha = () => {
    var array = this.state.fecha.split('-');
    var mes = (+array[1]);
    var stringMes = data.months[mes - 1]
    this.setState({ stringMes })
  }

  componentWillReceiveProps = newProps => {
    if (this.state.fecha !== newProps.fecha) {
      this.setState({ fecha: newProps.fecha }, () => { this.setFecha() })
    }
  }
  componentWillMount = () => {
    this.setFecha()
  }

  changeMediosUsados = () => {
    var medios_usados = {},
      mediosUrl = {}, micronicho_selecionado = this.state.micronicho_selecionado, micronichos = false

    if (this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.activo && this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs) {

      micronichos = this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs
      micronichos.home = { web: this.props.cliente_seleccionado.web }

      //micronicho_selecionado = this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.micronicho_selecionado
      if (micronicho_selecionado === 'home') {
        mediosUrl = this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.medios_usados_follows;
        //micronicho_selecionado='home'
      } else {
        mediosUrl = this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs[micronicho_selecionado].medios_usados
      }

    } else {
      mediosUrl = this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.medios_usados_follows
    }

    try {
      Object.entries(mediosUrl).forEach(([k, m]) => {
        medios_usados[k] = {
          valor: this.props.medios[k].web
        }
      })
    } catch (e) {
      medios_usados = {}
    }

    this.setState({ medios_usados, micronicho_selecionado, show_medios: true, micronichos })

  }

  setMicronicho = (id_micronicho) => {
    this.setState({ micronicho_selecionado: id_micronicho }, () => {
      this.changeMediosUsados()
    })
  }

  newEnlace = () => {

    if (this.props.cliente_seleccionado.eliminado || !this.props.cliente_seleccionado.activo || !this.props.cliente_seleccionado.servicios.linkbuilding.paid.activo) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No se pueden crear enlaces a clientes eliminados o desactivados' })
      return null
    }

    if (this.props.fecha !== functions.getTodayDate() && !this.props.cliente_seleccionado.servicios.linkbuilding.paid.enlaces_anteriores) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No puedes crear enlaces en meses anteriores' })
      return false
    }

    var mensualidad = this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[this.state.fecha]
    var bote = this.props.cliente_seleccionado.servicios.linkbuilding.paid.bote
    //15% * (inversion_mensual-comision(40%))
    var boteMargen = (mensualidad.porcentaje_perdida / 100) * (mensualidad.inversion_mensual * (mensualidad.beneficio / 100));
    var total = bote + boteMargen

    //si es mayor a 0 te dejo crear mas enlaces
    if (total > 0) {

      var key = db.child(`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces`).push().key, multiPath = {};
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces/${key}`] = {
        id_empleado: this.props.empleado.id_empleado, id_enlace: key, fecha_creacion: (+ new Date())
      }

      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se ha añadido el enlace correctamente' })
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })
    } else {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No tienes suficiente presupuesto' })
    }


  }

  unlockCliente = () => {

    try { if (this.props.cliente_seleccionado.servicios.linkbuilding.paid.editando_por.id_empleado === this.props.empleado.id_empleado) { return null } } catch (e) { }

    var multiPath = {}
    multiPath[`Empleados/${this.props.empleado.id_empleado}/session/cliente_seleccionado`] = this.props.cliente_seleccionado.id_cliente
    multiPath[`Empleados/${this.props.empleado.id_empleado}/session/subpanel`] = 'linkbuilding_paid'
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/editando_por`] = { id_empleado: this.props.empleado.id_empleado, nombre: this.props.empleado.nombre + ' ' + this.props.empleado.apellidos, subpanel: 'linkbuilding_paid' }

    try {
      if (this.props.cliente_seleccionado.servicios.linkbuilding.free.editando_por.id_empleado === this.props.empleado.id_empleado) {
        multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/editando_por`] = null
        multiPath[`Empleados/${this.props.empleado.id_empleado}/session/subpanel`] = 'linkbuilding_paid'
      }
    } catch (e) { }

    try {
      if (this.props.empleado.session.cliente_seleccionado && this.props.empleado.session.cliente_seleccionado !== this.props.cliente_seleccionado.id_cliente) {
        multiPath[`Clientes/${this.props.empleado.session.cliente_seleccionado}/servicios/linkbuilding/paid/editando_por`] = null
      }
    } catch (e) { }

    if (Object.keys(multiPath).length > 0) {
      db.update(multiPath)
        .then(() => { })
        .catch(err => { console.log(err); })
    }

  }

  changeVista = (vistas) => {
    var multiPath = {}
    var vistaDisponible = Object.entries(vistas.items).find(([k, v]) => { return v.checked })
    if (vistaDisponible) {
      multiPath[`Empleados/${this.props.empleado.id_empleado}/session/vista`] = vistaDisponible[0]
      db.update(multiPath)
    }
    this.props.setVistaLinkBuilding(vistas)
  }
  doNothing = () => { }




  selectOpcionNewEnlace = (id) => {

    if (id === 'follows') {
      this.newEnlace()
      return false
    }

    if (id === 'enterprise') {

      if (this.props.cliente_seleccionado.eliminado || !this.props.cliente_seleccionado.activo || !this.props.cliente_seleccionado.servicios.linkbuilding.free.activo) {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No se pueden crear enlaces a clientes eliminados o desactivados' })
        return null
      }

      if (this.props.fecha !== functions.getTodayDate() && !this.props.cliente_seleccionado.servicios.linkbuilding.paid.enlaces_anteriores) {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No puedes crear enlaces en meses anteriores' })
        return false
      }

      db.child(`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces`)
        .orderByChild('id_empleado').equalTo('Enterprise')
        .once("value", snapshot => {
          snapshot.forEach((data) => {
            var enlace = data.val();
            console.log(enlace);

          });
        })
        .then(data => {
          if (!data.val()) {
            this.createEnterpriseitem()
          } else {
            var num = Object.entries(data.val()).filter(([i, o]) => { return o.id_empleado === 'Enterprise' })

            if (num.length < 2) {
              this.createEnterpriseitem()
            } else {
              this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Solo se pueden crear 2 enlaces enterprise' })
            }
          }
        })
    }
  }

  createEnterpriseitem = () => {
    var multiPath = {}
    var key = db.child(`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces`).push().key
    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces/${key}`] = {
      id_empleado: 'Enterprise', id_enlace: key, fecha_creacion: (+ new Date())
    }

    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se ha añadido el enlace correctamente' })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })
  }





  render() {

    var blocked = false;
    var nombreEmpleado = ''
    try {
      if (this.props.cliente_seleccionado.servicios.linkbuilding.paid.editando_por.id_empleado !== this.props.empleado.id_empleado /*&& this.props.empleado.session.linkbuilding.editando_a!==this.props.cliente_seleccionado.id_cliente*/) {
        blocked = true;
        nombreEmpleado = this.props.cliente_seleccionado.servicios.linkbuilding.paid.editando_por.nombre
      }
    } catch (e) { }


    return (
      <div className='pr'>
        <ItemsFiltro filtros={this.props.filtros} updateFiltros={(filtros => this.changeFiltros(filtros))} />
        <div className='opciones-alumnos'>
          <div className='deg-opt'></div>

          <div className='btn-options pr'>
            <i className="material-icons"> calendar_today </i> <span>{this.state.stringMes}</span>
            <Fecha setFecha={fecha => this.props.setFechaEnlaces(fecha)} clss={'input-fecha-enlaces'} id={'date-enlaces-paid'} position={'fecha_enlaces_position'} month={this.props.fecha.split('-')[1]} year={this.props.fecha.split('-')[0]} />
          </div>

          <div className='btn-options pr' onClick={() => this.setState({ show_filtros: this.state.show_filtros ? false : true })}>
            <i className="material-icons"> filter_list </i> <span>Filtros</span>
            {this.state.show_filtros ?
              <ListaFiltros filtros={this.props.filtros} updateFiltros={(filtros => this.changeFiltros(filtros))} close={() => this.setState({ show_filtros: false })} /> : null
            }
          </div>

          <div className='btn-options pr' onClick={() => this.setState({ show_vistas: this.state.show_vistas ? false : true })}>
            <i className="material-icons"> visibility </i> <span>Vistas</span>
            {this.state.show_vistas ?
              <ListaVistas vistas={this.props.vistas} updateVistas={(vistas => this.changeVista(vistas))} close={() => this.setState({ show_vistas: false })} /> : null
            }
          </div>

          {/*Items barra*/}

          {/*
          <div className={`item-container-icon-top-bar pr ${this.state.show_new_cliente?' color-azul':''}`} >
            <i onClick={()=>this.changeEdit()} className="material-icons hover-azul middle-item">save_alt</i>
          </div>
          */}

          {this.props.cliente_seleccionado ?
            <div className={`item-container-icon-top-bar pr ${this.state.show_medios ? ' color-azul' : ''}`} >
              <i onClick={() => this.changeMediosUsados()} className="material-icons hover-azul middle-item">account_balance</i>
              {this.state.show_medios ?
                <PopUpLista
                  selectOpcion={(id) => { this.goLink(id) }}
                  opciones={this.state.medios_usados} title='Medios usados'
                  _class='rigth-popup-medios-usados' _class_div='max-width' _class_container='size-medios-popup scroll-bar-exterior'
                  close={() => this.setState({ show_medios: false })}
                  tag='a' buscar={true}
                  placeholder_buscar={'Busca un medio utilizado'}
                  micronichos={this.state.micronichos}
                  micronicho_selecionado={this.state.micronicho_selecionado}
                  setMicronicho={(id_micronicho) => { this.setMicronicho(id_micronicho) }}
                />
                : null}
            </div>
            : null
          }

          {this.props.cliente_seleccionado ?

            this.props.cliente_seleccionado.seo === 'Enterprise'
              && this.props.cliente_seleccionado.servicios.linkbuilding.paid.enlaces_por_seo.mensualidades
              && this.props.cliente_seleccionado.servicios.linkbuilding.paid.enlaces_por_seo.mensualidades[this.state.fecha].seo === 'Enterprise' ?
              <div className={`item-container-icon-top-bar pr ${this.state.show_new_enlaces ? 'color-azul' : ''}`} >
                <i onClick={() => this.setState({ show_new_enlaces: true })} className="material-icons hover-azul middle-item">add</i>
                {this.state.show_new_enlaces ?
                  <PopUpLista selectOpcion={(id) => this.selectOpcionNewEnlace(id)} opciones={this.state.new_enlaces_enterprise} _class='opciones-search-show position-add-enlaces' close={() => this.setState({ show_new_enlaces: false })} /> : null
                }
              </div>

              :

              <div className={`item-container-icon-top-bar pr ${this.state.show_new_enlaces ? 'color-azul' : ''}`} >
                <i onClick={() => this.newEnlace()} className="material-icons hover-azul middle-item">add</i>
              </div>

            : null
          }


          {blocked && this.props.cliente_seleccionado ?
            <div className={`item-container-icon-top-bar pr ${this.state.show_new_cliente ? 'middle-item color-azul' : ''}`} >
              <i onClick={() => this.unlockCliente()} className="material-icons lock-cliente" data-lock='lock' data-open-lock='lock_open'></i>
              <PopUpLista selectOpcion={() => { this.doNothing()/*var click = null;*/ }} hover={true} opciones={{ cliente: { valor: 'Editando por ' + nombreEmpleado } }} _class='opciones-search-show position-add-enlaces-lock' close={() => { this.doNothing()/*var click = null;*/ }} />
            </div>
            : null
          }

        </div>

      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    vistas: state.linkbuilding.vistas,
    fecha: state.linkbuilding.enlaces.fecha,
    filtros: state.linkbuilding.enlaces.tipos.paid.paneles.lista.filtros,
    enlaces: state.linkbuilding.enlaces.tipos.paid.enlaces,
    cliente_seleccionado: state.cliente_seleccionado,
    empleado: state.empleado,
    medios: state.linkbuilding.medios.tipos.paid.medios
  }
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    setVistaLinkBuilding,
    setFiltrosEnlacesPaidListaLinkbuilding,
    setFechaEnlaces,
    setFiltrosFreePaid,
    setPopUpInfo
  }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(Filtros);
