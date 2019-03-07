import React, { Component } from 'react';
import search from '../../Global/Imagenes/search.svg';
import EmpleadoMenu from '../../Global/EmpleadoMenu'
import ListaOpciones from '../../Global/ListaOpciones'
import InfoItems from './InfoItems'
import InfoItemsKeywords from './InfoItemsKeywords'
import FiltrosClientes from './FiltroClientes/Filtros'
import FiltrosKeywords from './FiltroKeywords/Filtros'
import $ from 'jquery';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setPanelTracking } from '../../../redux/actions';

class HeaderTracking extends Component {


  constructor(props){
      super(props);
      this.state={
        searchOpciones:{
          'web':{valor:'web'}
        },

        searchOpcionesKeywords:{
          'keyword':{valor:'keyword'}
        },
      }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.search !== this.props.search){ return true; }
    else if(nextProps.searchBy !== this.props.searchBy){ return true; }

    if(nextProps.searchKeywords !== this.props.searchKeywords){ return true; }
    else if(nextProps.searchByKeywords !== this.props.searchByKeywords){ return true; }


    else if(nextProps.panel !== this.props.panel){ return true; }
    else if(nextProps.cliente_seleccionado !== this.props.cliente_seleccionado){ return true; }
    else if(nextProps.panel_tracking !== this.props.panel_tracking){return true}
    return false;
  }


  mensajeInformativo = (text) =>{var element = $(`#tracking-mensaje`); if(!$(element).attr('class').includes('show')){ $(element).text(text).addClass('show'); setTimeout( function(){ $(element).removeClass('show'); }, 3500 );}}

  render() {

    return(
      <div className='container-header-panels pr'>

        <div id="tracking-mensaje" className='toast'></div>

        <div className='top-bar-panel'>
          {/*BUSQUEDA DE COLEGIOS */}
          <div className='container-search-panel pr'>


            {this.props.panel_tracking==='lista'?
              <div>
                <img className='icon-search-panel' src={search} alt=''/>
                <input placeholder='Buscar clientes por' value={this.props.search} onChange={(e)=>this.props.changeSearch(e.target.value)} />
                {this.props.search.trim()===''?
                  <ListaOpciones opciones={this.state.searchOpciones} opcion_selected={this.props.searchBy} changeOpcion={(id)=>this.props.changeSearchBy(id)}/>
                :null}
              </div>
            :null}

            {this.props.panel_tracking==='keywords' || this.props.panel_tracking==='keyword'?
              <div>
                <img className='icon-search-panel' src={search} alt=''/>
                <input placeholder='Buscar keyword por' value={this.props.searchKeywords} onChange={(e)=>this.props.changeSearchKeywords(e.target.value)} />
                {this.props.searchKeywords.trim()===''?
                  <ListaOpciones opciones={this.state.searchOpcionesKeywords} opcion_selected={this.props.searchByKeywords} changeOpcion={(id)=>this.props.changeSearchByKeywords(id)}/>
                :null}
              </div>
            :null}





          </div>
          <EmpleadoMenu />
        </div>

        <p className='title-header'>
          <span>Clientes</span>
          {this.props.cliente_seleccionado? <i className="material-icons align-center color-gris">chevron_right</i> :null}
          {this.props.cliente_seleccionado? <span>{this.props.cliente_seleccionado.dominio}</span> :null}

          {this.props.keyword? <i className="material-icons align-center color-gris">chevron_right</i> :null}
          {this.props.keyword? <span>{this.props.keyword.keyword}</span> :null}
        </p>

        {this.props.panel_tracking==='lista'?<InfoItems/>:null}
        {this.props.panel_tracking==='keywords' || this.props.panel_tracking==='keyword'?<InfoItemsKeywords/>:null}


        {this.props.panel_tracking==='lista'?<FiltrosClientes/>:null}
        {this.props.panel_tracking==='keywords' || this.props.panel_tracking==='keyword'?<FiltrosKeywords/>:null}


        <div className='barra-opciones-alumnos'>
          <div onClick={()=>{this.props.setPanelTracking('lista')}} className={`${this.props.panel_tracking==='lista'?'active-option':''}`} >Listado</div>
          <div
            onClick={
              this.props.cliente_seleccionado?
                ()=>{this.props.setPanelTracking('keywords')}
              :
                ()=>this.mensajeInformativo('Selecciona un cliente')
            }
            className={`${this.props.panel_tracking==='keywords'?'active-option':''} ${!this.props.cliente_seleccionado?'disable-opciones-alumno':''}`} >Keywords</div>

          <div
            onClick={
              this.props.keyword ?
                ()=>{this.props.setPanelTracking('keyword')}
              :
                ()=>this.mensajeInformativo('Selecciona una keyword')}
                className={`${this.props.panel_tracking==='keyword'?'active-option':''} ${!this.props.keyword?'disable-opciones-alumno':''}`} >Resultados</div>

        </div>

      </div>
    )
  }

}

function mapStateToProps(state){return{ cliente_seleccionado: state.cliente_seleccionado,keyword: state.keyword_tracking_selected, panel_tracking:state.panel_tracking, items_clientes:state.items_clientes }}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setPanelTracking }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(HeaderTracking);
