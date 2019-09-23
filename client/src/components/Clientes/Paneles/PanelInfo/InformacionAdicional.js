import React, { Component } from 'react'
import data from '../../../Global/Data/Data'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../redux/actions';
import firebase from '../../../../firebase/Firebase';
import * as functions from '../../../Global/functions'
const db = firebase.database().ref();

class InformacionAdicional extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idioma: this.props.idioma,
      blog: this.props.blog,
      comentario: this.props.comentario,
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.props.idioma !== nextProps.idioma ||
      this.props.blog !== nextProps.blog ||
      this.props.comentario !== nextProps.comentario) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.idioma !== newProps.idioma) { this.setState({ idioma: newProps.idioma }) }
    if (this.props.blog !== newProps.blog) { this.setState({ blog: newProps.blog }) }
    if (this.props.comentario !== newProps.comentario) { this.setState({ comentario: newProps.comentario }) }
  }

  undoData = () => { this.setState(this.props) }

  saveData = () => {

    var multiPath = {};

    multiPath[`Clientes/${this.props.id_cliente}/idioma`] = this.state.idioma
    multiPath[`Clientes/${this.props.id_cliente}/blog`] = this.state.blog
    multiPath[`Clientes/${this.props.id_cliente}/comentario`] = this.state.comentario


    {/*LOGS*/ }
    let id_log;
    var timestamp = (+new Date());
    var id_empleado = this.props.empleado.id_empleado;

    if (this.props.idioma !== this.state.idioma) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/info`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.idioma, this.state.idioma, 'idioma', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/info/${id_log}`)
    }

    if (this.props.blog !== this.state.blog) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/info`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.blog, this.state.blog, 'blog', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/info/${id_log}`)
    }

    if (this.props.comentario !== this.state.comentario) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/info`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.comentario, this.state.comentario, 'comentario', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/info/${id_log}`)
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
    if (json.id === 'blog') {
      this.setState({ blog: json.valor })
    }
  }

  render() {

    var privilegio = false
    try {
      privilegio = this.props.empleado.privilegios.info_cliente.edit.info_adicional;
    } catch (e) { }

    var edited = false;
    if (this.props.idioma !== this.state.idioma ||
      this.props.blog !== this.state.blog ||
      this.props.comentario !== this.state.comentario) {
      edited = true;
    }
    return (
      <div className='sub-container-informacion'>

        {edited ? <UpdateStateInputs saveData={() => this.saveData()} undoData={() => this.undoData()} /> : null}

        <p className='title-informacion-alumno'>3. Información adicional</p>

        <div className='col-2-input'>
          {/*IDIOMA*/}
          <SimpleInputDesplegable type={`${privilegio ? '' : 'block'}`} lista={data.idiomas} title='Idioma' text={this.state.idioma} changeValor={(idioma) => this.setState({ idioma })} />
          {/*BLOG*/}
          <div className='display_flex container-simple-input pdd-top-40'>
            <div className="title-input align-center mg-right-10 pdd-v-0">¿Tiene blog?</div>
            <span className='options-switch'>NO</span>
            <Switch type={`${privilegio ? '' : 'block'}`} class_div='switch-table' valor={this.state.blog} json={{ id: 'blog' }} callbackSwitch={(json) => this.callbackSwitch(json)} />
            <span className='options-switch'>SI</span>
          </div>

        </div>

        {/*COMENTARIOS*/}
        <SimpleTextArea type={`${privilegio ? '' : 'block'}`} _class='pdd-top-10' title='Comentarios' text={this.state.comentario} changeValue={comentario => { this.setState({ comentario }) }} />


      </div>
    )
  }
}


function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(null, matchDispatchToProps)(InformacionAdicional);
