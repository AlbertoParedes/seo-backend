import React, { Component } from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import data from '../../../Global/Data/Data'
import * as functions from '../../../Global/functions'
import NuevoMicronicho from './NuevoMicronicho'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import firebase from '../../../../firebase/Firebase';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../redux/actions';
import dotProp from 'dot-prop-immutable';
const db = firebase.database().ref();

class Micronichos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status,
      micronichos: this.props.micronichos,
      show_new_micronicho: false
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {

    if (this.props.status !== nextProps.status ||
      this.props.micronichos !== nextProps.micronichos) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.status !== newProps.status) { this.setState({ status: newProps.status }) }
    if (this.props.micronichos !== newProps.micronichos) { this.setState({ micronichos: newProps.micronichos }) }
  }

  undoData = () => { this.setState(this.props) }

  saveData = () => {

    var multiPath = {}
    var repetido = false;
    var isLink = true;
    Object.entries(this.state.micronichos).forEach(([k, m]) => {
      if (!functions.isLink(m.web)) { isLink = false }
      var repe = Object.entries(this.state.micronichos).some(([k2, m2]) => { return (functions.getDominio(m2.web) === functions.getDominio(m.web) && k !== k2) || functions.getDominio(this.props.web_cliente) === functions.getDominio(m.web) })
      if (repe) { repetido = true }
      multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/paid/micronichos/webs/${k}/activo`] = m.activo
      multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/paid/micronichos/webs/${k}/web`] = m.web.trim()
    })

    if (repetido) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Exite micronichos repetidos' })
      return false
    } else if (!isLink) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Las webs deben contener http:// o https:// y almenos u " . "' })
      return false
    }

    {/*LOGS*/ }
    let id_log;
    var timestamp = (+new Date());
    var id_empleado = this.props.empleado.id_empleado;

    if (this.props.micronichos !== this.state.micronichos) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.micronichos, this.state.micronichos, 'micronichos', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }


    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })

  }

  changeWeb = (id, web) => {
    var micronichos = dotProp.set(this.state.micronichos, `${id}.web`, web);
    this.setState({ micronichos })
  }
  changeStatus = (id, status) => {
    var micronichos = dotProp.set(this.state.micronichos, `${id}.activo`, status);
    this.setState({ micronichos })
  }

  openNewMicronicho = (valor) => {
    this.setState({ show_new_micronicho: valor })
  }

  render() {

    var privilegio = false
    try {
      privilegio = this.props.empleado.privilegios.linkbuilding_paid.edit.empleados;
    } catch (e) { }

    var edited = false;
    if (JSON.stringify(this.props.micronichos) !== JSON.stringify(this.state.micronichos)) {
      edited = true;
    }

    return (

      <div className='sub-container-informacion'>
        {privilegio ?
          edited ? <UpdateStateInputs saveData={() => this.saveData()} undoData={() => this.undoData()} />
            :
            <div className='settings-panels'>
              <div className='div-save-icon pr' onClick={() => this.openNewMicronicho(true)}>
                <i className="material-icons">add</i>
                {this.state.show_new_micronicho ?
                  <NuevoMicronicho id_empleado={this.props.empleado.id_empleado} id_cliente={this.props.id_cliente} close={() => this.openNewMicronicho(false)} /> : null
                }

              </div>
            </div>
          : null}


        <p className='title-informacion-alumno'>4. Micronichos</p>

        {Object.keys(this.state.micronichos).length > 0 ?

          Object.entries(this.state.micronichos).map(([k, m]) => {
            return (
              <ItemMicronicho key={k} privilegio={privilegio} micronicho={m} micronichos={this.state.micronichos} id_micronicho={k} web_cliente={this.props.web_cliente} changeWeb={(web) => this.changeWeb(k, web)} changeStatus={(status) => this.changeStatus(k, status)} />
            )
          })

          :

          <div className="div_info_panel_linkbuilding">No hay micronichos</div>
        }

      </div>

    )
  }
}

function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(null, matchDispatchToProps)(Micronichos);

class ItemMicronicho extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {

    var web = this.props.micronicho.web;
    var status = this.props.micronicho.activo ? 'Activado' : 'Desactivado'

    var web_repetida = Object.entries(this.props.micronichos).some(([k, c]) => { return (functions.getDominio(c.web) === functions.getDominio(web) && k !== this.props.id_micronicho) || functions.getDominio(this.props.web_cliente) === functions.getDominio(web) })
    var isLink = functions.isLink(web)

    return (

      <div className='container-micronichos'>
        {/*URL*/}


        {/*Estado y inversion_mensual*/}
        <div className='col-2-input'>
          <SimpleInput title='Web del micronicho' type={`${this.props.privilegio ? '' : 'block'}`} _class_container={web.trim() === '' || web_repetida || !isLink ? 'error-form-input' : null} text={web} changeValue={web => { this.props.changeWeb(web) }} />
          <SimpleInputDesplegable type={`${this.props.privilegio ? '' : 'block'}`} lista={data.estados_act_des} title='Estado' text={status} changeValor={(status) => this.props.changeStatus(status === 'Activado' ? true : false)} />
        </div>

        {/*PRESUPUESTO y CANTIDAD*/}
        {/*
        <div className='col-2-input'>
          <SimpleInput title='Presupuesto'  text={'Compartido'} changeValue={presupuesto=>{this.setState({presupuesto})}} />
          <SimpleInput  title='Cantidad' text={'300 €'} changeValor={(cantidad)=>this.setState({cantidad})}/>
        </div>
        */}

        {/*KEYWORDS Y DESTINOS*/}
        {/*
        <div className='col-2-input'>
          <SimpleInput title='Keywords'  text={'4'} changeValue={keywords=>{this.setState({keywords})}} />
          <SimpleInput  title='Destinos' text={'5'} changeValor={(destinos)=>this.setState({destinos})}/>
        </div>
        */}

      </div>

    )
  }
}
