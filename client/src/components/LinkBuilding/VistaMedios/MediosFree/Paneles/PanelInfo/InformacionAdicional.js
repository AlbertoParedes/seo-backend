import React, { Component } from 'react'
import data from '../../../../../Global/Data/Data'
import SimpleInputDesplegable from '../../../../../Global/SimpleInputDesplegable'
import SimpleTextArea from '../../../../../Global/SimpleTextArea'
import UpdateStateInputs from '../../../../../Global/UpdateStateInputs'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../../../redux/actions';
import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();

class InformacionAdicional extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descripcion: this.props.descripcion,
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.props.descripcion !== nextProps.descripcion) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.tipo !== newProps.tipo) { this.setState({ tipo: newProps.tipo }) }
    if (this.props.descripcion !== newProps.descripcion) { this.setState({ descripcion: newProps.descripcion }) }
  }

  undoData = () => { this.setState(this.props) }

  saveData = () => {

    var multiPath = {};
    multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/descripcion`] = this.state.descripcion.trim();
    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })



  }

  render() {
    var edited = false;
    if (this.props.descripcion !== this.state.descripcion) {
      edited = true;
    }
    return (
      <div className='sub-container-informacion'>

        {edited ? <UpdateStateInputs saveData={() => this.saveData()} undoData={() => this.undoData()} /> : null}

        <p className='title-informacion-alumno'>2. Información adicional</p>

        {/*
        <div className='col-2-input'>
          <SimpleInput type='block' title='Reutilizable'  text={'Si'} changeValor={(status)=>this.setState({status})}/>
          <SimpleInput type='block' title='Requiere'  text={'Registo'} changeValor={(status)=>this.setState({status})}/>
        </div>

        <div className='col-2-input'>
          <SimpleInput type='block' title='Clientes' text={'4'} changeValor={(idioma)=>this.setState({idioma})}/>
          <SimpleInput type='block' title='Temáticas' text={'7'} changeValor={(idioma)=>this.setState({idioma})}/>
        </div>
        */}


        {/*descripcionS*/}
        <SimpleTextArea _class='pdd-top-10' title='Descripción' text={this.state.descripcion} changeValue={descripcion => { this.setState({ descripcion }) }} />


      </div>
    )
  }
}

function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(null, matchDispatchToProps)(InformacionAdicional);