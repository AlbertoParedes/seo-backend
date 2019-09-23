import React, { Component } from 'react';
import * as functions from '../../../../../Global/functions'
import PopUpLista from '../../../../../Global/Popups/ListaOpciones'
import InputPopUp from '../../../../../Global/Popups/InputPopUp'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PopUpDescription from '../../../../../Global/PopUpDescription'
import { setPopUpInfo, selectMedioMediosGratuitos, setPanelMediosFreeLinkbuilding } from '../../../../../../redux/actions';
import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();
class ItemEnlaceFree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_categorias: false,
      show_medios: false,
      show_enlace: false,
      show_destinos: false,

      medios_disponibles: {},
      destinos_disponibles: {}, id_destino_selected: false,
      anchors_disponibles: {}, id_anchors_selected: false,

      show_description: false

    };
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.bloqueado) {
      this.setState({
        show_categorias: false,
        show_medios: false,
        show_enlace: false,
        show_destinos: false
      })
    }
  }

  clickLink = (e) => {
    e.preventDefault();
  }


  //categoria
  seleccionarCategoria = (id_categoria, obj) => {
    var multiPath = {}
    multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/categoria`] = id_categoria
    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })
  }
  openCategorias = (editable, done_by) => {
    if (this.props.bloqueado) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Este cliente lo esta editando otro empleado' })
      return false;
    }
    if (this.props.enlace.id_medio) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Para cambiar categoria debes eliminar el medio seleccionado' })
      return false;
    }

    if (!editable) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: `Permiso exclusivo para los Super Administradores${done_by ? ' y ' + done_by : ''}` })
      return false;
    }
    this.setState({ show_categorias: true })
  }
  //Medio----------
  openMedios = (editable, done_by) => {
    if (this.props.bloqueado) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Este cliente lo esta editando otro empleado' })
      return false;
    }
    if (this.props.enlace.enlace) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Para cambiar el medio debes borrar el enlace' })
      return false;
    }

    if (!editable) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: `Permiso exclusivo para los Super Administradores${done_by ? ' y ' + done_by : ''}` })
      return false;
    }

    var medios_disponibles = {};
    try {
      //medios_usados = this.props.cliente_seleccionado.servicios.linkbuilding.free.home.medios_usados;
      var tipo_medio = this.props.enlace.tipo === 'follow' ? 'medios_usados_follow' : 'medios_usados_nofollows'
      Object.entries(this.props.medios).forEach(([k, m]) => {
        Object.entries(m.medios).forEach(([k2, m2]) => {
          if (m2.eliminado || !m2.activo) return false;
          if (this.props.enlace.categoria && this.props.enlace.categoria !== k) { return false }

          //Quitamos los medios repetidos
          try {
            if (this.props.enlace.id_medio) {
              if (this.props.enlace.id_medio !== k2 && this.props.cliente_seleccionado.servicios.linkbuilding.free.home[tipo_medio][k2]) { return false }
            } else {
              if (this.props.cliente_seleccionado.servicios.linkbuilding.free.home[tipo_medio][k2]) { return false }
            }
          } catch (e) { console.log(e); }

          medios_disponibles[k2] = { categoria: k, id: k2 }
          medios_disponibles[k2].status = true;
          medios_disponibles[k2].valor = m2.web;

        })
      })

    } catch (e) { }
    this.setState({ medios_disponibles, show_medios: true })
  }
  seleccionarMedio = (id_medio, obj) => {
    var multiPath = {}

    //Si ya existe otro medio seleccionado habrá que quitarlo de lo medios usados
    if (this.props.enlace.id_medio) {

      if (id_medio === this.props.enlace.id_medio) { return false }

      //si se cambia de medio y ya habia un enlace hecho, se borrará el enlace y el done_by
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/enlace`] = null
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/done_by`] = null

      var tipo_medio = this.props.enlace.tipo === 'follow' ? 'medios_usados_follow' : 'medios_usados_nofollows'
      var medio_usado = this.props.cliente_seleccionado.servicios.linkbuilding.free.home[tipo_medio][this.props.enlace.id_medio];
      if (medio_usado.fechas && Object.keys(medio_usado.fechas).length === 1 && medio_usado.fechas[this.props.fecha]) {
        //si no se ha repetido este medio eliminaremos todos de los medios disponibles
        multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/${this.props.enlace.tipo === 'follow' ? 'medios_usados_follow' : 'medios_usados_nofollows'}/${this.props.enlace.id_medio}`] = null
      } else if (medio_usado.fechas && Object.keys(medio_usado.fechas).length > 1 && medio_usado.fechas[this.props.fecha]) {
        //si se ha repetido este medio solo eliminaremos la fecha de este mes
        multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/${this.props.enlace.tipo === 'follow' ? 'medios_usados_follow' : 'medios_usados_nofollows'}/${this.props.enlace.id_medio}/fechas/${this.props.fecha}`] = null
      }
    }

    //si no se ha seleccionado la categoria se añadirá al seleccionar el medio
    if (!this.props.enlace.categoria) {
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/categoria`] = obj.categoria
    }

    multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/id_medio`] = id_medio
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/${this.props.enlace.tipo === 'follow' ? 'medios_usados_follow' : 'medios_usados_nofollows'}/${id_medio}/categoria`] = obj.categoria
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/${this.props.enlace.tipo === 'follow' ? 'medios_usados_follow' : 'medios_usados_nofollows'}/${id_medio}/id_medio`] = id_medio
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/${this.props.enlace.tipo === 'follow' ? 'medios_usados_follow' : 'medios_usados_nofollows'}/${id_medio}/fechas/${this.props.fecha}`] = true

    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })
  }
  eliminarMedio = () => {
    var multiPath = {}
    var tipo_medio = this.props.enlace.tipo === 'follow' ? 'medios_usados_follow' : 'medios_usados_nofollows'
    var medio_usado = this.props.cliente_seleccionado.servicios.linkbuilding.free.home[tipo_medio][this.props.enlace.id_medio];
    if (medio_usado.fechas && Object.keys(medio_usado.fechas).length === 1 && medio_usado.fechas[this.props.fecha]) {
      //si no se ha repetido este medio eliminaremos todos de los medios disponibles
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/${this.props.enlace.tipo === 'follow' ? 'medios_usados_follow' : 'medios_usados_nofollows'}/${this.props.enlace.id_medio}`] = null
    } else if (medio_usado.fechas && Object.keys(medio_usado.fechas).length > 1 && medio_usado.fechas[this.props.fecha]) {
      //si se ha repetido este medio solo eliminaremos la fecha de este mes
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/${this.props.enlace.tipo === 'follow' ? 'medios_usados_follow' : 'medios_usados_nofollows'}/${this.props.enlace.id_medio}/fechas/${this.props.fecha}`] = null
    }
    multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/id_medio`] = null

    if (this.props.enlace.enlace) {
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.props.fecha}/empleados/${this.props.enlace.done_by}/${this.props.enlace.tipo === 'follow' ? 'enlaces_follows' : 'enlaces_nofollows'}/${this.props.enlace.id_enlace}`] = null
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/enlace`] = null
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/done_by`] = null
    }
    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })

  }
  //Destinos---------
  openDestinos = (editable, done_by) => {

    if (this.props.bloqueado) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Este cliente lo esta editando otro empleado' })
      return false;
    }

    if (!editable) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: `Permiso exclusivo para los Super Administradores${done_by ? ' y ' + done_by : ''}` })
      return false;
    }

    var destinos_disponibles = {}, id_destino_selected = false;

    if (this.props.enlace.destino && functions.cleanProtocolo(this.props.cliente_seleccionado.web) === functions.cleanProtocolo(this.props.enlace.destino)) {
      id_destino_selected = 'home'
    }

    destinos_disponibles.home = {
      valor: this.props.cliente_seleccionado.web,
    }

    try {
      var destinos = this.props.cliente_seleccionado.servicios.linkbuilding.free.home.destinos;
      Object.entries(destinos).forEach(([k, d]) => {

        if (this.props.enlace.destino && functions.cleanProtocolo(d.web) === functions.cleanProtocolo(this.props.enlace.destino)) {
          id_destino_selected = k
        }

        destinos_disponibles[k] = { valor: d.web }

      })
    } catch (e) { }
    this.setState({ destinos_disponibles, id_destino_selected, show_destinos: true })
  }
  seleccionarDestino = (id_destino, obj) => {
    var multiPath = {};

    multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/destino`] = obj.valor
    if (Object.entries(multiPath).length > 0) {


      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
          this.setState({ id_destino_selected: false })
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })
    }
  }
  //Anchors
  openAnchors = (editable, done_by) => {
    if (this.props.bloqueado) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Este cliente lo esta editando otro empleado' })

      return false;
    }
    if (!editable) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: `Permiso exclusivo para los Super Administradores${done_by ? ' y ' + done_by : ''}` })

      return false;
    }

    var anchors_disponibles = {}, id_anchor_selected = false;

    try {
      var anchors = this.props.cliente_seleccionado.servicios.linkbuilding.free.home.anchors;
      Object.entries(anchors).forEach(([k, d]) => {

        if (this.props.enlace.anchor && d.anchor.toLowerCase() === this.props.enlace.anchor.toLowerCase()) {
          id_anchor_selected = k
        }

        anchors_disponibles[k] = { valor: d.anchor }

      })
    } catch (e) { }
    this.setState({ anchors_disponibles, id_anchor_selected, show_anchors: true })
  }
  seleccionarAnchor = (id_anchor, obj) => {
    var multiPath = {};

    multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/anchor`] = obj.valor
    if (Object.entries(multiPath).length > 0) {
      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
          this.setState({ id_destino_selected: false })
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })
    }
  }
  //------------------
  //Enlace ---------
  openEnlace = (editable, done_by) => {
    if (this.props.bloqueado) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Este cliente lo esta editando otro empleado' })
      return false;
    }
    if (!editable) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: `Permiso exclusivo para los Super Administradores${done_by ? ' y ' + done_by : ''}` })

      return false;
    }

    if (this.props.enlace.id_medio) {
      this.setState({ show_enlace: true })
    } else {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Tienes que seleccionar un medio' })
    }

  }
  guardarEnlace = (link) => {
    var multiPath = {}
    if (link.trim() === '') {
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/fecha_fin`] = null
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/enlace`] = null
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/done_by`] = null
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.props.fecha}/empleados/${this.props.enlace.done_by}/${this.props.enlace.tipo === 'follow' ? 'enlaces_follows' : 'enlaces_nofollows'}/${this.props.enlace.id_enlace}`] = null
    } else {
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/fecha_fin`] = (+ new Date())
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/enlace`] = link
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/done_by`] = this.props.empleado.id_empleado
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.props.fecha}/empleados/${this.props.empleado.id_empleado}/${this.props.enlace.tipo === 'follow' ? 'enlaces_follows' : 'enlaces_nofollows'}/${this.props.enlace.id_enlace}`] = true
    }
    if (Object.entries(multiPath).length > 0) {
      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })
    }
  }
  //-----------------
  eliminar = (id) => {
    var multiPath = {}
    if (id === 'categoria') {
      //si existe un medio no se puede eliminar
      if (!this.props.enlace.id_medio) {
        multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/categoria`] = null
      } else {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Tienes que eliminar el medio primero' })

      }

    } else if (id === 'destino') {
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/destino`] = null
    }
    else if (id === 'anchor') {
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/anchor`] = null
    }

    if (Object.entries(multiPath).length > 0) {
      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
          if (id === 'destino') {
            this.setState({ id_destino_selected: false })
          }
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })
    }

  }

  guardarNew = (id, text) => {
    var multiPath = {}
    if (id === 'destino') {
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/destino`] = text.trim()
    } else if (id === 'anchor') {
      multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/anchor`] = text.trim() !== '' ? text.trim() : null
    }

    if (Object.entries(multiPath).length > 0) {

      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
          if (id === 'destino') {
            this.setState({ id_destino_selected: false })
          } else if (id === 'anchor') {
            this.setState({ id_anchor_selected: false })
          }
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })
    }
  }

  getStatus = () => {
    var enlace = this.props.enlace, i = 0;
    if (enlace.anchor) i++;
    if (enlace.categoria) i++;
    if (enlace.destino) i++;
    if (enlace.enlace) i++;
    if (enlace.id_medio) i++;

    if (enlace.status && enlace.status.includes('Error')) {
      return 'error'
    } else {
      if (enlace.enlace) {
        return 'done'
      } else if (i > 1 && i < 5) {
        return 'warning'
      }
    }
    return 'new'
  }

  showDescripcion = (e, valor) => {
    try {
      e.stopPropagation()
    } catch (error) { }
    this.setState({ show_description: valor })
  }

  render() {
    var categoria = this.props.enlace.categoria && this.props.medios[this.props.enlace.categoria] ? this.props.medios[this.props.enlace.categoria].nombre : false
    var medio = this.props.enlace.categoria && this.props.medios[this.props.enlace.categoria] && this.props.enlace.id_medio ? this.props.medios[this.props.enlace.categoria].medios[this.props.enlace.id_medio].web : false
    var editable = !this.props.enlace.done_by || this.props.empleado.id_empleado === this.props.enlace.done_by || this.props.empleado.role === 'Super Administrador';
    var done_by = this.props.enlace.done_by ? this.props.empleados[this.props.enlace.done_by].nombre : false;

    var status = this.getStatus()

    var empleado = ''

    if (this.props.empleados) {
      if (this.props.enlace.done_by) {
        empleado = this.props.empleados[this.props.enlace.done_by].nombre
      } else {
        empleado = this.props.enlace.id_empleado?this.props.empleados[this.props.enlace.id_empleado].nombre:''
      }
    }
    
    return (
      <tr>

        {/*this.props.clientes_edit && this.props.clientes_edit.activo?

          <td className={`lb-enlaces-free-checkbox`} >
            <CheckBox _class={`checkbox-in-table ${!permiso_edit?'no-selecionable':''}`} checked={!this.props.clientes_edit.seleccionados[this.props.cliente.id_cliente]?false:this.props.clientes_edit.seleccionados[this.props.cliente.id_cliente].checked } changeValue={value=>this.updateCheckBox(value)}/>
          </td>

          :null
        */}

        <td className='lb-enlaces-free-status'>
          <div className={`status-point ${status === 'done' ? 'good-status' : ''} ${status === 'warning' ? 'warning-status' : ''} ${status === 'new' ? 'normal-status' : ''} ${status === 'error' ? 'wrong-status' : ''}      `} ></div>
        </td>

        <td className='lb-enlaces-free-empleado block-with-text'>
          <span>{empleado}</span>
        </td>

        <td className='lb-enlaces-free-destino pr' onClick={() => this.openDestinos(editable, done_by)}>
          <span className="span_edit">
            <a href={this.props.enlace.destino ? this.props.enlace.destino : '# '} onClick={(e) => { this.clickLink(e) }} className={`break_sentence ${this.props.enlace.destino ? '' : 'text_inactivo'}`} >{this.props.enlace.destino ? this.props.enlace.destino : 'Introduce el destino del enlace'}</a>
            {editable ? <i className="material-icons span_i_edit_input idit_icon icon_seleccionable">arrow_drop_down</i> : null}

            {this.state.show_destinos ?
              <PopUpLista
                cerrarClick={true}
                cleanLink={false}
                opcionEliminar={this.props.enlace.destino ? true : false}
                placeholder_new={'Introduce un destino'}
                title_eliminar='eliminar'
                selectOpcion={(id_medio, obj) => this.seleccionarDestino(id_medio, obj)}
                opcion_selected={this.state.id_destino_selected}
                opciones={this.state.destinos_disponibles} title='Destinos'
                _class='rigth-popup-enlaces'
                _class_div={`max-width min-width-305 ${this.props.enlace.destino ? 'padding-delete-pop-up' : ''}`}
                _class_container='size-medios-popup scroll-bar-exterior'
                _class_new={'new-item-enlaces'}
                close={() => this.setState({ show_destinos: false })}
                search_new={!this.props.enlace.destino ? '' : this.state.id_destino_selected ? '' : this.props.enlace.destino}
                tag='a'
                obligacion='link'
                eliminar={() => { this.eliminar('destino') }}
                guardarNew={(txt) => { this.guardarNew('destino', txt) }}
                new={true}
              />
              : null}

          </span>
        </td>

        <td className='lb-enlaces-free-categoria pr' onClick={() => this.openCategorias(editable, done_by)}>
          <span className="span_edit">
            <span className={`break_sentence ${categoria ? '' : 'text_inactivo'}`} >{categoria ? categoria : 'Selecciona un categoría'}</span>
            {editable ? <i className="material-icons span_i_edit_input idit_icon icon_seleccionable">arrow_drop_down</i> : null}
            {this.state.show_categorias ?
              <PopUpLista
                cerrarClick={true}
                opcionEliminar={this.props.enlace.categoria ? true : false}
                title_eliminar='eliminar'
                selectOpcion={(id_categoria, obj) => this.seleccionarCategoria(id_categoria, obj)}
                opcion_selected={this.props.enlace.categoria}
                opciones={this.props.medios}
                title='Categorias'
                _class='rigth-popup-enlaces'
                _class_div={`max-width min-width-305 ${this.props.enlace.categoria ? 'padding-delete-pop-up' : ''}`}
                close={() => this.setState({ show_categorias: false })}
                eliminar={() => { this.eliminar('categoria') }} />
              : null}
          </span>
        </td>

        <td className='lb-enlaces-free-medio pr' onClick={() => this.openMedios(editable, done_by)}>
          <span className="span_edit">
            <a href={medio ? medio : '# '} onClick={(e) => { this.clickLink(e) }} className={`break_sentence ${medio ? '' : 'text_inactivo'}`}>{medio ? medio : 'Selecciona un medio'}</a>
            {this.props.enlace.id_medio && this.props.enlace.categoria && this.props.medios[this.props.enlace.categoria].medios[this.props.enlace.id_medio].descripcion && this.props.medios[this.props.enlace.categoria].medios[this.props.enlace.id_medio].descripcion.trim() !== '' ?
              <i onClick={(e) => this.showDescripcion(e, true)} className="material-icons span_i_edit_input idit_icon icon_seleccionable pdd-left-5 description-enlace-icon">notes</i>
              : null}

            {editable ? <i className="material-icons span_i_edit_input idit_icon icon_seleccionable">arrow_drop_down</i> : null}
            {this.state.show_medios ?
              <PopUpLista
                cerrarClick={true}
                cleanLink={true}
                opcionEliminar={this.props.enlace.id_medio ? true : false}

                title_eliminar='eliminar'
                placeholder_buscar={'Buscar medio'}
                selectOpcion={(id_medio, obj) => this.seleccionarMedio(id_medio, obj)}
                opcion_selected={this.props.enlace.id_medio}
                opciones={this.state.medios_disponibles} title='Medios disponibles'
                _class='rigth-popup-enlaces'
                _class_div={`max-width min-width-305 ${this.props.enlace.id_medio ? 'padding-delete-pop-up' : ''}`}
                _class_container='size-medios-popup scroll-bar-exterior'
                close={() => this.setState({ show_medios: false })}
                eliminar={() => { this.eliminarMedio() }}
                tag='a' buscar={true} />
              : null}
            {this.state.show_description ?
              <PopUpDescription text={this.props.medios[this.props.enlace.categoria].medios[this.props.enlace.id_medio].descripcion} close={(e) => this.showDescripcion(e, false)} />
              : null}
          </span>
        </td>

        <td className='lb-enlaces-free-anchor pr' onClick={() => this.openAnchors(editable, done_by)}>
          <span className="span_edit">
            <a href={this.props.enlace.anchor ? this.props.enlace.anchor : '# '} onClick={(e) => { this.clickLink(e) }} className={`break_sentence ${this.props.enlace.anchor ? '' : 'text_inactivo'}`} >{this.props.enlace.anchor ? this.props.enlace.anchor : 'Introduce el anchor del enlace'}</a>
            {editable ? <i className="material-icons span_i_edit_input idit_icon icon_seleccionable">arrow_drop_down</i> : null}

            {this.state.show_anchors ?
              Object.keys(this.state.anchors_disponibles).length > 0 ?
                <PopUpLista
                  cerrarClick={true}
                  cleanLink={false}
                  opcionEliminar={this.props.enlace.anchor ? true : false}
                  placeholder_new={'Introduce un anchor'}
                  title_eliminar='eliminar'
                  selectOpcion={(id_anchor, obj) => this.seleccionarAnchor(id_anchor, obj)}
                  opcion_selected={this.state.id_anchor_selected}
                  opciones={this.state.anchors_disponibles} title='Anchors'
                  _class='rigth-popup-enlaces'
                  _class_div={`max-width min-width-305 ${this.props.enlace.anchor ? 'padding-delete-pop-up' : ''}`}
                  _class_container='size-medios-popup scroll-bar-exterior'
                  _class_new={'new-item-enlaces'}
                  close={() => this.setState({ show_anchors: false })}
                  search_new={!this.props.enlace.anchor ? '' : this.state.id_anchor_selected ? '' : this.props.enlace.anchor}
                  tag='a'
                  //obligacion='link'
                  eliminar={() => { this.eliminar('anchor') }}
                  guardarNew={(txt) => { this.guardarNew('anchor', txt) }}
                  new={true}
                />
                :
                <InputPopUp
                  cerrarClick={true}
                  title={'Anchor'}
                  _class='rigth-popup-enlaces'
                  tipo='text'
                  obligacion='text'
                  valor={this.props.enlace.anchor ? this.props.enlace.anchor : ''}
                  placeholder={'Introduce el anchor'}
                  guardarValor={(text) => { this.guardarNew('anchor', text) }}
                  close={() => this.setState({ show_anchors: false })}

                />
              : null}

          </span>
        </td>

        <td className='lb-enlaces-free-enlace pr' onClick={() => this.openEnlace(editable, done_by)}>
          <span className="span_edit">
            <a href={this.props.enlace.enlace} onClick={(e) => { this.clickLink(e) }} className={`break_sentence ${this.props.enlace.enlace ? '' : 'text_inactivo'}`}>{this.props.enlace.enlace ? this.props.enlace.enlace : 'Introduce el enlace generado'}</a>
            {editable ? <i className="material-icons span_i_edit_input idit_icon icon_seleccionable">arrow_drop_down</i> : null}

            {this.state.show_enlace ?
              <InputPopUp
                cerrarClick={true}
                title={'Enlace'}
                _class='rigth-popup-enlaces'
                tipo='text'
                obligacion='link'
                valor={this.props.enlace.enlace ? this.props.enlace.enlace : ''}
                placeholder={'Enlace con http:// o https://'}
                guardarValor={(text) => { this.guardarEnlace(text) }}
                close={() => this.setState({ show_enlace: false })}

              />
              : null}

          </span>
        </td>

        <td className='lb-enlaces-free-tipo block-with-text'>
          <i className={`material-icons align-center ${this.props.enlace.tipo === 'follow' ? 'color-azul' : 'color-wrong'}`}> link </i>
        </td>

        <td onClick={() => { this.seleccionarMedio() }} className='lb-enlaces-free-more'>
          <i className="material-icons align-center">chevron_right</i>
        </td>
      </tr>

    )
  }
}

function mapStateToProps(state) { return { cliente_seleccionado: state.cliente_seleccionado, medios: state.linkbuilding.medios.tipos.free.medios, empleados: state.empleados, fecha: state.linkbuilding.enlaces.fecha, empleado: state.empleado } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo, selectMedioMediosGratuitos, setPanelMediosFreeLinkbuilding }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemEnlaceFree);

/*
Importante



*/
