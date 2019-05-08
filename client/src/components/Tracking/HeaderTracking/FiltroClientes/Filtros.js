import React, {Component} from 'react'
import ItemsFiltro from '../../../Filtros/ItemsFiltro'
import ListaFiltros from '../../../Filtros/ListaFiltros'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setFiltrosTracking } from '../../../../redux/actions';

class Filtros extends Component{

  constructor(props){
    super(props)
    this.state={
      show_filtros:false,
      show_new_medios:false
    }
  }

  render(){
    return(
      <div className='pr'>
        <ItemsFiltro filtros={this.props.filtros} updateFiltros={(filtros=>this.props.setFiltrosTracking(filtros))}/>
        <div className='opciones-alumnos'>
          <div className='deg-opt'></div>

          <div className='btn-options pr' onClick={()=>this.setState({show_filtros:this.state.show_filtros?false:true})}>

            <i className="material-icons"> filter_list </i> <span>Filtros</span>
            {this.state.show_filtros?
                <ListaFiltros filtros={this.props.filtros} updateFiltros={(filtros=>this.props.setFiltrosTracking(filtros))} close={()=>this.setState({show_filtros:false})}/>:null
            }
          </div>

        </div>

      </div>
    )
  }

}

function mapStateToProps(state){return{   filtros:state.tracking.paneles.lista.filtros }}
function  matchDispatchToProps(dispatch){ return bindActionCreators({ setFiltrosTracking }, dispatch) }

export default connect(mapStateToProps, matchDispatchToProps)(Filtros);
