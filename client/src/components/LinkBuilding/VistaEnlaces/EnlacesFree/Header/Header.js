import React, { Component } from 'react'
import EmpleadoMenu from '../../../../Global/EmpleadoMenu'
import FiltroEnlaces from './FiltroEnlaces/Filtros'
import InfoItems from './InfoItems'
import ListaOpciones from '../../../../Global/ListaOpciones';
import search from '../../../../Global/Imagenes/search.svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPanelEnlacesFreeLinkbuilding, setSearchTableEnlacesFreeLB, setSearchByTableEnlacesFreeLB  } from '../../../../../redux/actions';
import functions from '../../../../Global/functions'

class Header extends Component{

  constructor(props){
    super(props)
    this.state={
    }
  }

  shouldComponentUpdate(nextProps, nextState) {

    if(nextProps.search !== this.props.search){ return true; }
    else if(nextProps.searchBy !== this.props.searchBy){ return true; }
    else if(nextProps.panel !== this.props.panel){ return true; }
    else if(nextProps.cliente_seleccionado !== this.props.cliente_seleccionado){ return true; }

    return false;
  }

  render(){
    return(
      <div className='container-header-panels pr'>

        {/*Barra superior con el input para buscar los clientes y el empleado*/}
        <div className='top-bar-panel'>
          <div className='container-search-panel pr'>

            {/*Input para buscar a los clientes*/}
            <div>
              <img className='icon-search-panel' src={search} alt=''/>
              <input placeholder='Buscar clientes por' value={this.props.search} onChange={(e)=>this.props.setSearchTableEnlacesFreeLB(e.target.value)} />
              {this.props.search.trim()===''?
                <ListaOpciones opciones={this.props.lista_search_by} opcion_selected={this.props.searchBy} changeOpcion={(id)=>this.props.setSearchByTableEnlacesFreeLB(id)}/>:null
              }
            </div>

          </div>
          <EmpleadoMenu />
        </div>

        <p className='title-header'>
          <span>LinkBuilding</span>
          <i className="material-icons align-center color-gris">chevron_right</i>
          <span>Enlaces gratuitos</span>
          {this.props.cliente_seleccionado?<i className="material-icons align-center color-gris">chevron_right</i>:null}
          {this.props.cliente_seleccionado?<span className='block-with-text'>{functions.cleanProtocolo(this.props.cliente_seleccionado.web)}</span>:null}
        </p>


        <InfoItems/>
        <FiltroEnlaces/>


        <div className='barra-opciones-alumnos'>
          <div className={`${this.props.panel==='lista'?'active-option':''}`} >Listado</div>
        </div>

      </div>
    )
  }

}

function mapStateToProps(state){return{
  cliente_seleccionado: state.cliente_seleccionado,
  panel: state.linkbuilding.enlaces.tipos.free.panel,
  search:state.linkbuilding.enlaces.tipos.free.paneles.lista.search,
  searchBy:state.linkbuilding.enlaces.tipos.free.paneles.lista.searchBy,
  lista_search_by:state.linkbuilding.enlaces.tipos.free.paneles.lista.lista_search_by,
}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setPanelEnlacesFreeLinkbuilding, setSearchTableEnlacesFreeLB, setSearchByTableEnlacesFreeLB }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(Header);
