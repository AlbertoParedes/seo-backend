import React, { Component } from 'react'
import SimpleInput from '../../../../../Global/SimpleInput'
import SimpleTextArea from '../../../../../Global/SimpleTextArea'
import InformacionMedio from './InformacionMedio'
import Metricas from './Metricas'
import { connect } from 'react-redux';
import InformacionAdicional from './InformacionAdicional'

class PanelInfo extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {

    var status = this.props.medio_seleccionado.activo ? 'Activado' : 'Desactivado'
    status = this.props.medio_seleccionado.eliminado ? 'Eliminado' : status

    return (
      <div className='container-informacion'>

        <InformacionMedio

          id_medio={this.props.medio_seleccionado.id_medio}
          web={this.props.medio_seleccionado.web}
          dr={this.props.medio_seleccionado.dr || this.props.medio_seleccionado.dr === 0 ? this.props.medio_seleccionado.dr.toString() : ''}
          ur={this.props.medio_seleccionado.ur || this.props.medio_seleccionado.ur === 0 ? this.props.medio_seleccionado.ur.toString() : ''}
          status={status}
          categoria={this.props.categoria_seleccionada.id}

        />

        <Metricas 
          id_medio={this.props.medio_seleccionado.id_medio}
          categoria={this.props.categoria_seleccionada.id}
          dr={this.props.medio_seleccionado.dr || this.props.medio_seleccionado.dr === 0 ? this.props.medio_seleccionado.dr.toString() : ''}
          ur={this.props.medio_seleccionado.ur || this.props.medio_seleccionado.ur === 0 ? this.props.medio_seleccionado.ur.toString() : ''}
          rdDomain={this.props.medio_seleccionado.rdDomain || this.props.medio_seleccionado.rdDomain === 0 ? this.props.medio_seleccionado.rdDomain.toString() : ''}
          rdDomainDF={this.props.medio_seleccionado.rdDomainDF || this.props.medio_seleccionado.rdDomainDF === 0 ? this.props.medio_seleccionado.rdDomainDF.toString() : ''}
          rdInternas={this.props.medio_seleccionado.rdInternas || this.props.medio_seleccionado.rdInternas === 0 ? this.props.medio_seleccionado.rdInternas.toString() : ''}
          ldDomain={this.props.medio_seleccionado.ldDomain || this.props.medio_seleccionado.ldDomain === 0 ? this.props.medio_seleccionado.ldDomain.toString() : ''}
          ldInternas={this.props.medio_seleccionado.ldInternas || this.props.medio_seleccionado.ldInternas === 0 ? this.props.medio_seleccionado.ldInternas.toString() : ''}
          trafico={this.props.medio_seleccionado.trafico || this.props.medio_seleccionado.trafico === 0 ? this.props.medio_seleccionado.trafico.toString() : ''}
        />

        <InformacionAdicional
          id_medio={this.props.medio_seleccionado.id_medio}
          descripcion={this.props.medio_seleccionado.descripcion ? this.props.medio_seleccionado.descripcion : ''}
          categoria={this.props.categoria_seleccionada.id}
        />


      </div>
    )
  }
}


function mapStateToProps(state) { return { categoria_seleccionada: state.linkbuilding.medios.tipos.free.categoria_seleccionada, medio_seleccionado: state.linkbuilding.medios.tipos.free.medio_seleccionado, } }
export default connect(mapStateToProps)(PanelInfo);