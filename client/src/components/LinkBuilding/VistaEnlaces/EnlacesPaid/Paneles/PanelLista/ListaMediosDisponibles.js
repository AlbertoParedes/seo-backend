import React, { Component } from 'react';
import * as functions from '../../../../../Global/functions'
import data from '../../../../../Global/Data/Data'
import search from '../../../../../Global/Imagenes/search.svg';
import { connect } from 'react-redux';
import $ from 'jquery'
class ListaMediosDisponibles extends Component {

  constructor(props) {
    super(props);
    this.state = {
      opciones: this.props.opciones,
      opcion_selected: this.props.opcion_selected,
      visible: false,
      search: '',
      search_new: this.props.search_new ? this.props.search_new : '',
      correct_new_item: false,

      cliente_seleccionado: this.props.cliente_seleccionado,
      medios: this.props.medios,
      enlaces_disponibles: []
    }
  }

  componentWillMount = () => {

    this.getData()

    document.addEventListener('mousedown', this.clickOutSide, false);
    var self = this
    setTimeout(function () { self.setState({ visible: true }) }, 10);
  }
  getData = () => {
    var enlaces_disponibles = []

    var medios_usados = this.state.cliente_seleccionado.servicios.linkbuilding.paid.home.medios_usados_follows
    try {
      if (this.props.enlace.micronicho) {
        if (this.props.enlace.micronicho !== 'home') {
          medios_usados = this.state.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs[this.props.enlace.micronicho].medios_usados
        }
      }
    } catch (e) { }

    if (!medios_usados) medios_usados = {}


    Object.entries(this.state.medios).forEach(([k1, m]) => {
      if (m.eliminado || !m.activo) return false
      if (!medios_usados[m.id_medio] || this.props.enlace.id_medio === m.id_medio) {
        if (m.enlaces) {
          Object.entries(m.enlaces).forEach(([k2, e]) => {
            // comprobamos que el enlace aun se puede seleccionar ya que no hay ningun cliente asignado
            if ((!e.id_cliente && !medios_usados[m.id_medio]) || this.props.enlace.id_enlace_comprado === k2) {
              e.id_medio = m.id_medio;
              e.web_medio = functions.cleanProtocolo(m.web);
              e.web = m.web;
              enlaces_disponibles.push(e)
            }
          })
        }
      }

    })

    enlaces_disponibles.sort((a, b) => {
      if (a['web_medio'].toLowerCase() > b['web_medio'].toLowerCase()) { return 1; }
      if (a['web_medio'].toLowerCase() < b['web_medio'].toLowerCase()) { return -1; }
      return 0;
    });

    this.setState({ enlaces_disponibles })

  }
  componentWillUnmount = () => { document.removeEventListener('mousedown', this.clickOutSide, false); }
  clickOutSide = (e) => { if (!this.node.contains(e.target)) { this.cancelarPopUp() } }
  cancelarPopUp = () => {
    this.setState({ visible: false }, () => {
      var self = this
      setTimeout(function () { self.props.close() }, 500);

    })
  }

  componentWillReceiveProps = (newProps) => {
    if (
      this.state.opcion_selected !== newProps.opcion_selected ||
      this.state.opciones !== newProps.opciones ||
      this.state.search_new !== newProps.search_new ||
      this.state.medios !== newProps.medios ||
      this.state.cliente_seleccionado !== newProps.cliente_seleccionado
    ) {
      this.setState({
        opcion_selected: newProps.opcion_selected,
        opciones: newProps.opciones,
        search_new: newProps.search_new,
        medios: newProps.medios,
        cliente_seleccionado: newProps.cliente_seleccionado
      }, () => {
        this.getData()
      })
    }

  }

