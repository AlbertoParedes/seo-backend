import React, {Component} from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setVistaLinkBuilding, setPanelClientesLinkbuilding } from '../../redux/actions';
import data from '../Global/Data/Data'

import VistaClientes from './VistaClientes/Clientes.js'
import VistaMedios from './VistaMedios/Medios.js'
import VistaEnlaces from './VistaEnlaces/Enlaces.js'

class LinkBuilding extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  componentWillMount = () => {

  }

  render(){
    if( Object.keys(this.props.vistas).length===0 ) return null
    return(
      <div>

        {this.props.vistas.items['clientes'].checked?<VistaClientes visibility={true} />:null}

        {this.props.vistas.items['medios'].checked?<VistaMedios visibility={true} />:null}

        {this.props.vistas.items['enlaces'].checked?<VistaEnlaces visibility={true} />:null}

        {/*this.props.vista_linkbuilding==='medios'?<VistaMedios />:null*/}

        {/*this.props.vista_linkbuilding==='enlaces'?<VistaEnlaces />:null*/}

      </div>
    )
  }
}


function mapStateToProps(state){return{ vistas : state.linkbuilding.vistas }}
function matchDispatchToProps(dispatch){ return bindActionCreators({setVistaLinkBuilding,setPanelClientesLinkbuilding}, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(LinkBuilding);
