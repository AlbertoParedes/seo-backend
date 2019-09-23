import React, { Component } from 'react'
import EmpleadoMenu from '../../Global/Empleado/EmpleadoMenu'
import ListaOpciones from '../../Global/ListaOpciones'
import InfoItems from './InfoItems'
import FiltrosClientes from './FiltroClientes/Filtros'
import search from '../../Global/Imagenes/search.svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPanelTracking, setSearchTableClientesTracking, setSearchByTableClientesTracking, setPopUpInfo } from '../../../redux/actions';

class HeaderTracking extends Component {

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
    else if (nextProps.keyword !== this.props.keyword) { return true; }
    return false;
  }

  changePanel = (panel) => {

    if (panel === 'info' || panel === 'keywords' || panel === 'resultados') {
      if (!this.props.cliente_seleccionado) {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Selecciona un cliente' })
        return null
      }
    }

    if (panel === 'resultados' && !this.props.keyword) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Selecciona una keyword' })
      return null
    } else if (panel === 'resultados' && this.props.keyword && !this.props.keyword.results.new.id_date) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Esta keyword no tiene resultados' })
      return null
    }

    this.props.setPanelTracking(panel)

  }

  render() {
    return (
      <div className='container-header-panels pr'>

        {/*Barra superior con el input para buscar los clientes y el empleado*/}
        <div className='top-bar-panel'>
          <div className='container-search-panel pr'>

            {/*Input para buscar a los clientes*/}
            <div>
              <img className='icon-search-panel' src={search} alt='' />
              <input placeholder='Buscar clientes por' value={this.props.search} onChange={(e) => this.props.setSearchTableClientesTracking(e.target.value)} />
              {this.props.search.trim() === '' ?
                <ListaOpciones opciones={this.props.lista_search_by} opcion_selected={this.props.searchBy} changeOpcion={(id) => this.props.setSearchByTableClientesTracking(id)} /> : null
              }
            </div>
          </div>
          <EmpleadoMenu />
        </div>

        {/**/}
        <p className='title-header'>
          <span>Tracking</span>
          {this.props.cliente_seleccionado ? <i className="material-icons align-center color-gris">chevron_right</i> : null}
          {this.props.cliente_seleccionado ? <span>{this.props.cliente_seleccionado.dominio}</span> : null}
          {this.props.keyword ? <i className="material-icons align-center color-gris">chevron_right</i> : null}
          {this.props.keyword ? <span>{this.props.keyword.keyword}</span> : null}
        </p>

        <InfoItems />
        <FiltrosClientes />

        <div className='barra-opciones-alumnos'>

          <div onClick={() => { this.changePanel('lista') }} className={`${this.props.panel === 'lista' ? 'active-option' : ''}`} >Listado</div>
          <div onClick={() => { this.changePanel('info') }} className={`${this.props.panel === 'info' ? 'active-option' : ''} ${!this.props.cliente_seleccionado ? 'disable-opciones-alumno' : ''}`} >Información</div>

          <div onClick={() => { this.changePanel('keywords') }} className={`${this.props.panel === 'keywords' ? 'active-option' : ''} ${!this.props.cliente_seleccionado ? 'disable-opciones-alumno' : ''}`} >Keywords</div>
          <div onClick={() => { this.changePanel('resultados') }} className={`${this.props.panel === 'resultados' ? 'active-option' : ''} ${!this.props.keyword || !this.props.keyword.results.new.id_date ? 'disable-opciones-alumno' : ''}`} >Resultados</div>

        </div>

      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    cliente_seleccionado: state.cliente_seleccionado,
    panel: state.tracking.panel,
    search: state.tracking.paneles.lista.search,
    searchBy: state.tracking.paneles.lista.searchBy,
    lista_search_by: state.tracking.paneles.lista.lista_search_by,
    keyword: state.tracking.keyword_tracking_selected
  }
}
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPanelTracking, setSearchTableClientesTracking, setSearchByTableClientesTracking, setPopUpInfo }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(HeaderTracking);
