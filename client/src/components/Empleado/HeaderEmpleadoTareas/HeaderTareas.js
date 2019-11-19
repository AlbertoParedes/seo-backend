import React, {Component} from 'react'
import EmpleadoMenu from '../../Global/Empleado/EmpleadoMenu'
import ListaOpciones from '../../Global/ListaOpciones'
import search from '../../Global/Imagenes/search.svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPanelTracking, setSearchTableClientesTracking, setSearchByTableClientesTracking, setPopUpInfo } from '../../../redux/actions';
import InfoItems from './InfoItems'
import FiltrosClientes from './FiltroEmpleado/Filtros'
class HeaderTareas extends Component{
  constructor(props){
    super(props)
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.search !== this.props.search) { return true; }
    else if (nextProps.searchBy !== this.props.searchBy) { return true; }
    else if (nextProps.panel !== this.props.panel) { return true; }
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
              <img className='icon-search-panel' src={search} alt='' />
              <input placeholder='Buscar tareas por' value={this.props.search} onChange={(e) => this.props.setSearchTableClientesTracking(e.target.value)} />
              {this.props.search.trim() === '' ?
                <ListaOpciones style={{left: 142}} opciones={this.props.lista_search_by} opcion_selected={this.props.searchBy} changeOpcion={(id) => this.props.setSearchByTableClientesTracking(id)} /> : null
              }
            </div>
            
          </div>
          <EmpleadoMenu />
        </div>

        
        <p className='title-header'>
          <span>Empleados</span>
          {this.props.empleado ? <i className="material-icons align-center color-gris">chevron_right</i> : null}
          {this.props.empleado ? <span>{`${this.props.empleado.nombre} ${this.props.empleado.apellidos}`}</span> : null}
        </p>

        <InfoItems />
        <FiltrosClientes />
        
        <div className='barra-opciones-alumnos'>
          <div  className={`${this.props.panel === 'lista' ? 'active-option' : ''}`} >Listado</div>
          <div  className={`${this.props.panel === 'tareas' ? 'active-option' : ''}`} >Tareas</div>
        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    panel: state.panelEmpleado.panel,
    empleado: state.empleado,
    search: state.panelEmpleado.paneles.tareas.search,
    searchBy: state.panelEmpleado.paneles.tareas.searchBy,
    lista_search_by: state.panelEmpleado.paneles.tareas.lista_search_by,
  }
}
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPanelTracking }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(HeaderTareas);