import React, { Component } from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import * as functions from '../../../Global/functions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../redux/actions';
import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class NuevoMicronicho extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web: ''
    }
  }

  guardarMedio = (e) => {

    var micronichos = this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs ? this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs : {},
      web_repetida = false

    web_repetida = Object.entries(micronichos).some(([k, c]) => { return functions.getDominio(c.web) === functions.getDominio(this.state.web) })

    var multiPath = {};

    if (web_repetida) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Este micronicho ya existe' })
      return false;
    } else if (!functions.isLink(this.state.web)) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'La web del micronicho debe empezar por http:// o https:// y contener un " . "' })

      return false;
    }
    else if (this.state.web.trim() === '') {
      //this.props.mensajeInformativo('Exiten errores en los campos')
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Existen errores en los campos' })
      return false;
    }

    var key = db.child(`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/micronichos/webs`).push().key;
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/micronichos/webs/${key}`] = {
      activo: true,
      medios_usados: {},
      presupuesto_dedicado: false,
      tipo_de_presupuesto: 'grupal',
      web: this.state.web.trim()
    }

    {/*LOGS*/ }
    let id_log;
    var timestamp = (+new Date());
    var id_empleado = this.props.id_empleado;

    id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
    functions.createLogs(multiPath, timestamp, null, this.state.web.trim(), 'nuevo_micronicho', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)

    db.update(multiPath)
      .then(() => {
        e.stopPropagation(); this.props.close();
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })


  }


  render() {
    var micronichos = this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs ? this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs : {},
      web_repetida = false

    web_repetida = Object.entries(micronichos).some(([k, c]) => { return functions.getDominio(c.web) === functions.getDominio(this.state.web) || functions.getDominio(this.props.cliente_seleccionado.web) === functions.getDominio(this.state.web) })
    var isLink = functions.isLink(this.state.web)
    return (
      <div className='container-opt-search nuevos-enlaces-paid-medios'>
        <div className='opciones-search-popup opciones-search-show-popup pop-up-enlaces-nuevos pop-up-medios-paid-nuevos'>
          <div className='size-medios-popup scroll-bar-exterior'>

            <div className="title-pop-up title-center-pop-up">Micronicho nuevo</div>

            <SimpleInput title='Web del nuevo micronicho' _class_container={this.state.web.trim() === '' || web_repetida || !isLink ? 'error-form-input' : null} text={this.state.web} changeValue={web => { this.setState({ web }) }} />

            <div className='btns-finalizar-add-medios-paid'>

              <div className="btn-cancelar-confirm" onClick={(e) => { e.stopPropagation(); this.props.close(); }}>Cancelar</div>
              <div className="btn-aceptar-confirm" onClick={(e) => this.guardarMedio(e)}>Guardar</div>

            </div>


          </div>




        </div>


      </div>
    )
  }
}

function mapStateToProps(state) { return { cliente_seleccionado: state.cliente_seleccionado } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(NuevoMicronicho);
