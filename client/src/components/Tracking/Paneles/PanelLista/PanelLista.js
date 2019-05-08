import React, { Component } from 'react';
import CargandoData from '../../../Global/CargandoData'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setItemsTracking, setClienteSeleccionado, setPanelTracking } from '../../../../redux/actions';
import functions from '../../../Global/functions'
import $ from 'jquery'
import ItemCliente from './ItemCliente'
const ITEMS = 50;
class PanelLista extends Component {

  constructor(props){
      super(props);
      this.state={
        items:ITEMS, sortBy:'dominio', des:false,
        searchBy:this.props.searchBy,
        search:this.props.search,
        clientes_ordenados:[],
        filtros:this.props.filtros,
        clientes:this.props.clientes,
      };
  }

  componentWillMount = () => { this.ordenarClientes();}
  componentDidMount = () => { this.scrollToCliente();}
  componentWillReceiveProps = newProps => {
    if(this.state.filtros!==newProps.filtros){ this.setState({filtros:newProps.filtros}, () => { this.ordenarClientes() }) }
    if(this.props.visibility!==newProps.visibility && newProps.visibility){this.scrollToCliente()}
    if(this.state.clientes!==newProps.clientes){ this.setState({clientes:newProps.clientes}, () => { this.ordenarClientes() }) }
    if(this.state.search!==newProps.search || this.props.searchBy!==newProps.searchBy){
      this.setState({search:newProps.search, searchBy:newProps.searchBy, items: ITEMS},()=>this.ordenarClientes())
    }
  }

