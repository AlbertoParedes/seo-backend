import React,{Component} from 'react'
import InformacionMedio from './InformacionMedio'
//import Tematicas from './Tematicas'
import InformacionAdicional from './InformacionAdicional'

import { connect } from 'react-redux';



class PanelInfo extends Component {

  constructor(props){
    super(props)
    this.state={

    }
  }

  render(){

    var status = this.props.medio_seleccionado.activo?'Activado':'Desactivado'
    status =  this.props.medio_seleccionado.eliminado?'Eliminado':status

    return(
      <div className='container-informacion'>

      <InformacionMedio

        id_medio={this.props.medio_seleccionado.id_medio}
        web={this.props.medio_seleccionado.web}
        dr={this.props.medio_seleccionado.dr || this.props.medio_seleccionado.dr===0 ?this.props.medio_seleccionado.dr.toString():''}
        ur={this.props.medio_seleccionado.ur || this.props.medio_seleccionado.ur===0 ?this.props.medio_seleccionado.ur.toString():''}
        status={status}

      />

      {/*<Tematicas

        id_medio={this.props.medio_seleccionado.id_medio}
        tematicas={this.props.medio_seleccionado.tematicas?this.props.medio_seleccionado.tematicas:false}

      />*/}

      <InformacionAdicional

        id_medio={this.props.medio_seleccionado.id_medio}
        tipo={this.props.medio_seleccionado.tipo?this.props.medio_seleccionado.tipo:'Follows'}
        descripcion={this.props.medio_seleccionado.descripcion?this.props.medio_seleccionado.descripcion:''}

      />

      </div>
    )
  }

}
function mapStateToProps(state){return{ medio_seleccionado: state.linkbuilding.medios.tipos.paid.medio_seleccionado, }}
export default connect(mapStateToProps)(PanelInfo);
