import React, { Component } from 'react'
import SimpleInput from '../../../../../Global/SimpleInput'
import UpdateStateInputs from '../../../../../Global/UpdateStateInputs'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {getProcentajeDfDomain, getRatioDomain, getRatioInternas} from '../../../../../Global/functions'
import { setPopUpInfo } from '../../../../../../redux/actions';
import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();

class Metricas extends Component {
  constructor(props) {
    super(props);
    this.state = {

      dr: this.props.dr,
      ur: this.props.ur,

      rdDomain: this.props.rdDomain,
      rdDomainDF: this.props.rdDomainDF,
      rdInternas: this.props.rdInternas,
      ldDomain: this.props.ldDomain,
      ldInternas: this.props.ldInternas,
      trafico: this.props.trafico,

    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (
        this.props.dr !== nextProps.dr ||
        this.props.ur !== nextProps.ur ||
        this.props.rdDomain !== nextProps.rdDomain ||
        this.props.rdDomainDF !== nextProps.rdDomainDF ||
        this.props.rdInternas !== nextProps.rdInternas ||
        this.props.ldDomain !== nextProps.ldDomain ||
        this.props.ldInternas !== nextProps.ldInternas ||
        this.props.trafico !== nextProps.trafico
      ) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.dr !== newProps.dr) { this.setState({ dr: newProps.dr }) }
    if (this.props.ur !== newProps.ur) { this.setState({ ur: newProps.ur }) }
    if (this.props.rdDomain !== newProps.rdDomain) { this.setState({ rdDomain: newProps.rdDomain }) }
    if (this.props.rdDomainDF !== newProps.rdDomainDF) { this.setState({ rdDomainDF: newProps.rdDomainDF }) }
    if (this.props.rdInternas !== newProps.rdInternas) { this.setState({ rdInternas: newProps.rdInternas }) }
    if (this.props.ldDomain !== newProps.ldDomain) { this.setState({ ldDomain: newProps.ldDomain }) }
    if (this.props.ldInternas !== newProps.ldInternas) { this.setState({ ldInternas: newProps.ldInternas }) }
    if (this.props.trafico !== newProps.trafico) { this.setState({ trafico: newProps.trafico }) }
  }

  undoData = () => { this.setState(this.props) }

  saveData = () => {

    var multiPath = {};
    multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/dr`] = this.state.dr.trim() !== '' ? (+this.state.dr) : null
    multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/ur`] = this.state.ur.trim() !== '' ? (+this.state.ur) : null
    multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/rdDomain`] = this.state.rdDomain.trim() !== '' ? (+this.state.rdDomain) : null
    multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/rdDomainDF`] = this.state.rdDomainDF.trim() !== '' ? (+this.state.rdDomainDF) : null
    multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/rdInternas`] = this.state.rdInternas.trim() !== '' ? (+this.state.rdInternas) : null
    multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/ldDomain`] = this.state.ldDomain.trim() !== '' ? (+this.state.ldDomain) : null
    multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/ldInternas`] = this.state.ldInternas.trim() !== '' ? (+this.state.ldInternas) : null
    multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/trafico`] = this.state.trafico.trim() !== '' ? (+this.state.trafico) : null

    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })



  }

  getProcentajeDfDomain = () => {

  }

  render() {
    var edited = false;
    if (
      this.props.dr !== this.state.dr ||
      this.props.ur !== this.state.ur ||
      this.props.rdDomain !== this.state.rdDomain ||
      this.props.rdDomainDF !== this.state.rdDomainDF ||
      this.props.rdInternas !== this.state.rdInternas ||
      this.props.ldDomain !== this.state.ldDomain ||
      this.props.ldInternas !== this.state.ldInternas ||
      this.props.trafico !== this.state.trafico
    ) {
      edited = true;
    } 

    return (
      <div className='sub-container-informacion'>

        {edited ? <UpdateStateInputs saveData={() => this.saveData()} undoData={() => this.undoData()} /> : null}

        <p className='title-informacion-alumno'>2. Métricas</p>

        <div className='col-2-input'>
          <SimpleInput type='int' title='DR' _class_container={this.state.dr.trim() === '' ? 'error-form-input' : null} text={this.state.dr.toString()} changeValue={dr => { this.setState({ dr }) }} />
          <SimpleInput type='int' title='UR' _class_container={this.state.ur.trim() === '' ? 'error-form-input' : null} text={this.state.ur.toString()} changeValue={ur => { this.setState({ ur }) }} />
        </div>


        <div className='col-2-input'>
          <SimpleInput type='int' title='RD Domain' _class_container={this.state.rdDomain.trim() === '' ? 'error-form-input' : null} text={this.state.rdDomain.toString()} changeValue={rdDomain => { this.setState({ rdDomain }) }} />
          <SimpleInput type='int' title='RD Domain DF' _class_container={this.state.rdDomainDF.trim() === '' ? 'error-form-input' : null} text={this.state.rdDomainDF.toString()} changeValue={rdDomainDF => { this.setState({ rdDomainDF }) }} />
        </div>

        <div className='col-2-input'>
          <SimpleInput type='block' title='%DF Domain' text={getProcentajeDfDomain(this.state.rdDomain.trim(), this.state.rdDomainDF.trim())} changeValue={rdInternas => { this.setState({ rdInternas }) }} />
          <SimpleInput type='int' title='RD Internas' _class_container={this.state.rdInternas.trim() === '' ? 'error-form-input' : null} text={this.state.rdInternas.toString()} changeValue={rdInternas => { this.setState({ rdInternas }) }} />
        </div>


        <div className='col-2-input'>
          <SimpleInput type='int' title='LD Domain' _class_container={this.state.ldDomain.trim() === '' ? 'error-form-input' : null} text={this.state.ldDomain.toString()} changeValue={ldDomain => { this.setState({ ldDomain }) }} />
          <SimpleInput type='int' title='LD Internas' _class_container={this.state.ldInternas.trim() === '' ? 'error-form-input' : null} text={this.state.ldInternas.toString()} changeValue={ldInternas => { this.setState({ ldInternas }) }} />
        </div>


        <div className='col-2-input'>
          <SimpleInput type='block' title='Ratio Domain' text={getRatioDomain(this.state.rdDomain.trim(), this.state.ldDomain.trim())} />
          <SimpleInput type='block' title='Ratio Domain' text={getRatioInternas(this.state.rdInternas.trim(), this.state.ldInternas.trim())} />

        </div>

        <div className="container-simple-input div_text_mitad">
          <SimpleInput type='int' title='Tráfico' _class_container={this.state.trafico.trim() === '' ? 'error-form-input' : null} text={this.state.trafico.toString()} changeValue={trafico => { this.setState({ trafico }) }} />
        </div>

      </div>
    )
  }
}

function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(null, matchDispatchToProps)(Metricas);