import React, { Component } from 'react';
import CargandoData from '../../../Global/CargandoData'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setItemsClientesLista, setClienteSeleccionado,setPanelClientes } from '../../../../redux/actions';
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
  componentWillReceiveProps = newProps => {
    if(this.state.filtros!==newProps.filtros){ this.setState({filtros:newProps.filtros}, () => { this.ordenarClientes() }) }
    if(this.props.visibility!==newProps.visibility && newProps.visibility){this.scrollToCliente()}
    if(this.state.clientes!==newProps.clientes){ this.setState({clientes:newProps.clientes}, () => { this.ordenarClientes() }) }
    if(this.state.search!==newProps.search || this.props.searchBy!==newProps.searchBy){
      this.setState({search:newProps.search, searchBy:newProps.searchBy, items: ITEMS},()=>this.ordenarClientes())
    }
  }

  ordenarClientes = () => {

    var clientes_ordenados = Object.entries(this.state.clientes)
    //tambien filtraremos por la busqueda que se desea

    if(this.state.search.trim()!==''){
      clientes_ordenados = clientes_ordenados.filter(item=>{return item[1][this.state.searchBy] && functions.limpiarString(item[1][this.state.searchBy]).includes(functions.limpiarString(this.state.search)) })
    }

    //filtramos por los filtros seleccionados
    const filtros = this.state.filtros;
    if(filtros.empleados){
      clientes_ordenados = clientes_ordenados.filter( (item)=>{
        item=item[1];
        //var empleado = false;
        //if(item.empleados && item.empleados.tracking){ empleado = Object.entries(item.empleados.tracking).some(([k,e])=>{return filtros.empleados.items[k].checked})}

        if(
            //( (filtros.empleados.todos && filtros.empleados.todos.checked) || empleado ) &&
            ( (filtros.status.todos && filtros.status.todos.checked) || (filtros.status.items.activos.checked && item.tracking.activo && !item.eliminado) || (filtros.status.items.pausados.checked && !item.tracking.activo && !item.eliminado) || (filtros.status.items.eliminados.checked && item.eliminado)       )
          ){
          return true
        }
        return false;
      })
    }



    clientes_ordenados.sort((a, b) =>{ a=a[1]; b=b[1]
      if(this.state.sortBy==='activo'){
        var aKeys=a.activo
        var bKeys=b.activo
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
    this.setState({clientes_ordenados},()=>{
      this.changeContadorClientes();
    })

  }

  scrollToCliente = () => {
    setTimeout(function(){
      try {
        $('#container-clientes').animate({scrollTop:  $("#table-clientes").scrollTop() - $("#table-clientes").offset().top + $("#table-clientes").find(`.active-row-table`).offset().top - 100}, 0);
      } catch (e) { }
    }, 0);
  }
  mensajeInformativo = (text) =>{var element = $(`#clientes-mensaje`); if(!$(element).attr('class').includes('show')){ $(element).text(text).addClass('show'); setTimeout( function(){ $(element).removeClass('show'); }, 3500 );}}
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
    var showing = this.state.items;
    if(showing>this.state.clientes_ordenados.length)showing=this.state.clientes_ordenados.length
    this.props.setItemsClientesLista({showing,size:this.state.clientes_ordenados.length})
  }
  changeSort = (id) =>{
    var des = false;
    if(this.state.sortBy===id){ des = this.state.des?false:true;}
    this.setState({sortBy:id,des}, ()=>this.ordenarClientes())
  }
  render() {
    return (

      <div id='container-clientes' className={`${!this.props.visibility?'display_none':''}`} ref={scroller => {this.scroller = scroller}} onScroll={this.handleScroll}>

        {Object.keys(this.props.clientes).length > 0 ?
          <div>
            <table id='table-clientes'>
              <thead>
                <tr>

                  {this.props.clientes_edit && this.props.clientes_edit.activo?
                    <th className='clientes-checkbox' >
                      <span></span>
                    </th>
                    :null
                  }

                  <th onClick={()=>this.changeSort('status')} className='clientes-status' >
                    <span>Status</span>
                    {this.state.sortBy==='status'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                  </th>

                  <th onClick={()=>this.changeSort('dominio')} className='clientes-web' >
                    <span>Web</span>
                    {this.state.sortBy==='dominio'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                  </th>

                  <th  onClick={()=>this.changeSort('nombre')} className='clientes-nombre'>
                    <span>Nombre</span>
                    {this.state.sortBy==='nombre'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                  </th>

                  <th  onClick={()=>this.changeSort('seo')} className='clientes-seo'>
                    <span>Seo</span>
                    {this.state.sortBy==='seo'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                  </th>

                  <th  onClick={()=>this.changeSort('activo')} className='clientes-activo'>
                    <span>Activo</span>
                    {this.state.sortBy==='activo'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                  </th>

                  <th className='clientes-more'></th>

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
    )
  }
}

function mapStateToProps(state){return{ clientes: state.clientes, filtros: state.filtros_clientes_lista, clientes_edit:state.clientes_edit}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setItemsClientesLista, setClienteSeleccionado, setPanelClientes }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PanelLista);
