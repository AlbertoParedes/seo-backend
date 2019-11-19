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
      nuevoAnchor: '',
      nuevoDestino: ''
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {

    if (this.props.anchors !== nextProps.anchors ||
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
  }

  undoData = () => {
    this.setState({
      anchors: this.props.anchors,
      destinos: this.props.destinos,
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


  }

  render() {

    var privilegio = true


    var edited = false;

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


      </div>
    )
  }
}


function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(null, matchDispatchToProps)(Estrategia);