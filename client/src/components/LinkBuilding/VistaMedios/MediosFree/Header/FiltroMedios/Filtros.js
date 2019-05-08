import React, {Component} from 'react'
import ListaVistas from '../../../../../Filtros/ListaVistas'
import ItemsFiltro from '../../../../../Filtros/ItemsFiltro'
import ListaFiltros from '../../../../../Filtros/ListaFiltros'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setVistaLinkBuilding, setFiltrosMediosFreeListaLinkbuilding, setFiltrosFreePaid } from '../../../../../../redux/actions';
import dotProp from 'dot-prop-immutable';
import NuevoMedio from './NuevoMedio'
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
    console.log(filtros);
    if(this.props.filtros.type!==filtros.type){
      console.log('caca');
      this.props.setFiltrosFreePaid(filtros.type)
    }else{
      this.props.setFiltrosMediosFreeListaLinkbuilding(filtros)
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

  openNew = () => {
    if(!this.props.categoria_seleccionada){
      console.log('Selecciona una categoria');
      return false;
    }
    this.setState({show_new_medios:true})
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
            <i onClick={()=>this.openNew()} className="material-icons hover-azul middle-item">add</i>

            {this.state.show_new_medios?
              <NuevoMedio close={()=>{this.setState({show_new_medios:false})}}/>:null
            }

          </div>

        </div>

      </div>
    )
  }

}

function mapStateToProps(state){return{ vistas : state.linkbuilding.vistas, filtros: state.linkbuilding.medios.tipos.free.paneles.lista.filtros, empleado:state.empleado, categoria_seleccionada: state.linkbuilding.medios.tipos.free.categoria_seleccionada,}}
function  matchDispatchToProps(dispatch){ return bindActionCreators({ setVistaLinkBuilding, setFiltrosMediosFreeListaLinkbuilding,setFiltrosFreePaid }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(Filtros);
