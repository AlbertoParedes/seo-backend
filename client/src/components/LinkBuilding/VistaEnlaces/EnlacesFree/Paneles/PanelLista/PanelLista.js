import React, {Component} from 'react'
import functions from '../../../../../Global/functions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSortTableClientesPaidLB, setItemsLoadTableClientesPaidLB, setInfoTableClientesPaidLB,setEnlacesFree, setInfoTableEnlacesFreeLB } from '../../../../../../redux/actions';
import ItemEnlaceFree from './ItemEnlaceFree'
import ItemCliente from './ItemCliente'
import $ from 'jquery'

import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();

const ITEMS = 50;

class PanelLista extends Component{

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

      cliente_seleccionado: this.props.cliente_seleccionado,
      enlaces:{},
      enlaces_ordenados:[],
      fecha:this.props.fecha
    }
  }

  componentWillMount = () => { this.ordenarClientes(); this.getEnlaces()}

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

    if(this.state.cliente_seleccionado!==newProps.cliente_seleccionado ){
      if(!this.state.cliente_seleccionado){
        this.setState({cliente_seleccionado:newProps.cliente_seleccionado },()=>this.getEnlaces())
      }else{
        if(this.props.cliente_seleccionado.id_cliente!==newProps.cliente_seleccionado.id_cliente){
          this.setState({cliente_seleccionado:newProps.cliente_seleccionado },()=>this.getEnlaces())
        }
      }
    }else if(newProps.cliente_seleccionado && this.state.fecha!==newProps.fecha){
      this.setState({cliente_seleccionado:newProps.cliente_seleccionado, fecha:newProps.fecha },()=>this.getEnlaces())
    }
  }

  getEnlaces = () => {
    if(this.state.cliente_seleccionado){
      db.child(`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.state.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces`).on("value", snapshot =>{
        var enlaces = {}, multiPath={};
        snapshot.forEach( data => {
          enlaces[data.key]=data.val();
          //multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${data.key}/activo`]=true
          //multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${data.key}/eliminado`]=false
        });
        //console.log(multiPath);
        //db.update(multiPath)
        console.log(enlaces);
        this.props.setEnlacesFree(enlaces);
        this.setState({enlaces}, ()=>{
          this.ordernarEnlaces();
        });
      })
    }
  }

  ordernarEnlaces = () => {
    var enlaces_ordenados = Object.entries(this.state.enlaces)
    this.setState({enlaces_ordenados})
  }

  ordenarClientes = () => {

    var clientes_ordenados = Object.entries(this.state.clientes)

    if(this.state.search.trim()!==''){
      clientes_ordenados = clientes_ordenados.filter(item=>{
        return item[1][this.state.searchBy] && functions.limpiarString(item[1][this.state.searchBy]).includes(functions.limpiarString(this.state.search))
      })
    }


    //filtramos por los filtros seleccionados

    const filtros = this.state.filtros;
    clientes_ordenados = clientes_ordenados.filter( (item)=>{
      item=item[1];
      var empleado = false;
      try {
        if(item.empleados && item.servicios.linkbuilding.free.home.mensualidades[this.props.fecha].empleados){ empleado = Object.entries(item.servicios.linkbuilding.free.home.mensualidades[this.props.fecha].empleados).some(([k,e])=>{return filtros.empleados.items[k].checked})}
      } catch (e) { }

      if(
          ( (filtros.empleados.todos && filtros.empleados.todos.checked) || empleado ) &&
          ( (filtros.status.todos && filtros.status.todos.checked) || (filtros.status.items.activos.checked && item.servicios.linkbuilding.free.activo && !item.eliminado) || (filtros.status.items.pausados.checked && !item.servicios.linkbuilding.free.activo && !item.eliminado) || (filtros.status.items.eliminados.checked && item.eliminado)       ) &&
          ( (filtros.tipo_cliente.todos && filtros.tipo_cliente.todos.checked) || (item.tipo!=='pause' && filtros.tipo_cliente.items[item.tipo].checked   )     )

        ){
        return true
      }
      return false;
    })

    clientes_ordenados.sort((a, b) =>{ a=a[1]; b=b[1]
        if (a['dominio'].toLowerCase() > b['dominio'].toLowerCase()) { return 1; }
        if (a['dominio'].toLowerCase() < b['dominio'].toLowerCase()) { return -1; }
      return 0;
    });

    if(this.state.des){  clientes_ordenados.reverse(); }
    this.setState({clientes_ordenados},()=>{ this.changeContadorClientes(); })

  }

  scrollToCliente = () => {
    setTimeout(function(){
      try {
        $('#container-clientes_tracking').animate({scrollTop:  $("#table-clientes-tracking").scrollTop() - $("#table-clientes-tracking").offset().top + $("#table-clientes-tracking").find(`.active-row-table`).offset().top - 100}, 0);
      } catch (e) { }
    }, 0);
  }

  changeContadorClientes = () => {
    var clientes_eliminados = 0,
        clientes_parados=0,
        clientes_disponibles=0,
        clientes_finalizados=0,
        follows_total=0,follows_total_done=0,
        nofollows_total=0, nofollows_total_done=0
        ;

    this.state.clientes_ordenados.forEach(item=>{
      var cliente = item[1];
      if(cliente.eliminado){
        clientes_eliminados++;
      }else if(!cliente.activo || !cliente.servicios.linkbuilding.free.activo){
        clientes_parados++
      }else{

        var mes = cliente.servicios.linkbuilding.free.home.mensualidades[this.props.fecha]?cliente.servicios.linkbuilding.free.home.mensualidades[this.props.fecha]:false
        var follows = mes?mes.follows:0
        var nofollows = mes?mes.nofollows:0


        //suma todos los enlaces que se han terminado de todos los empleados asignado
        var follows_done_all = 0,
            nofollows_done_all = 0

            //suma los follows y los no follows de los clientes seleccionados solamente
        var follows_empleados = 0,
            nofollows_empleados = 0,
            //contabilizamos los enlaces terminados de los clientes seleccionados
            follows_done_empleados = 0,
            nofollows_done_empleados = 0

        //si existen empleados asignados a este cliente sumaremos sus follows y sus follows que se han terminado
        if(mes && mes.empleados){

          var empleados_filtro = this.props.filtros.empleados.items
          Object.entries(mes.empleados).forEach(([k,c])=>{
            //enlaces totales hechos sin tener encuenta a los empleados
            if(c.enlaces_follows){ follows_done_all = follows_done_all + Object.entries(c.enlaces_follows).filter(([k2,e])=>{return e===true}).length }
            if(c.enlaces_nofollows){ nofollows_done_all = nofollows_done_all + Object.entries(c.enlaces_nofollows).filter(([k2,e])=>{return e===true}).length }
            //De cada empleado sumaremos sus follows y no follows al total junto con los que se han completado
            if(empleados_filtro[k] && empleados_filtro[k].checked){
              follows_empleados = follows_empleados + ( c.follows?c.follows:0 );//si no existe follows ni nofollows en el mes de ese cliente es por que ese empleado ha hecho un enlace que no estba obligado a hacer.
              nofollows_empleados = nofollows_empleados + ( c.nofollows?c.nofollows:0 );
              try {
                follows_done_empleados = follows_done_empleados + Object.entries(c.enlaces_follows).filter(([k2,e])=>{return e===true}).length
              } catch (e) {}

              try {
                nofollows_done_empleados = nofollows_done_empleados + Object.entries(c.enlaces_nofollows).filter(([k2,e])=>{return e===true}).length
              } catch (e) {}
            }
          })

          if(this.props.filtros.empleados.todos.checked){
            follows_empleados=follows;
            follows_done_empleados=follows_done_all

            //sumamos al contador global todos los follows todos los cliente
            follows_total = follows_total + follows
            nofollows_total = nofollows_total + nofollows

            follows_total_done = follows_total_done + follows_done_all
            nofollows_total_done = nofollows_total_done + nofollows_done_all

            if(follows_done_all===follows){
              clientes_finalizados++
            }

          }else{
            //sumamos al contador global todos los follows de cada cliente ese mes
            follows_total = follows_total + follows_empleados
            nofollows_total = nofollows_total + nofollows_empleados

            follows_total_done = follows_total_done + follows_done_empleados
            nofollows_total_done = nofollows_total_done + nofollows_done_empleados

            if(follows_empleados===follows_done_empleados){
              clientes_finalizados++
            }

          }
          clientes_disponibles++
        }
      }
    })
    /*console.log('Eliminados', clientes_eliminados, 'Parados', clientes_parados);
    console.log('follows_total',follows_total,'follows_total_done',follows_total_done)
    console.log('nofollows_total',nofollows_total,'nofollows_total_done',nofollows_total_done)
    console.log('Clientes',clientes_disponibles, 'Clientes finalizados', clientes_finalizados);
    */
    var frase = `${follows_total_done} de ${follows_total} enlaces, ${clientes_finalizados} de ${clientes_disponibles} clientes${clientes_eliminados>0?', '+clientes_eliminados+' clientes eliminados':''}${clientes_parados>0?', '+clientes_parados+' clientes parados':''}`
    this.props.setInfoTableEnlacesFreeLB({
      enlaces:{follows_total_done,follows_total},
      clientes:{clientes_finalizados, clientes_disponibles},
      clientes_eliminados,clientes_parados
    })
    //this.props.setInfoTableClientesPaidLB(`${items_loaded} de ${this.state.clientes_ordenados.length} clientes`)
  }
  changeSort = (id) =>{
    var des = false;
    if(this.state.sortBy===id){ des = this.state.des?false:true;}
    this.props.setSortTableClientesPaidLB({sortBy:id,des})
  }


  render(){

    return(
      <div className='panel-medios-gratuitos pr'>
        <div className='categotias-barra'>
          {/*<div className='container-items-barra-lateral'>*/}
          <div className='container-items-barra-lateral-scroll scroll-bar-exterior'>
          {this.state.clientes_ordenados.map((c,k)=>{
            var cliente = c[1]
            return(
              <div key={k} data-id={k} className='container-item-lista-categoria'>
                <ItemCliente cliente={cliente} />
              </div>
            )
          })}
          </div>
          {/*</div>*/}
        </div>
        <div className='sub-container-panels width-second-panel'>
          <div className='categorias-panel min-panel-enlaces-free'>
            {this.props.cliente_seleccionado?
                <div>
                  <table id='table-enlaces-free-linbuilding'>
                    <thead>
                      <tr>

                        <th onClick={()=>this.changeSort('status')} className='lb-enlaces-free-status' >
                          <div className='div-container-status'><div className="lb-enla-status-clientes-point punto-status"></div> {this.state.sortBy==='status' ? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}</div>

                        </th>

                        <th onClick={()=>this.changeSort('empleado')} className='lb-enlaces-free-empleado' >
                          <span>Empleado</span> {this.state.sortBy==='empleado'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th  onClick={()=>this.changeSort('destino')} className='lb-enlaces-free-destino'>
                          <span>Destino</span> {this.state.sortBy==='destino'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th  onClick={()=>this.changeSort('categoria')} className='lb-enlaces-free-categoria'>
                          <span>Categoría</span> {this.state.sortBy==='categoria'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th  onClick={()=>this.changeSort('medio')} className='lb-enlaces-free-medio'>
                          <span>Medio</span> {this.state.sortBy==='medio'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th  onClick={()=>this.changeSort('anchor')} className='lb-enlaces-free-anchor'>
                          <span>Anchor</span> {this.state.sortBy==='anchor'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th className='lb-enlaces-free-enlace'>
                          <span>Enlace</span>
                        </th>

                        <th  onClick={()=>this.changeSort('tipo')} className='lb-enlaces-free-tipo'>
                          <span>Tipo</span> {this.state.sortBy==='tipo'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th className='lb-enlaces-free-more'></th>

                      </tr>
                    </thead>
                    <tbody>

                    {
                       this.state.enlaces_ordenados.reduce((result, item, i)=>{
                        const k = item[0], enlace = item[1];
                        if (i < 200 ) {
                            result.push(
                              <ItemEnlaceFree key={k} enlace={enlace} />
                            );
                        }
                        return result;
                      }, [])

                    }
                    </tbody>
                  </table>
                </div>
              :null
            }



          </div>
        </div>

      </div>

    )
  }

}

function mapStateToProps(state){return{
  clientes: state.clientes,
  filtros:state.linkbuilding.enlaces.tipos.free.paneles.lista.filtros,
  search:state.linkbuilding.enlaces.tipos.free.paneles.lista.search,
  searchBy:state.linkbuilding.enlaces.tipos.free.paneles.lista.searchBy,
  sortBy:state.linkbuilding.enlaces.tipos.free.paneles.lista.sortBy,
  des:state.linkbuilding.enlaces.tipos.free.paneles.lista.des,
  items:state.linkbuilding.enlaces.tipos.free.paneles.lista.items_loaded,

  cliente_seleccionado: state.cliente_seleccionado,
  fecha:state.linkbuilding.enlaces.fecha
}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setSortTableClientesPaidLB, setItemsLoadTableClientesPaidLB, setInfoTableClientesPaidLB, setEnlacesFree, setInfoTableEnlacesFreeLB }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PanelLista);
