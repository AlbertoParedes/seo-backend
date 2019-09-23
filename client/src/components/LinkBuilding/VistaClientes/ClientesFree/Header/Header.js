import React, { Component } from 'react'
import EmpleadoMenu from '../../../../Global/Empleado/EmpleadoMenu'
import InfoItems from './InfoItems'
import FiltrosClientes from './FiltroClientes/Filtros'
import search from '../../../../Global/Imagenes/search.svg';
import ListaOpciones from '../../../../Global/ListaOpciones';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setPanelClientesFreeLinkbuilding, setSearchTableClientesFreeLB, setSearchByTableClientesFreeLB } from '../../../../../redux/actions';

class Header extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.search !== this.props.search) { return true; }
    else if (nextProps.searchBy !== this.props.searchBy) { return true; }
    else if (nextProps.panel !== this.props.panel) { return true; }
    else if (nextProps.cliente_seleccionado !== this.props.cliente_seleccionado) { return true; }
    return false;
  }

  setPanel = panel => {
    if (panel === 'info' && !this.props.cliente_seleccionado) {
      console.log('No se ha seleccionado ningun cliente');
    } else {
      this.props.setPanelClientesFreeLinkbuilding(panel)
    }

  }

  render() {
    return (
      <div className='container-header-panels pr'>

        {/*Div para mensajes sobre los clientes*/}
        <div id="lb-clientes-mensaje" className='toast'></div>

        {/*Barra superior con el input para buscar los clientes y el empleado*/}
        <div className='top-bar-panel'>
          <div className='container-search-panel pr'>

            {/*Input para buscar a los clientes*/}
            <div>
              <img className='icon-search-panel' src={search} alt='' />
              <input placeholder='Buscar clientes por' value={this.props.search} onChange={(e) => this.props.setSearchTableClientesFreeLB(e.target.value)} />
              {this.props.search.trim() === '' ?
                <ListaOpciones opciones={this.props.lista_search_by} opcion_selected={this.props.searchBy} changeOpcion={(id) => this.props.setSearchByTableClientesFreeLB(id)} /> : null
              }
            </div>

          </div>
          <EmpleadoMenu />
        </div>

        <p className='title-header'>
          <span>LinkBuilding</span> <i className="material-icons align-center color-gris">chevron_right</i> <span>Clientes gratuitos</span>
          {this.props.cliente_seleccionado ? <i className="material-icons align-center color-gris">chevron_right</i> : null}
          {this.props.cliente_seleccionado ? <span className='block-with-text'>{this.props.cliente_seleccionado.dominio}</span> : null}
        </p>

        <InfoItems />
        <FiltrosClientes />

        {/*TABS*/}
        <div className='barra-opciones-alumnos'>
          {/*Lista*/}
          <div onClick={() => { this.setPanel('lista') }} className={`${this.props.panel === 'lista' ? 'active-option' : ''}`} >Listado</div>
          {/*Informacion*/}
          <div
            onClick={() => { this.setPanel('info') }}
            className={`${this.props.panel === 'info' ? 'active-option' : ''} ${!this.props.cliente_seleccionado ? 'disable-opciones-alumno' : ''}`} >Información</div>
        </div>

      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    cliente_seleccionado: state.cliente_seleccionado,
    panel: state.linkbuilding.clientes.tipos.free.panel,
    search: state.linkbuilding.clientes.tipos.free.paneles.lista.search,
    searchBy: state.linkbuilding.clientes.tipos.free.paneles.lista.searchBy,
    lista_search_by: state.linkbuilding.clientes.tipos.free.paneles.lista.lista_search_by,
  }
}
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPanelClientesFreeLinkbuilding, setSearchTableClientesFreeLB, setSearchByTableClientesFreeLB }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(Header);