  ordenarClientes = () => {
    console.log('oredenar clientes');

    var clientes_ordenados = Object.entries(this.state.clientes)

    if(this.state.search.trim()!==''){
      clientes_ordenados = clientes_ordenados.filter(item=>{return item[1][this.state.searchBy] && functions.limpiarString(item[1][this.state.searchBy]).includes(functions.limpiarString(this.state.search)) })
    }

    //filtramos por los filtros seleccionados
    const filtros = this.state.filtros;
    clientes_ordenados = clientes_ordenados.filter( (item)=>{
        item=item[1];
        var empleado = false;
        try {
          if(item.empleados && item.empleados.tracking){ empleado = Object.entries(item.empleados.tracking).some(([k,e])=>{return filtros.empleados.items[k].checked})}
        } catch (e) {}

        if(
            ( (filtros.empleados.todos && filtros.empleados.todos.checked) || empleado ) &&
            ( (filtros.status.todos && filtros.status.todos.checked) || (filtros.status.items.activos.checked && item.activo && item.servicios.tracking.activo && !item.eliminado) || (filtros.status.items.pausados.checked && item.activo && !item.servicios.tracking.activo && !item.eliminado) || (filtros.status.items.eliminados.checked && item.eliminado)       )

          ){
          return true
        }
        return false;
      })


    clientes_ordenados.sort((a, b) =>{ a=a[1]; b=b[1]
      if(this.state.sortBy==='keywords'){

        var aKeys=a.servicios.tracking.keywords?Object.keys(a.servicios.tracking.keywords).length: 0;
        var bKeys=b.servicios.tracking.keywords?Object.keys(b.servicios.tracking.keywords).length: 0;

        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }

      }else if(this.state.sortBy==='activo'){

        var aKeys=a.servicios.tracking.activo
        var bKeys=b.servicios.tracking.activo

        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }

      }else if(this.state.sortBy==='status'){
        var aKeys=a.activo && a.servicios.tracking.activo?1:2,
        bKeys=b.activo && b.servicios.tracking.activo?1:2
        if(a.eliminado)aKeys=3
        if(b.eliminado)bKeys=3
        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }
      }
      else if(this.state.sortBy==='empleado'){

        var aKeys='~';
        var bKeys='~'
        if(a.empleados && a.empleados.tracking ){
          aKeys=this.getStringEmpleados(a.empleados.tracking)
        }

        if(b.empleados && b.empleados.tracking ){
          bKeys=this.getStringEmpleados(b.empleados.tracking)
        }

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
    console.log(clientes_ordenados.length);
    this.setState({clientes_ordenados},()=>{
      this.changeContadorClientes();
    })

  }
  getStringEmpleados = (array_empleados) => {
    var empleados = '-';
    var empleados_ordenados = Object.entries(array_empleados)

    if(empleados_ordenados.length>1){
      empleados_ordenados.sort((a, b) =>{ a=a[1]; b=b[1]
        if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) { return 1; }
        if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) { return -1; }
        return 0;
      });
    }

    empleados_ordenados.forEach((e,k)=>{
      if(k===empleados_ordenados.length-1){
        empleados = empleados+''+e[1].nombre;
      }else{
        empleados = empleados+''+e[1].nombre;
      }
    })
    empleados = empleados.replace('-,','')
    empleados = empleados.replace('- y ','')

  return empleados
}

  scrollToCliente = () => {
    setTimeout(function(){
      try {
        $('#container-clientes').animate({scrollTop:  $("#container-clientes").scrollTop() - $("#container-clientes").offset().top + $("#container-clientes").find(`.active-row-table`).offset().top - 100}, 0);
      } catch (e) { }
    }, 0);
  }
  handleScroll = () =>{
    if(this.scroller && this.props.visibility){
      const limite = 250;
      var scrollHeight = this.scroller.scrollHeight;
      var outerHeight = $(this.scroller).outerHeight()
      var refreshPosition = scrollHeight-outerHeight - limite;

      try {
        if(this.scroller.scrollTop>=refreshPosition){
          this.loadMore(ITEMS)
        }else if(this.scroller.scrollTop===0){
          //this.setState({items:ITEMS})
        }
      } catch (e) { }
    }
  }
  loadMore = (valor) =>{ this.setState({items:this.state.items+valor}, ()=>this.changeContadorClientes()) }
  changeContadorClientes = () => {
    var clientes_eliminados = 0,
        clientes_parados=0,
        clientes_disponibles=0;

    this.state.clientes_ordenados.forEach(item=>{
      var cliente = item[1];
      if(cliente.eliminado){
        clientes_eliminados++;
      }else if(!cliente.activo || !cliente.servicios.tracking.activo){
        clientes_parados++
      }else{
        clientes_disponibles++
      }
    })

    this.props.setItemsTracking({
      clientes:{clientes_disponibles},
      clientes_eliminados,clientes_parados
    })
  }

  changeSort = (id) =>{
    var des = false;
    if(this.state.sortBy===id){ des = this.state.des?false:true;}
    this.setState({sortBy:id,des}, ()=>this.ordenarClientes())
  }
  render() {
    return (

      <div id='container-clientes' className='container-table min-panel-enlaces-free' ref={scroller => {this.scroller = scroller}} onScroll={this.handleScroll}>
        <div className={`${!this.props.visibility?'display_none':''}`} >

          {Object.keys(this.props.clientes).length > 0 ?
            <div>
              <table id='table-clientes-tracking'>
                <thead>
                  <tr>

                    <th onClick={()=>this.changeSort('status')} className='cli-status' >
                      <span>Status</span>
                      {this.state.sortBy==='status'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th onClick={()=>this.changeSort('dominio')} className='cli-web' >
                      <span>Web</span>
                      {this.state.sortBy==='dominio'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th  onClick={()=>this.changeSort('empleado')} className='cli-empleados pr'>
                      <span>Empleados</span>
                      {this.state.sortBy==='empleado'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th  onClick={()=>this.changeSort('keywords')} className='cli-keys'>
                      <span>Keywords</span>
                      {this.state.sortBy==='keywords'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th className='cli-more'></th>

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
            <div className={`${!this.props.visibility?'display_none':''}`} > <CargandoData /> </div>
          }

        </div>
      </div>
    )
  }
}

function mapStateToProps(state){return{

  clientes: state.clientes,
  filtros:state.tracking.paneles.lista.filtros,
  search:state.tracking.paneles.lista.search,
  searchBy:state.tracking.paneles.lista.searchBy,
  sortBy:state.tracking.paneles.lista.sortBy,
  des:state.tracking.paneles.lista.des,
  items:state.tracking.paneles.lista.items_loaded,
  empleado:state.empleado

}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setItemsTracking, setClienteSeleccionado, setPanelTracking }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PanelLista);
