import React, { Component } from 'react'
import EmpleadoMenu from '../../Global/EmpleadoMenu'
import ListaOpciones from '../../Global/ListaOpciones'
import InfoItems from './InfoItems'
import FiltrosClientes from './FiltroClientes/Filtros'
import search from '../../Global/Imagenes/search.svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPanelClientes } from '../../../redux/actions';

class HeaderClientes extends Component{

  constructor(props){
    super(props)
    this.state={
      searchOpciones:{
        'web':{valor:'web'},
        'nombre':{valor:'nombre'}
      },
    }
  }

  shouldComponentUpdate(nextProps, nextState) {

    if(nextProps.search !== this.props.search){ return true; }
    else if(nextProps.searchBy !== this.props.searchBy){ return true; }

    else if(nextProps.panel !== this.props.panel){ return true; }
    else if(nextProps.cliente_seleccionado !== this.props.cliente_seleccionado){ return true; }
    else if(nextProps.panel_clientes !== this.props.panel_clientes){return true}

    return false;
  }

  render(){
    return(
      <div className='container-header-panels pr'>

        {/*Div para mensajes sobre los clientes*/}
        <div id="clientes-mensaje" className='toast'></div>

        {/*Barra superior con el input para buscar los clientes y el empleado*/}
        <div className='top-bar-panel'>
          <div className='container-search-panel pr'>

            {/*Input para buscar a los clientes*/}
            <div>
              <img className='icon-search-panel' src={search} alt=''/>
              <input placeholder='Buscar clientes por' value={this.props.search} onChange={(e)=>this.props.changeSearch(e.target.value)} />
              {this.props.search.trim()===''?
                <ListaOpciones opciones={this.state.searchOpciones} opcion_selected={this.props.searchBy} changeOpcion={(id)=>this.props.changeSearchBy(id)}/>:null
              }
            </div>

          </div>
          <EmpleadoMenu />
        </div>

        {/**/}
        <p className='title-header'>
          <span>Clientes</span>
          {this.props.cliente_seleccionado? <i className="material-icons align-center color-gris">chevron_right</i> :null}
          {this.props.cliente_seleccionado? <span>{this.props.cliente_seleccionado.dominio}</span> :null}
        </p>

        <InfoItems/>
        <FiltrosClientes/>

        <div className='barra-opciones-alumnos'>
          <div onClick={()=>{this.props.setPanelClientes('lista')}} className={`${this.props.panel_clientes==='lista'?'active-option':''}`} >Listado</div>
          <div onClick={()=>{this.props.setPanelClientes('info')}} className={`${this.props.panel_clientes==='info'?'active-option':''} ${!this.props.cliente_seleccionado?'disable-opciones-alumno':''}`} >Información</div>
          <div onClick={()=>{this.props.setPanelClientes('linkbuilding_gratuito')}} className={`pr ${this.props.panel_clientes==='linkbuilding_gratuito'?'active-option':''} ${!this.props.cliente_seleccionado?'disable-opciones-alumno':''}`} >Linkbuilding <span className='subtitlte-tab-menu'>gratuito</span></div>
          <div onClick={()=>{this.props.setPanelClientes('linkbuilding_pagado')}} className={`pr ${this.props.panel_clientes==='linkbuilding_pagado'?'active-option':''} ${!this.props.cliente_seleccionado?'disable-opciones-alumno':''}`} >Linkbuilding <span className='subtitlte-tab-menu'>de pago</span></div>
          <div onClick={()=>{this.props.setPanelClientes('tracking')}} className={`${this.props.panel_clientes==='tracking'?'active-option':''} ${!this.props.cliente_seleccionado?'disable-opciones-alumno':''}`} >Tracking</div>
        </div>

      </div>
    )
  }

}

function mapStateToProps(state){return{ cliente_seleccionado: state.cliente_seleccionado, panel_clientes: state.panel_clientes }}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setPanelClientes }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(HeaderClientes);
