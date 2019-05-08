import React, { Component } from 'react'
import EmpleadoMenu from '../../../../Global/EmpleadoMenu'
import functions from '../../../../Global/functions'
import FiltrosMedios from './FiltroMedios/Filtros'
import InfoItems from './InfoItems'
import ListaOpciones from '../../../../Global/ListaOpciones';
import search from '../../../../Global/Imagenes/search.svg';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setPanelMediosPaidLinkbuilding, setSearchTableMediosPaidLB, setSearchByTableMediosPaidLB } from '../../../../../redux/actions';

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
    else if(nextProps.medio_seleccionado !== this.props.medio_seleccionado){ return true; }
    return false;
  }

  setPanel = panel => {
    if( (panel==='info' || panel==='enlaces' || panel==='clientes')  && !this.props.medio_seleccionado){
      console.log('No se ha seleccionado ningun cliente');
    }else{
      this.props.setPanelMediosPaidLinkbuilding(panel)
    }

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
              <input placeholder='Buscar medios por' value={this.props.search} onChange={(e)=>this.props.setSearchTableMediosPaidLB(e.target.value)} />
              {this.props.search.trim()===''?
                <ListaOpciones opciones={this.props.lista_search_by} opcion_selected={this.props.searchBy} changeOpcion={(id)=>this.props.setSearchByTableMediosPaidLB(id)}/>:null
              }
            </div>

          </div>
          <EmpleadoMenu />
        </div>

        <p className='title-header'>
          <span>LinkBuilding</span> <i className="material-icons align-center color-gris">chevron_right</i> <span>Medios de pago</span>
          {this.props.medio_seleccionado? <i className="material-icons align-center color-gris">chevron_right</i> :null}
          {this.props.medio_seleccionado? <span className='block-with-text'>{functions.cleanProtocolo(this.props.medio_seleccionado.web)}</span> :null}
        </p>

        <InfoItems/>
        <FiltrosMedios/>

        <div className='barra-opciones-alumnos'>

          <div onClick={()=>{this.setPanel('lista')}} className={`${this.props.panel==='lista'?'active-option':''}`} >Listado</div>
          <div onClick={()=>{this.setPanel('info')}} className={`${this.props.panel==='info'?'active-option':''} ${!this.props.medio_seleccionado?'disable-opciones-alumno':''}`} >Información</div>
          <div onClick={()=>{this.setPanel('enlaces')}} className={`${this.props.panel==='enlaces'?'active-option':''} ${!this.props.medio_seleccionado?'disable-opciones-alumno':''}`} >Enlaces</div>
          {/*<div onClick={()=>{this.setPanel('clientes')}} className={`${this.props.panel==='clientes'?'active-option':''} ${!this.props.medio_seleccionado?'disable-opciones-alumno':''}`} >Clientes</div>*/}

        </div>



      </div>
    )
  }

}

function mapStateToProps(state){return{
  medio_seleccionado: state.linkbuilding.medios.tipos.paid.medio_seleccionado,
  panel: state.linkbuilding.medios.tipos.paid.panel,
  search:state.linkbuilding.medios.tipos.paid.paneles.lista.search,
  searchBy:state.linkbuilding.medios.tipos.paid.paneles.lista.searchBy,
  lista_search_by:state.linkbuilding.medios.tipos.paid.paneles.lista.lista_search_by,
}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setPanelMediosPaidLinkbuilding, setSearchTableMediosPaidLB, setSearchByTableMediosPaidLB }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(Header);
