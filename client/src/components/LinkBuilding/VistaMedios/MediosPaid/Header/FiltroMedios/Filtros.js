import React, {Component} from 'react'
import ListaVistas from '../../../../../Filtros/ListaVistas'
import ItemsFiltro from '../../../../../Filtros/ItemsFiltro'
import ListaFiltros from '../../../../../Filtros/ListaFiltros'
import NuevoMedio from './NuevoMedio'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setVistaLinkBuilding, setFiltrosMediosPaidListaLinkbuilding, setFiltrosFreePaid } from '../../../../../../redux/actions';
import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();
class Filtros extends Component{

  constructor(props){
    super(props)
    this.state={
      show_filtros:false,
      show_vistas: false,
      show_new_medios:false
    }
  }

  changeFiltros = (filtros) => {
    if(this.props.filtros.type!==filtros.type){
      this.props.setFiltrosFreePaid(filtros.type)
    }else{
      this.props.setFiltrosMediosPaidListaLinkbuilding(filtros)
    }
  }

  changeVista = (vistas) => {
    var multiPath = {}
    var vistaDisponible = Object.entries(vistas.items).find(([k,v])=>{return v.checked})
    if(vistaDisponible){
      multiPath[`Empleados/${this.props.empleado.id_empleado}/session/vista`]=vistaDisponible[0]
      db.update(multiPath)
    }
    this.props.setVistaLinkBuilding(vistas)
  }

  render(){
    return(
      <div className='pr'>
        <ItemsFiltro filtros={this.props.filtros} updateFiltros={(filtros=>this.changeFiltros(filtros))}/>
        <div className='opciones-alumnos'>
          <div className='deg-opt'></div>

          <div className='btn-options pr' onClick={()=>this.setState({show_filtros:this.state.show_filtros?false:true})}>

            <i className="material-icons"> filter_list </i> <span>Filtros</span>
            {this.state.show_filtros?
                <ListaFiltros filtros={this.props.filtros} updateFiltros={(filtros=>this.changeFiltros(filtros))} close={()=>this.setState({show_filtros:false})}/>:null
            }
          </div>

          <div className='btn-options pr' onClick={()=>this.setState({show_vistas:this.state.show_vistas?false:true})}>

            <i className="material-icons"> visibility </i> <span>Vistas</span>
            {this.state.show_vistas?
                <ListaVistas vistas={this.props.vistas} updateVistas={(vistas=>this.changeVista(vistas))} close={()=>this.setState({show_vistas:false})}/>:null
            }
          </div>

          {/*Items barra*/}
          <div className={`item-container-icon-top-bar pr ${this.state.show_new_medios?'color-azul':''}`} >
            <i onClick={()=>this.setState({show_new_medios:true})} className="material-icons hover-azul middle-item">add</i>

            {this.state.show_new_medios?
              <NuevoMedio close={()=>{this.setState({show_new_medios:false})}}/>:null
            }

          </div>

        </div>

      </div>
    )
  }

}
function mapStateToProps(state){return{ vistas : state.linkbuilding.vistas, filtros: state.linkbuilding.medios.tipos.paid.paneles.lista.filtros, empleado:state.empleado,  }}
function  matchDispatchToProps(dispatch){ return bindActionCreators({ setVistaLinkBuilding, setFiltrosMediosPaidListaLinkbuilding, setFiltrosFreePaid }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(Filtros);
