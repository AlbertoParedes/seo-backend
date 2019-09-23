import React, { Component } from 'react'
import * as functions from '../../../Global/functions'
import DesplegableInfo from '../../../Global/DesplegableInfo'
import Switch from '../../../Global/Switch'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../redux/actions';
import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class Estrategia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchors: this.props.anchors,
      destinos: this.props.destinos,
      micronichos: this.props.micronichos,
      nuevoAnchor: '',
      nuevoDestino: ''
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {

    if (this.props.anchors !== nextProps.anchors ||
      this.props.micronichos !== nextProps.micronichos ||
      this.props.destinos !== nextProps.destinos) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.anchors !== newProps.anchors) { this.setState({ anchors: newProps.anchors }) }
    if (this.props.destinos !== newProps.destinos) { this.setState({ destinos: newProps.destinos }) }
    if (this.props.micronichos !== newProps.micronichos) { this.setState({ micronichos: newProps.micronichos }) }
  }

  undoData = () => {
    this.setState({
      anchors: this.props.anchors,
      destinos: this.props.destinos,
      micronichos: this.props.micronichos,
      nuevoAnchor: '',
      nuevoDestino: ''
    })
  }

  setNuevoAnchor = valor => {
    var anchors = JSON.parse(JSON.stringify(this.state.anchors))
    if (valor.trim() !== '') {
      anchors['new'] = { id_anchor: 'new', anchor: valor }
      this.setState({ anchors, nuevoAnchor: valor })
    } else {
      this.setState({ anchors: this.props.anchors, nuevoAnchor: valor })
    }
  }

  setNuevoDestino = valor => {
    var destinos = JSON.parse(JSON.stringify(this.state.destinos))
    if (valor.trim() !== '') {
      destinos['new'] = { id_destino: 'new', web: valor }
      this.setState({ destinos, nuevoDestino: valor })
    } else {
      this.setState({ destinos: this.props.destinos, nuevoDestino: valor })
    }
  }

  deleteItemAnchor = (id) => {
    var anchors = JSON.parse(JSON.stringify(this.state.anchors))
    if (id === 'new' && anchors['new'] && Object.keys(anchors).length - 1 === Object.keys(this.props.anchors).length) {
      this.setState({ anchors: this.props.anchors, nuevoAnchor: '' })
    } else {
      delete anchors[id];
      this.setState({ anchors: anchors })
    }
  }

  deleteItemDestino = (id) => {
    var destinos = JSON.parse(JSON.stringify(this.state.destinos))
    if (id === 'new' && destinos['new'] && Object.keys(destinos).length - 1 === Object.keys(this.props.destinos).length) {
      this.setState({ destinos: this.props.destinos, nuevoDestino: '' })
    } else {
      delete destinos[id];
      this.setState({ destinos: destinos })
    }
  }

  saveData = () => {

    var anchors = JSON.parse(JSON.stringify(this.state.anchors))
    var repetidoAnchors = Object.entries(anchors).some(([k, a]) => {
      var repe = Object.entries(anchors).some(([k2, a2]) => { return a2.anchor.trim() === a.anchor.trim() && k !== k2 })
      return repe
    })
    if (repetidoAnchors) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Existen keywords repetidas' })
      return false
    }


    var destinos = JSON.parse(JSON.stringify(this.state.destinos))
    var repetidoDestinos = Object.entries(destinos).some(([k, a]) => {
      var repe = Object.entries(destinos).some(([k2, a2]) => { return a2.web.trim() === a.web.trim() && k !== k2 })
      return repe
    })
    if (repetidoDestinos) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Existen destinos repetidos' })

      return false
    }

    var isLink = Object.entries(destinos).some(([k, a]) => { return !functions.isLink(a.web) })
    if (isLink) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Existen errores en algunos destinos' })

      return false;
    }

    var multiPath = {}
    var key = null;
    if (anchors['new']) {
      key = db.child(`Clientes/${this.props.id_cliente}/servicios/linkbuilding/paid/home/anchors`).push().key;
      anchors[key] = anchors['new'];
      anchors[key].id_anchor = key;
      anchors[key].anchor = anchors[key].anchor.trim()
      anchors['new'] = null
    }

    if (destinos['new']) {
      key = db.child(`Clientes/${this.props.id_cliente}/servicios/linkbuilding/paid/home/destinos`).push().key;
      destinos[key] = destinos['new'];
      destinos[key].id_destino = key;
      destinos[key].web = destinos[key].web.trim()
      destinos['new'] = null
    }

    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/paid/home/anchors`] = anchors;
    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/paid/home/destinos`] = destinos;
    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/paid/micronichos/activo`] = this.state.micronichos;

    {/*LOGS*/ }
    let id_log;
    var timestamp = (+new Date());
    var id_empleado = this.props.empleado.id_empleado;

    if (this.props.anchors !== this.state.anchors) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      functions.createLogs(multiPath, timestamp, Object.keys(this.props.anchors).length > 0 ? this.props.anchors : false, Object.keys(this.state.anchors).length > 0 ? this.state.anchors : false, 'anchors', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    if (this.props.destinos !== this.state.destinos) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      functions.createLogs(multiPath, timestamp, Object.keys(this.props.destinos).length > 0 ? this.props.destinos : false, Object.keys(this.state.destinos).length > 0 ? this.state.destinos : false, 'destinos', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    if (this.props.micronichos !== this.state.micronichos) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.micronichos, this.state.micronichos, 'micronichos', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    db.update(multiPath)
      .then(() => {
        this.setState({ nuevoAnchor: '', nuevoDestino: '' })
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })


  }

  callbackSwitch = (json) => {
    this.setState({ micronichos: json.valor })
  }


  render() {

    var privilegio = false
    try {
      privilegio = this.props.empleado.privilegios.linkbuilding_paid.edit.change_estrategia;
    } catch (e) { }


    var edited = false;
    if (this.props.anchors !== this.state.anchors ||
      this.props.micronichos !== this.state.micronichos ||
      this.props.destinos !== this.state.destinos) {
      edited = true;
    }
    var i = 0;
    var lista_anchors = '';
    Object.entries(this.state.anchors).forEach(([k, a]) => {
      lista_anchors = lista_anchors + a.anchor;
      if (i < Object.keys(this.state.anchors).length - 1) { lista_anchors = lista_anchors + ', '; }
      i++
    })

    i = 0
    var lista_destinos = '';
    Object.entries(this.state.destinos).forEach(([k, a]) => {
      lista_destinos = lista_destinos + a.web;
      if (i < Object.keys(this.state.destinos).length - 1) { lista_destinos = lista_destinos + ', '; }
      i++
    })

    return (
      <div className='sub-container-informacion'>

        {edited ? <UpdateStateInputs saveData={() => this.saveData()} undoData={() => this.undoData()} /> : null}

        <p className='title-informacion-alumno'>2. Estrategia</p>


        {/*follows y no follows*/}
        {/*<div className='col-2-input'>*/}
        <DesplegableInfo type={`${privilegio ? 'object-kw' : 'block'}`} lista={this.state.anchors}
          title='Anchors'
          number={Object.keys(this.state.anchors).length}
          text={lista_anchors}
          objecto={this.state.anchors}
          changeValor={(destinos) => this.setState({ destinos })}
          nuevo={this.state.nuevoAnchor}
          setNuevo={(nuevo) => this.setNuevoAnchor(nuevo)}
          deleteItem={(id) => this.deleteItemAnchor(id)}

        />

        <DesplegableInfo type={`${privilegio ? 'object-kw' : 'block'}`} lista={this.state.destinos}
          title='Destinos'
          number={Object.keys(this.state.destinos).length}
          text={lista_destinos}
          objecto={this.state.destinos}
          changeValor={(destinos) => this.setState({ destinos })}
          nuevo={this.state.nuevoDestino}
          setNuevo={(nuevo) => this.setNuevoDestino(nuevo)}
          obligacion={'isLink'}
          deleteItem={(id) => this.deleteItemDestino(id)}
        />

        {/*BLOG*/}
        <div className='display_flex container-simple-input pdd-top-40'>
          <div className="title-input align-center mg-right-10 pdd-v-0">Micronichos</div>
          <span className='options-switch'>NO</span>
          <Switch class_div='switch-table' valor={this.state.micronichos} json={{ id: 'micronichos' }} type={`${privilegio ? '' : 'block'}`} callbackSwitch={(json) => this.callbackSwitch(json)} />
          <span className='options-switch'>SI</span>
        </div>
        {/*<SimpleInput title='Destinos'  text={''} changeValue={nofollows=>{this.setState({nofollows})}} />*/}
        {/*</div>*/}


      </div>
    )
  }
}


function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(null, matchDispatchToProps)(Estrategia);