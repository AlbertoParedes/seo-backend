import React, { Component } from 'react'
import EmpleadoMenu from '../../../../Global/EmpleadoMenu'
import FiltroEnlaces from './FiltroEnlaces/Filtros'
import InfoItems from './InfoItems'
import search from '../../../../Global/Imagenes/search.svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPanelMediosPaidLinkbuilding } from '../../../../../redux/actions';
import functions from '../../../../Global/functions'

class Header extends Component{

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

    return false;
  }

  render(){
    return(
      <div className='container-header-panels pr'>

        {/*Div para mensajes sobre los clientes*/}
        <div id="lb-clientes-mensaje" className='toast'></div>

        {/*Barra superior con el input para buscar los clientes y el empleado*/}
        <div className='top-bar-panel'>
          <div className='container-search-panel pr'>

            {/*Input para buscar a los clientes*/}
            <div>
              <img className='icon-search-panel' src={search} alt=''/>
              <input placeholder='Buscar clientes por' value={this.props.search} onChange={(e)=>this.props.changeSearch(e.target.value)} />
              {/*this.props.search.trim()===''?
                <ListaOpciones opciones={this.state.searchOpciones} opcion_selected={this.props.searchBy} changeOpcion={(id)=>this.props.changeSearchBy(id)}/>:null
              */}
            </div>

          </div>
          <EmpleadoMenu />
        </div>

        <p className='title-header'>
          <span>LinkBuilding</span>
          <i className="material-icons align-center color-gris">chevron_right</i>
          <span>Enlaces de pago</span>
          {this.props.cliente_seleccionado?<i className="material-icons align-center color-gris">chevron_right</i>:null}
          {this.props.cliente_seleccionado?<span>{functions.cleanProtocolo(this.props.cliente_seleccionado.web)}</span>:null}
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

function mapStateToProps(state){return{ cliente_seleccionado: state.cliente_seleccionado, panel:state.linkbuilding.enlaces.tipos.paid.panel}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setPanelMediosPaidLinkbuilding }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(Header);
