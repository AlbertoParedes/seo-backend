import React, { Component } from 'react';
import functions from '../../../../../Global/functions'
import CargandoData from '../../../../../Global/CargandoData'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setSortTableMediosPaidLB, setItemsLoadTableMediosPaidLB, setInfoTableMediosPaidLB } from '../../../../../../redux/actions';
import ItemMedio from './ItemMedio'
import $ from 'jquery'


const ITEMS = 50;

class PanelLista extends Component {

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


      };
  }

  componentWillMount = () => { this.ordenarMedios();}

  componentWillReceiveProps = newProps => {

    if(this.state.medios!==newProps.medios ||
       this.state.sortBy!==newProps.sortBy ||
       this.state.des!==newProps.des ||
       this.state.filtros!==newProps.filtros ||
       this.state.search!==newProps.search ||
       this.state.searchBy!==newProps.searchBy
     ){

      this.setState({
        medios:newProps.medios,
        sortBy:newProps.sortBy,
        des:newProps.des,
        filtros:newProps.filtros,
        search:newProps.search,
        searchBy:newProps.searchBy
      }, () => { this.ordenarMedios() })

    }else if(this.state.items!==newProps.items){this.setState({items:newProps.items})}

    if(this.props.visibility!==newProps.visibility && newProps.visibility){this.scrollToCliente()}



  }


  ordenarMedios = () => {
    console.log(this.state.medios);
    var medios_ordenados = Object.entries(this.state.medios)
    //tambien filtraremos por la busqueda que se desea
    if(this.state.search.trim()!==''){
      medios_ordenados = medios_ordenados.filter(item=>{
        return item[1][this.state.searchBy] && functions.limpiarString(item[1][this.state.searchBy]).includes(functions.limpiarString(this.state.search))
      })
    }


    //filtramos por los filtros seleccionados

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



    medios_ordenados.sort((a, b) =>{ a=a[1]; b=b[1]
      if(this.state.sortBy==='web'){
        var aKeys=functions.cleanProtocolo(a.web),bKeys=functions.cleanProtocolo(b.web)
        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }
      }else if(this.state.sortBy==='dr' || this.state.sortBy==='ur'){
        var aKeys=a[this.state.sortBy],bKeys=b[this.state.sortBy]
        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }
      }else if(this.state.sortBy==='status'){
        var aKeys=a.activo?1:2,
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


  scrollToCliente = () => {
    setTimeout(function(){
      try {
        $('#container-clientes_tracking').animate({scrollTop:  $("#table-clientes-tracking").scrollTop() - $("#table-clientes-tracking").offset().top + $("#table-clientes-tracking").find(`.active-row-table`).offset().top - 100}, 0);
      } catch (e) { }
    }, 0);
  }
  handleScroll = () =>{
    if(this.scroller){
      const limite = 250, scrollHeight = this.scroller.scrollHeight, outerHeight = $(this.scroller).outerHeight(), refreshPosition = scrollHeight-outerHeight - limite;
      try {
        if(this.scroller.scrollTop>=refreshPosition){ this.loadMore(ITEMS)
        }else if(this.scroller.scrollTop===0){ /*this.setState({items:ITEMS})*/ }
      } catch (e) { }
    }
  }
  loadMore = (valor) =>{
    var items_loaded = this.state.items+valor;
    this.props.setItemsLoadTableMediosPaidLB(items_loaded)
    this.changeContadorMedios(items_loaded)
  }
  changeContadorMedios = (items_loaded) => {
    if(items_loaded>this.state.medios_ordenados.length){items_loaded=this.state.medios_ordenados.length}
    this.props.setInfoTableMediosPaidLB(`${items_loaded} de ${this.state.medios_ordenados.length} medios`)
  }

  changeSort = (id) =>{
    var des = false;
    if(this.state.sortBy===id){ des = this.state.des?false:true;}
    this.props.setSortTableMediosPaidLB({sortBy:id,des})
  }

  render() {
    return (

      <div id='container-clientes' className='container-table' ref={scroller => {this.scroller = scroller}} onScroll={this.handleScroll}>
        <div id='container-medios-paid-linkbuilding' className={` ${!this.props.visibility?'display_none':''}`}>

          {Object.keys(this.props.medios).length > 0 ?
            <div>

              <table id='table-medios-paid-linbuilding'>
                <thead>
                  <tr>

                    <th onClick={()=>this.changeSort('status')} className='lb-medios-paid-status' >
                      <span>Status</span> {this.state.sortBy==='status'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th onClick={()=>this.changeSort('web')} className='lb-medios-paid-web' >
                      <span>Web</span> {this.state.sortBy==='web'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th  onClick={()=>this.changeSort('dr')} className='lb-medios-paid-dr'>
                      <span>DR</span> {this.state.sortBy==='dr'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th  onClick={()=>this.changeSort('ur')} className='lb-medios-paid-ur'>
                      <span>UR</span> {this.state.sortBy==='ur'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>



                    <th className='lb-medios-paid-tematicas'>
                      <span>Temáticas</span>
                    </th>

                    <th className='lb-medios-paid-descripcion'>
                      <span>Descripcion</span>
                    </th>

                    <th className='lb-medios-paid-reutilizable'>
                      <span>Reutilizable</span>
                    </th>

                    <th  className='lb-medios-paid-enlaces'>
                      <span>Enlaces</span>
                    </th>

                    <th className='lb-medios-paid-more'></th>

                  </tr>
                </thead>
                <tbody>

                {
                   this.state.medios_ordenados.reduce((result, item, i)=>{
                    const k = item[0], medio = item[1];
                    if (i < this.state.items ) {
                        result.push(
                          <ItemMedio key={k} medio={medio} />
                        );
                    }
                    return result;
                  }, [])

                }
                </tbody>
              </table>
            </div>

          :
            <div className={`${!this.props.visibility?'display_none':''}`} >
              <CargandoData />
            </div>
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state){return{
  medios: state.linkbuilding.medios.tipos.paid.medios,

  filtros:state.linkbuilding.medios.tipos.paid.paneles.lista.filtros,
  search:state.linkbuilding.medios.tipos.paid.paneles.lista.search,
  searchBy:state.linkbuilding.medios.tipos.paid.paneles.lista.searchBy,
  sortBy:state.linkbuilding.medios.tipos.paid.paneles.lista.sortBy,
  des:state.linkbuilding.medios.tipos.paid.paneles.lista.des,
  items:state.linkbuilding.medios.tipos.paid.paneles.lista.items_loaded
}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setSortTableMediosPaidLB, setItemsLoadTableMediosPaidLB, setInfoTableMediosPaidLB }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PanelLista);
