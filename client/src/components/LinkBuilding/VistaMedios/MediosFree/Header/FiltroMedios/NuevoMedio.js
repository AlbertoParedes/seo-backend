import React, { Component } from 'react'
import SimpleInput from '../../../../../Global/SimpleInput'
import * as functions from '../../../../../Global/functions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setPopUpInfo, selectMedioMediosGratuitos, setPanelMediosFreeLinkbuilding } from '../../../../../../redux/actions';
import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();

class NuevosEnlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web: ''
    }
  }

  guardarMedio = (e) => {

    var multiPath = {};

    var web_repetida = Object.entries(this.props.medios).some(([k, c]) => {
      var web_encontrada = Object.entries(c.medios).some(([k2, m]) => { return functions.getDominio(m.web) === functions.getDominio(this.state.web) && k2 !== this.props.id_medio })
      if (web_encontrada) return true
      return false
    })
    if (web_repetida) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Este medio ya existe' })
      return false;
    } else if (!functions.isLink(this.state.web)) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'La web del medio debe empezar por http:// o https:// y contener un " . "' })
      return false;
    }
    else if (this.state.web.trim() === '') {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Existen errores en los campos' })
      return false;
    }

    var key = db.child(`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria_seleccionada.id}/medios/`).push().key;
    var medio = {
      id_medio: key,
      activo: true,
      descripcion: '',
      dominio: functions.getDominio(this.state.web.trim()),
      dr: 0,
      ur: 0,
      eliminado: false,
      enlaces: {},
      tematicas: {},
      web: this.state.web.trim(),
      requiere_aprobacion: false,
      requiere_fecha: false,
      requiere_registro: false
    }
    multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria_seleccionada.id}/medios/${key}`] = medio

    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
        this.props.selectMedioMediosGratuitos(medio)
        this.props.setPanelMediosFreeLinkbuilding('info')
        e.stopPropagation(); this.props.close();
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })


  }


  render() {

    var web_repetida = Object.entries(this.props.medios).some(([k, c]) => {
      var web_encontrada = Object.entries(c.medios).some(([k2, m]) => { return functions.getDominio(m.web) === functions.getDominio(this.state.web) && k2 !== this.props.id_medio })
      if (web_encontrada) return true
      return false
    })

    var isLink = functions.isLink(this.state.web)
    return (
      <div className='container-opt-search nuevos-enlaces-paid-medios'>
        <div className='opciones-search-popup opciones-search-show-popup pop-up-enlaces-nuevos pop-up-medios-paid-nuevos'>
          <div className='size-medios-popup scroll-bar-exterior'>

            <div className="title-pop-up title-center-pop-up">Medio nuevo</div>

            <SimpleInput title='Web del nuevo medio' _class_container={this.state.web.trim() === '' || web_repetida || !isLink ? 'error-form-input' : null} text={this.state.web} changeValue={web => { this.setState({ web }) }} />

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

function mapStateToProps(state) { return { categoria_seleccionada: state.linkbuilding.medios.tipos.free.categoria_seleccionada, medios: state.linkbuilding.medios.tipos.free.medios, } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo, selectMedioMediosGratuitos, setPanelMediosFreeLinkbuilding }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(NuevosEnlaces);
