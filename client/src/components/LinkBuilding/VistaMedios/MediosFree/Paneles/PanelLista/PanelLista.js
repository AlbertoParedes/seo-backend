import React, {Component} from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as functions from '../../../../../Global/functions'
import { selectCategoriaMediosGratuitos, setSortTableMediosFreeLB, setItemsLoadTableMediosFreeLB, setInfoTableMediosFreeLB } from '../../../../../../redux/actions';
import ItemMedioFree from './ItemMedioFree'

import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();


class PanelLista extends Component{

  constructor(props){
      super(props);
      this.state={

        medios:this.props.medios,
        medios_ordenados:[],

        sortBy:this.props.sortBy,
        des:this.props.des,
        search:this.props.search,
        searchBy:this.props.searchBy,

        items: this.props.items,
        filtros:this.props.filtros,

        categoria_seleccionada: this.props.categoria_seleccionada
      };
  }

  componentDidMount = () => {
    var multiPath = {}
    multiPath[`Empleados/${this.props.empleado.id_empleado}/session/subpanel`]='linkbuilding_free'
    if(Object.keys(multiPath).length>0){ db.update(multiPath) }
  }

  componentWillMount = () => { this.ordenarMedios();}

  componentWillReceiveProps = newProps => {

    if(this.state.medios!==newProps.medios ||
       this.state.sortBy!==newProps.sortBy ||
       this.state.des!==newProps.des ||
       this.state.filtros!==newProps.filtros ||
       this.state.search!==newProps.search ||
       this.state.searchBy!==newProps.searchBy ||
       this.state.categoria_seleccionada!==newProps.categoria_seleccionada
     ){

      this.setState({
        medios:newProps.medios,
        sortBy:newProps.sortBy,
        des:newProps.des,
        filtros:newProps.filtros,
        search:newProps.search,
        searchBy:newProps.searchBy,
        categoria_seleccionada:newProps.categoria_seleccionada
      }, () => { this.ordenarMedios() })

    }else if(this.state.items!==newProps.items){this.setState({items:newProps.items})}

  }

  selectCategoria = categoria => {
    this.props.selectCategoriaMediosGratuitos(categoria);
  }

  ordenarMedios = () => {
    if(this.state.categoria_seleccionada){
      var medios_ordenados = Object.entries(this.state.medios[this.state.categoria_seleccionada.id].medios)

      //tambien filtraremos por la busqueda que se desea
      if(this.state.search.trim()!==''){
        medios_ordenados = medios_ordenados.filter(item=>{
          return item[1][this.state.searchBy] && functions.limpiarString(item[1][this.state.searchBy]).includes(functions.limpiarString(this.state.search))
        })
      }

      const filtros = this.state.filtros;
      medios_ordenados = medios_ordenados.filter( (item)=>{
        item=item[1];

        if(
            ( (filtros.status.todos && filtros.status.todos.checked) || (filtros.status.items.activos.checked && item.activo && !item.eliminado) || (filtros.status.items.pausados.checked && !item.activo && !item.eliminado) || (filtros.status.items.eliminados.checked && item.eliminado)       )
          ){
          return true
        }
        return false;
      })
      console.log('this.state.sortBy',this.state.sortBy);
      medios_ordenados.sort((a, b) =>{ a=a[1]; b=b[1]
        var aKeys = false, bKeys= false;
        if(this.state.sortBy==='web'){
          aKeys=functions.cleanProtocolo(a.web);bKeys=functions.cleanProtocolo(b.web)
          if (aKeys > bKeys) { return 1; }
          if (aKeys < bKeys) { return -1; }
        }else if(this.state.sortBy==='dr' || this.state.sortBy==='ur'){
          aKeys=a[this.state.sortBy];bKeys=b[this.state.sortBy]
          if (aKeys > bKeys) { return 1; }
          if (aKeys < bKeys) { return -1; }
        }else if(this.state.sortBy==='status'){
          aKeys=a.activo?1:2;
          bKeys=b.activo?1:2
          if(a.eliminado)aKeys=3
          if(b.eliminado)bKeys=3
          if (aKeys > bKeys) { return 1; }
          if (aKeys < bKeys) { return -1; }
        }
         else{
          if (a[this.state.sortBy].toLowerCase() > b[this.state.sortBy].toLowerCase()) { return 1; }
          if (a[this.state.sortBy].toLowerCase() < b[this.state.sortBy].toLowerCase()) { return -1; }
        }
        return 0;
      });

      if(this.state.des){  medios_ordenados.reverse(); }
      this.setState({medios_ordenados},()=>{ this.changeContadorMedios(this.state.items); })
    }
  }

