import React, { Component } from 'react';
import functions from '../../../../../Global/functions'
import CargandoData from '../../../../../Global/CargandoData'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setSortTableClientesPaidLB, setItemsLoadTableClientesPaidLB, setInfoTableClientesPaidLB } from '../../../../../../redux/actions';
import ItemCliente from './ItemCliente'
import $ from 'jquery'


const ITEMS = 50;

class PanelLista extends Component {

  constructor(props){
      super(props);
      this.state={

        clientes:this.props.clientes,
        clientes_ordenados:[],

        sortBy:this.props.sortBy,
        des:this.props.des,
        search:this.props.search,
        searchBy:this.props.searchBy,

        items: this.props.items,
        filtros:this.props.filtros,


      };
  }

  componentWillMount = () => { this.ordenarClientes();}

  componentWillReceiveProps = newProps => {

    if(this.state.clientes!==newProps.clientes ||
       this.state.sortBy!==newProps.sortBy ||
       this.state.des!==newProps.des ||
       this.state.filtros!==newProps.filtros ||
       this.state.search!==newProps.search ||
       this.state.searchBy!==newProps.searchBy
     ){

      this.setState({
        clientes:newProps.clientes,
        sortBy:newProps.sortBy,
        des:newProps.des,
        filtros:newProps.filtros,
        search:newProps.search,
        searchBy:newProps.searchBy
      }, () => { this.ordenarClientes() })

    }else if(this.state.items!==newProps.items){this.setState({items:newProps.items})}

    if(this.props.visibility!==newProps.visibility && newProps.visibility){this.scrollToCliente()}



  }


  ordenarClientes = () => {

    var clientes_ordenados = Object.entries(this.state.clientes)
    //tambien filtraremos por la busqueda que se desea

    if(this.state.search.trim()!==''){
      clientes_ordenados = clientes_ordenados.filter(item=>{
        return item[1][this.state.searchBy] && functions.limpiarString(item[1][this.state.searchBy]).includes(functions.limpiarString(this.state.search))
      })
    }


    //filtramos por los filtros seleccionados

    const filtros = this.state.filtros;
    clientes_ordenados = clientes_ordenados.filter( (item)=>{
      item=item[1];

      if(
          ( (filtros.status.todos && filtros.status.todos.checked) || (filtros.status.items.activos.checked && item.servicios.linkbuilding.paid.activo && !item.eliminado) || (filtros.status.items.pausados.checked && !item.servicios.linkbuilding.paid.activo && !item.eliminado) || (filtros.status.items.eliminados.checked && item.eliminado)       )
        ){
        return true
      }
      return false;
    })



    clientes_ordenados.sort((a, b) =>{ a=a[1]; b=b[1]
      if(this.state.sortBy==='micronichos'){
        var aKeys=a.servicios.linkbuilding.paid.micronichos.activo,bKeys=b.servicios.linkbuilding.paid.micronichos.activo
        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }
      }else if(this.state.sortBy==='inversion_mensual' || this.state.sortBy==='beneficio' || this.state.sortBy==='porcentaje_perdida' || this.state.sortBy==='bote'){
        var aKeys=a.servicios.linkbuilding.paid[this.state.sortBy],bKeys=b.servicios.linkbuilding.paid[this.state.sortBy]
        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }
      }else if(this.state.sortBy==='status'){
        var aKeys=a.servicios.linkbuilding.paid.activo?1:2,
        bKeys=b.servicios.linkbuilding.paid.activo?1:2
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

    if(this.state.des){  clientes_ordenados.reverse(); }
    this.setState({clientes_ordenados},()=>{ this.changeContadorClientes(this.state.items); })

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
    this.props.setItemsLoadTableClientesPaidLB(items_loaded)
    this.changeContadorClientes(items_loaded)
  }
  changeContadorClientes = (items_loaded) => {
    if(items_loaded>this.state.clientes_ordenados.length){items_loaded=this.state.clientes_ordenados.length}
    this.props.setInfoTableClientesPaidLB(`${items_loaded} de ${this.state.clientes_ordenados.length} clientes`)
  }

  changeSort = (id) =>{
    var des = false;
    if(this.state.sortBy===id){ des = this.state.des?false:true;}
    this.props.setSortTableClientesPaidLB({sortBy:id,des})
  }

  render() {
    return (

      <div id='container-clientes' className='container-table' ref={scroller => {this.scroller = scroller}} onScroll={this.handleScroll}>
        <div id='container-clientes-linkbuilding' className={` ${!this.props.visibility?'display_none':''}`}>

          {Object.keys(this.props.clientes).length > 0 ?
            <div>

              <table id='table-clientes-paid-linbuilding'>
                <thead>
                  <tr>

                    {/*this.props.tracking_clientes_edit.activo?
                      <th className='lb-clientes-paid-checkbox' > <span></span> </th> :null
                    */}

                    <th onClick={()=>this.changeSort('status')} className='lb-clientes-paid-status' >
                      <span>Status</span> {this.state.sortBy==='status' ? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th onClick={()=>this.changeSort('dominio')} className='lb-clientes-paid-web' >
                      <span>Web</span> {this.state.sortBy==='dominio'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th  onClick={()=>this.changeSort('inversion_mensual')} className='lb-clientes-paid-inver-mens'>
                      <span>Inversión mensual</span> {this.state.sortBy==='inversion_mensual'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th  onClick={()=>this.changeSort('beneficio')} className='lb-clientes-paid-beneficio'>
                      <span>Beneficio</span> {this.state.sortBy==='beneficio'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th  onClick={()=>this.changeSort('porcentaje_perdida')} className='lb-clientes-paid-perdida'>
                      <span>% de pérdida</span> {this.state.sortBy==='porcentaje_perdida'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th  onClick={()=>this.changeSort('bote')} className='lb-clientes-paid-bote'>
                      <span>Crédito disponible</span> {this.state.sortBy==='bote'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th  onClick={()=>this.changeSort('micronichos')} className='lb-clientes-paid-micronichos'>
                      <span>Micronichos</span> {this.state.sortBy==='micronichos'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th className='lb-clientes-paid-more'></th>

                  </tr>
                </thead>
                <tbody>

                {
                   this.state.clientes_ordenados.reduce((result, item, i)=>{
                    const k = item[0], cliente = item[1];
                    if (i < this.state.items ) {
                        result.push(
                          <ItemCliente key={k} cliente={cliente} />
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
  clientes: state.clientes,
  filtros:state.linkbuilding.clientes.tipos.paid.paneles.lista.filtros,
  search:state.linkbuilding.clientes.tipos.paid.paneles.lista.search,
  searchBy:state.linkbuilding.clientes.tipos.paid.paneles.lista.searchBy,
  sortBy:state.linkbuilding.clientes.tipos.paid.paneles.lista.sortBy,
  des:state.linkbuilding.clientes.tipos.paid.paneles.lista.des,
  items:state.linkbuilding.clientes.tipos.paid.paneles.lista.items_loaded
}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setSortTableClientesPaidLB, setItemsLoadTableClientesPaidLB, setInfoTableClientesPaidLB }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PanelLista);
