import React, { Component } from 'react'
import SimpleTextArea from '../../../Global/SimpleTextArea'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import * as functions from '../../../Global/functions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../redux/actions';
import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class InformacionAdicional extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comentarios: this.props.comentarios
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {

    if (this.props.comentarios !== nextProps.comentarios) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.comentarios !== newProps.comentarios) { this.setState({ comentarios: newProps.comentarios }) }
  }

  undoData = () => { this.setState(this.props) }

  saveData = () => {

    var multiPath = {}
    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/paid/comentarios`] = this.state.comentarios.trim();

    {/*LOGS*/ }
    let id_log;
    var timestamp = (+new Date());
    var id_empleado = this.props.empleado.id_empleado;

    if (this.props.comentarios !== this.state.comentarios.trim()) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.comentarios, this.state.comentarios, 'comentarios', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    db.update(multiPath)
      .then(() => {
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
      privilegio = this.props.empleado.privilegios.linkbuilding_paid.edit.info_adicional;
    } catch (e) { }

    var edited = false;
    if (this.props.comentarios !== this.state.comentarios) {
      edited = true;
    }

    return (
      <div className='sub-container-informacion'>

        {edited ? <UpdateStateInputs saveData={() => this.saveData()} undoData={() => this.undoData()} /> : null}

        <p className='title-informacion-alumno'>3. Información adicional</p>


        {/*COMENTARIOS*/}
        <SimpleTextArea _class='pdd-top-10' title='Comentarios' type={`${privilegio ? '' : 'block'}`} text={this.state.comentarios} changeValue={comentarios => { this.setState({ comentarios }) }} />


      </div>
    )
  }
}

function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(null, matchDispatchToProps)(InformacionAdicional);