  clickLink = (e, id, obj) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.selectOpcion(id, obj)
    if (this.props.cerrarClick) {
      this.cancelarPopUp()
    }
  }

  changeNew = (text) => {
    if (this.props.obligacion === 'link') {
      var correct_new_item = true
      if (text.trim() !== '' && !text.trim().startsWith('http://') && !text.trim().startsWith('https://')) { correct_new_item = false }
      if (text.trim() !== '' && !text.includes('.')) { correct_new_item = false }
      this.setState({ search_new: text, correct_new_item })
    } else {
      this.setState({ search_new: text, correct_new_item: text.trim() !== '' ? true : false })
    }
  }
  enterKeyNew = (event) => {
    if (event.key === 'Enter' && this.state.correct_new_item && this.props.search_new !== this.state.search_new && this.state.search_new.trim() !== '') {
      this.props.guardarNew(this.state.search_new);
      this.cancelarPopUp()
    }
  }

  setMedio = (e, enlace, disponibilidad) => {
    e.stopPropagation()
    this.props.selectOpcion(enlace, disponibilidad)
  }

  render() {

    var bote = this.props.bote;
    var porcentaje_perdida = (+this.props.inversionMensualString) * (this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[this.props.fecha].porcentaje_perdida / 100);

    return (
      <div className={`container-opt-search ${this.props._class}`} ref={node => this.node = node}>

        <div className={`opciones-search-popup ${this.props._class_div ? this.props._class_div : ''} ${this.state.visible ? 'opciones-search-show-popup' : ''}`}>
          <div className={`${this.props._class_container ? this.props._class_container : ''}`}>
            {this.props.title ?
              <div className='title-pop-up'>{this.props.title}</div>
              : null}

            {this.props.buscar ?
              <li className={``}>
                <img className='icon-search-panel' src={search} alt='' />
                <input placeholder={this.props.placeholder_buscar ? this.props.placeholder_buscar : ''} value={this.state.search} onChange={(e) => this.setState({ search: e.target.value })} />
              </li>
              : null}

            {this.state.enlaces_disponibles.map((o, k) => {
              if (this.state.search.trim() !== '' && !o.web_medio.includes(this.state.search)) return null
              return (
                <ItemEnlace key={k} enlace={o} opcion_selected={this.props.enlace.id_enlace_comprado} bote={bote} porcentaje_perdida={porcentaje_perdida} plataformas={this.props.plataformas} empleados={this.props.empleados} setMedio={(e, o, disponibilidad) => { this.setMedio(e, o, disponibilidad) }} />
              )
            })}

            {this.props.opcionEliminar ?
              <span className='eliminar_pop_up' onClick={() => this.props.eliminar()}>{this.props.title_eliminar}</span>
              : null}

          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) { return { cliente_seleccionado: state.cliente_seleccionado, plataformas: state.linkbuilding.medios.tipos.paid.plataformas, medios: state.linkbuilding.medios.tipos.paid.medios, fecha: state.linkbuilding.enlaces.fecha, empleado: state.empleado, empleados: state.empleados } }
export default connect(mapStateToProps)(ListaMediosDisponibles);

class ItemEnlace extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  mouseEnter = (x) => {
    var altura = ($(x).prop('scrollHeight') - $(x).position().top) * -1;
    $(x).find('.info-enlaces-paid').css("top", `${altura}px`);
  }

  clickLink = (e, o, disponibilidad) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.setMedio(e, o, disponibilidad)
  }

  render() {
    var o = this.props.enlace;
    var disponibilidad = '';


    if (o.mini_enlaces) {

      if (o.mini_enlaces[0].precio <= this.props.bote) { disponibilidad = 'disponible' }
      else if (o.mini_enlaces[0].precio <= (this.props.bote + this.props.porcentaje_perdida)) { disponibilidad = 'warning' }
      else { disponibilidad = 'nodisponible' }

    } else {

      if (o.precio <= this.props.bote) { disponibilidad = 'disponible' }
      else if (o.precio <= (this.props.bote + this.props.porcentaje_perdida)) { disponibilidad = 'warning' }
      else { disponibilidad = 'nodisponible' }

    }



    var plataforma = o.id_plataforma ? this.props.plataformas[o.id_plataforma].texto : ''

    return (
      <li className='display_flex' onClick={(e) => this.props.setMedio(e, o, disponibilidad)}>
        <div className={`points_lista punto-status-enlace-paid ${disponibilidad === 'disponible' ? 'enlace-disponible' : ''} ${disponibilidad === 'warning' ? 'enlace-warning' : ''} ${disponibilidad === 'nodisponible' ? 'enlace-nodisponible' : ''} ${this.props.opcion_selected && this.props.opcion_selected === o.id_enlace ? 'favorite-status' : ''}`}></div>
        <div className='item-enlace-medios-disponibles'>
          <div className='item-web-medio-enlaces break_sentence'>
            <a href={o.web} className={`${this.props.opcion_selected === o.id_enlace ? 'color-azul' : ''}`} onClick={(e) => { this.clickLink(e, o, disponibilidad) }}>{o.web_medio}</a>
          </div>
          <div className='item-web-medio-enlaces-precio hover-info_enlaces' onMouseEnter={(e) => this.mouseEnter(e.currentTarget)} >
            {o.mini_enlaces ?
              <span className='icon-share-enlace'><i className="material-icons"> group </i></span>
              : null}

            <span className=''>{o.mini_enlaces ? functions.getDecimcals(o.mini_enlaces[0].precio_con_iva) : functions.getDecimcals(o.precio_con_iva)}€
                <div className='info-enlaces-paid'>
                <div className='datos-enlace-right'>
                  <div><span className="item-enlace-comprado-title">Precio de compra: </span><span className="item-enlace-comprado-data">{o.mini_enlaces ? functions.getDecimcals(o.mini_enlaces[0].precio_con_iva) : functions.getDecimcals(o.precio_con_iva)} €  ({o.mini_enlaces ? functions.getDecimcals(o.mini_enlaces[0].precio) : functions.getDecimcals(o.precio)} € sin IVA)</span></div>
                  <div><span className="item-enlace-comprado-title">Plataforma: </span><span className="item-enlace-comprado-data">{plataforma}</span></div>
                  <div>
                    <span className='item-enlace-comprado-title'>Fecha de compra: </span>
                    <span className='item-enlace-comprado-data'>{functions.getDateNTimeFromDate(o.timestamp)}</span>
                  </div>

                  <div>
                    <span className='item-enlace-comprado-title'>Tipo de enlace: </span>
                    <span className='item-enlace-comprado-data'>{o.compartir ? data.compartir_enlaces[o.compartir].texto : ''}</span>
                  </div>
                  <div>
                    <span className='item-enlace-comprado-title'>Compra realizada por: </span>
                    <span className='item-enlace-comprado-data'>{this.props.empleados[o.id_empleado].nombre + ' ' + this.props.empleados[o.id_empleado].apellidos}</span>
                  </div>
                </div>
              </div>
            </span>
          </div>
        </div>
      </li>
    )
  }

}
