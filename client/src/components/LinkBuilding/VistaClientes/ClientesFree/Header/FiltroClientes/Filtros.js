import React, {Component} from 'react'
import ListaVistas from '../../../../../Filtros/ListaVistas'
import ItemsFiltro from '../../../../../Filtros/ItemsFiltro'
import ListaFiltros from '../../../../../Filtros/ListaFiltros'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setVistaLinkBuilding, setFiltrosClientesFreeListaLinkbuilding, setFiltrosFreePaid } from '../../../../../../redux/actions';

class Filtros extends Component{

  constructor(props){
    super(props)
    this.state={
      show_filtros:false,
      show_vistas: false
    }
  }

  changeFiltros = (filtros) => {
    if(this.props.filtros.type!==filtros.type){
      this.props.setFiltrosFreePaid(filtros.type)
    }else{
      this.props.setFiltrosClientesFreeListaLinkbuilding(filtros)
    }
  }

  render(){
    return(
      <div className='pr'>
        <ItemsFiltro filtros={this.props.filtros} updateFiltros={(filtros=>this.changeFiltros(filtros))}/>
        <div className='opciones-alumnos'>
          <div className='deg-opt'></div>

          <div className='btn-options pr' onClick={()=>this.setState({show_vistas:this.state.show_vistas?false:true})}>

            <i className="material-icons"> visibility </i> <span>Vistas</span>
            {this.state.show_vistas?
                <ListaVistas vistas={this.props.vistas} updateVistas={(vistas=>this.props.setVistaLinkBuilding(vistas))} close={()=>this.setState({show_vistas:false})}/>:null
            }
          </div>

          <div className='btn-options pr' onClick={()=>this.setState({show_filtros:this.state.show_filtros?false:true})}>

            <i className="material-icons"> filter_list </i> <span>Filtros</span>
            {this.state.show_filtros?
                <ListaFiltros filtros={this.props.filtros} updateFiltros={(filtros=>this.changeFiltros(filtros))} close={()=>this.setState({show_filtros:false})}/>:null
            }
          </div>

        </div>

      </div>
    )
  }

}

function mapStateToProps(state){return{ vistas : state.linkbuilding.vistas, filtros: state.linkbuilding.clientes.tipos.free.paneles.lista.filtros  }}
function  matchDispatchToProps(dispatch){ return bindActionCreators({ setVistaLinkBuilding, setFiltrosClientesFreeListaLinkbuilding, setFiltrosFreePaid }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(Filtros);
