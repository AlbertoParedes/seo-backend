import React, { Component } from 'react'
import EmpleadoMenu from '../../../../Global/EmpleadoMenu'
import InfoItems from './InfoItems'
import FiltroMedios from './FiltroMedios/Filtros'
import search from '../../../../Global/Imagenes/search.svg';
import functions from '../../../../Global/functions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPanelMediosFreeLinkbuilding } from '../../../../../redux/actions';

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
    else if(nextProps.medio_seleccionado !== this.props.medio_seleccionado){ return true; }
    else if(nextProps.panel !== this.props.panel){ return true; }

    return false;
  }

  changePanel = (panel) =>{
    if( (panel==='info' || panel==='clientes') && !this.props.medio_seleccionado){
      console.log('Selecciona un medio primero');
    }else{
      this.props.setPanelMediosFreeLinkbuilding(panel)
    }
  }

  render(){
    console.log(this.props.medio_seleccionado);
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
          <span>Medios gratuitos</span>

          {this.props.medio_seleccionado?<i className="material-icons align-center color-gris">chevron_right</i>:null}
          {this.props.medio_seleccionado?<span>{functions.cleanProtocolo(this.props.medio_seleccionado.web)}</span>:null}
        </p>

        <InfoItems/>
        <FiltroMedios/>


        <div className='barra-opciones-alumnos'>
          <div onClick={()=>this.changePanel('lista')} className={`${this.props.panel==='lista'?'active-option':''} `} >Listado</div>
          <div onClick={()=>this.changePanel('info')} className={`${this.props.panel==='info'?'active-option':''} ${!this.props.medio_seleccionado?'disable-opciones-alumno':''}`} >Información</div>
          <div onClick={()=>this.changePanel('clientes')} className={`${this.props.panel==='clientes'?'active-option':''} ${!this.props.medio_seleccionado?'disable-opciones-alumno':''}`} >Clientes</div>

        </div>

      </div>
    )
  }

}

function mapStateToProps(state){return{ medio_seleccionado: state.linkbuilding.medios.tipos.free.medio_seleccionado, panel:state.linkbuilding.medios.tipos.free.panel}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setPanelMediosFreeLinkbuilding }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(Header);
