import React, {Component} from 'react'
import ItemsFiltro from '../../../Filtros/ItemsFiltro'
import ListaFiltros from '../../../Filtros/ListaFiltros'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setFiltrosClientesLista } from '../../../../redux/actions';
import NuevoCliente from './NuevoCliente'

class Filtros extends Component{

  constructor(props){
    super(props)
    this.state={
      show_filtros:false,
      show_new_medios:false
    }
  }

  addNew = () =>{

    try {
      if(!this.props.empleado.privilegios.info_cliente.edit.add_clientes){
        console.log('No tienes suficientes permisos');
        return null
      }
    } catch (e) {
      console.log('No tienes suficientes permisos');
      return null
    }


    this.setState({show_new_cliente:true})
  }

  render(){
    return(
      <div className='pr'>
        <ItemsFiltro filtros={this.props.filtros_clientes_lista} updateFiltros={(filtros=>this.props.setFiltrosClientesLista(filtros))}/>
        <div className='opciones-alumnos'>
          <div className='deg-opt'></div>

          <div className='btn-options pr' onClick={()=>this.setState({show_filtros:this.state.show_filtros?false:true})}>

            <i className="material-icons"> filter_list </i> <span>Filtros</span>
            {this.state.show_filtros?
                <ListaFiltros filtros={this.props.filtros_clientes_lista} updateFiltros={(filtros=>this.props.setFiltrosClientesLista(filtros))} close={()=>this.setState({show_filtros:false})}/>:null
            }
          </div>

          {/*Items barra*/}
          <div className={`item-container-icon-top-bar pr ${this.state.show_new_cliente?'color-azul':''}`} >
            <i onClick={()=>this.addNew()} className="material-icons hover-azul middle-item">add</i>

            {this.state.show_new_cliente?
              <NuevoCliente close={()=>{this.setState({show_new_cliente:false})}}/>:null
            }

          </div>

        </div>

      </div>
    )
  }

}

function mapStateToProps(state){return{ filtros_clientes_lista : state.filtros_clientes_lista }}
function  matchDispatchToProps(dispatch){ return bindActionCreators({ setFiltrosClientesLista }, dispatch) }

export default connect(mapStateToProps, matchDispatchToProps)(Filtros);
