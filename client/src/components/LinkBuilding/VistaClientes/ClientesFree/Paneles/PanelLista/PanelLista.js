import React, { Component } from 'react';
import * as functions from '../../../../../Global/functions'
import CargandoData from '../../../../../Global/CargandoData'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setSortTableClientesFreeLB, setItemsLoadTableClientesFreeLB, setInfoTableClientesFreeLB } from '../../../../../../redux/actions';
import ItemCliente from './ItemCliente'
import $ from 'jquery'
import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();

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

  componentDidMount = () => {
    var multiPath = {}
    multiPath[`Empleados/${this.props.empleado.id_empleado}/session/subpanel`]='linkbuilding_free'
    if(Object.keys(multiPath).length>0){ db.update(multiPath) }
  }

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
          ( (filtros.status.todos && filtros.status.todos.checked) || (filtros.status.items.activos.checked && item.activo && item.servicios.linkbuilding.free.activo && !item.eliminado) || (filtros.status.items.pausados.checked && item.activo && !item.servicios.linkbuilding.free.activo && !item.eliminado) || (filtros.status.items.eliminados.checked && item.eliminado)       )
        ){
        return true
      }
      return false;
    })



    clientes_ordenados.sort((a, b) =>{ a=a[1]; b=b[1]
      var aKeys=false,bKeys=false
      if(this.state.sortBy==='blog'){
        aKeys=a.blog;bKeys=b.blog
        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }
      }else if(this.state.sortBy==='follows'){
        aKeys=a.follows;bKeys=b.follows
        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }
      }else if(this.state.sortBy==='nofollows'){
        aKeys=a.nofollows;bKeys=b.nofollows
        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }
      }else if(this.state.sortBy==='status'){
        aKeys=a.activo && a.servicios.linkbuilding.free.activo?1:2;
        bKeys=b.activo && b.servicios.linkbuilding.free.activo?1:2
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
    this.props.setItemsLoadTableClientesFreeLB(items_loaded)
    this.changeContadorClientes(items_loaded)
  }
  changeContadorClientes = (items_loaded) => {
    if(items_loaded>this.state.clientes_ordenados.length){items_loaded=this.state.clientes_ordenados.length}
    this.props.setInfoTableClientesFreeLB(`${items_loaded} de ${this.state.clientes_ordenados.length} clientes`)


    /*var showing = this.state.items;
    if(showing>this.state.clientes_ordenados.length)showing=this.state.clientes_ordenados.length
    this.props.setItemsClientes({showing,size:this.state.clientes_ordenados.length})
    */
  }


  changeSort = (id) =>{
    var des = false;
    if(this.state.sortBy===id){ des = this.state.des?false:true;}
    this.props.setSortTableClientesFreeLB({sortBy:id,des})
  }

  render() {
    return (
      <div id='container-clientes' className='container-table min-panel-medios-free' ref={scroller => {this.scroller = scroller}} onScroll={this.handleScroll}>
        <div id='container-clientes-linkbuilding' className={` ${!this.props.visibility?'display_none':''}`}>

          {Object.keys(this.props.clientes).length > 0 ?
            <div>

              <table id='table-clientes-linbuilding'>
                <thead>
                  <tr>

                    {/*this.props.tracking_clientes_edit.activo?
                      <th className='lb-clientes-checkbox' > <span></span> </th> :null
                    */}

                    <th onClick={()=>this.changeSort('status')} className='lb-clientes-status' >
                      <span>Status</span> {this.state.sortBy==='status'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th onClick={()=>this.changeSort('dominio')} className='lb-clientes-web' >
                      <span>Web</span> {this.state.sortBy==='dominio'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th  onClick={()=>this.changeSort('seo')} className='lb-clientes-seo'>
                      <span>Seo</span> {this.state.sortBy==='seo'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th  onClick={()=>this.changeSort('follows')} className='lb-clientes-follows'>
                      <span>Follows</span> {this.state.sortBy==='follows'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th  onClick={()=>this.changeSort('nofollows')} className='lb-clientes-nofollows'>
                      <span>Nofollows</span> {this.state.sortBy==='nofollows'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th  onClick={()=>this.changeSort('blog')} className='lb-clientes-blog'>
                      <span>Blog</span> {this.state.sortBy==='blog'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                    </th>

                    <th className='lb-clientes-more'></th>

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
  filtros:state.linkbuilding.clientes.tipos.free.paneles.lista.filtros,
  search:state.linkbuilding.clientes.tipos.free.paneles.lista.search,
  searchBy:state.linkbuilding.clientes.tipos.free.paneles.lista.searchBy,
  sortBy:state.linkbuilding.clientes.tipos.free.paneles.lista.sortBy,
  des:state.linkbuilding.clientes.tipos.free.paneles.lista.des,
  items:state.linkbuilding.clientes.tipos.free.paneles.lista.items_loaded,
  empleado:state.empleado
}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setSortTableClientesFreeLB, setItemsLoadTableClientesFreeLB, setInfoTableClientesFreeLB }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PanelLista);