  changeContadorMedios = (items_loaded) => {
    if(items_loaded>this.state.medios_ordenados.length){items_loaded=this.state.medios_ordenados.length}
    this.props.setInfoTableMediosFreeLB(`${items_loaded} de ${this.state.medios_ordenados.length} medios`)
  }

  changeSort = (id) =>{
    var des = false;
    if(this.state.sortBy===id){ des = this.state.des?false:true;}
    this.props.setSortTableMediosFreeLB({sortBy:id,des})
  }


  render(){
    console.log(this.state.medios_ordenados);
    return(

      <div className='panel-medios-gratuitos pr'>


        <div className='categotias-barra'>
          {/*<div className='container-items-barra-lateral'>*/}
          <div className='container-items-barra-lateral-scroll scroll-bar-exterior'>
          {Object.entries(this.state.medios).map(([k,c])=>{
            return(
              <div key={k} data-id={k} className='container-item-lista-categoria'>
                <div className={`item-lista-categoria item-lista-categoria-free ${this.props.categoria_seleccionada && this.props.categoria_seleccionada.id===k?'active-row-table':''} `} onClick={()=>this.selectCategoria(c)}>{c.nombre}</div>
              </div>
            )
          })}
          </div>
          {/*</div>*/}
        </div>



        <div className='sub-container-panels width-second-panel'>
            <div className='categorias-panel min-panel-medios-free'>
              {this.props.categoria_seleccionada?
                  <div>
                    <table id='table-medios-free-linbuilding'>
                      <thead>
                        <tr>

                          {/*this.props.tracking_clientes_edit.activo?
                            <th className='cli-checkbox' > <span></span> </th> :null
                          */}

                          <th onClick={()=>this.changeSort('status')} className='lb-medios-free-status' >
                            <span>Status</span> {this.state.sortBy==='status'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                          </th>

                          <th onClick={()=>this.changeSort('web')} className='lb-medios-free-web' >
                            <span>Web</span> {this.state.sortBy==='web'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                          </th>

                          <th  onClick={()=>this.changeSort('dr')} className='lb-medios-free-dr'>
                            <span>DR</span> {this.state.sortBy==='dr'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                          </th>

                          <th  onClick={()=>this.changeSort('ur')} className='lb-medios-free-ur'>
                            <span>UR</span> {this.state.sortBy==='ur'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                          </th>

                          {/*
                          <th className='lb-medios-free-tematicas'>
                            <span>Temáticas</span>
                          </th>
                          */}

                          <th className='lb-medios-free-descripcion'>
                            <span>Descripcion</span>
                          </th>


                          <th className='lb-medios-free-reutilizable'>
                            <span>Reutilizable</span>
                          </th>


                          <th className='lb-medios-free-requiere'>
                            <span>Requiere</span>
                          </th>

                          <th className='lb-medios-free-clientes'>
                            <span>Clientes</span>
                          </th>


                          <th className='lb-medios-free-more'></th>

                        </tr>
                      </thead>
                      <tbody>

                      {
                         this.state.medios_ordenados.reduce((result, item, i)=>{
                          const k = item[0], medio = item[1];
                          if (i < 200 ) {
                              result.push(
                                <ItemMedioFree key={k} medio={medio}/>
                              );
                          }
                          return result;
                        }, [])

                      }
                      </tbody>
                    </table>
                  </div>
                :


                <div className='div_info_panel_linkbuilding'>
                  {!this.props.categoria_seleccionada?'Selecciona una categoría':''}
                </div>
              }



            </div>


        </div>

      </div>


    )
  }

}

function mapStateToProps(state){return{
  categoria_seleccionada: state.linkbuilding.medios.tipos.free.categoria_seleccionada,
  medios: state.linkbuilding.medios.tipos.free.medios,
  empleado:state.empleado,
  filtros:state.linkbuilding.medios.tipos.free.paneles.lista.filtros,
  search:state.linkbuilding.medios.tipos.free.paneles.lista.search,
  searchBy:state.linkbuilding.medios.tipos.free.paneles.lista.searchBy,
  sortBy:state.linkbuilding.medios.tipos.free.paneles.lista.sortBy,
  des:state.linkbuilding.medios.tipos.free.paneles.lista.des,
  items:state.linkbuilding.medios.tipos.free.paneles.lista.items_loaded
}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ selectCategoriaMediosGratuitos, setSortTableMediosFreeLB, setItemsLoadTableMediosFreeLB, setInfoTableMediosFreeLB}, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PanelLista);
