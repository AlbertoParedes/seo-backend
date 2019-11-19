import React, { Component } from 'react'
import {limpiarString,getEnlacesRestantesFree}  from '../../../../../Global/functions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSortTableClientesFreeLB, setItemsLoadTableClientesFreeLB, setInfoTableClientesFreeLB, setEnlacesFree, setInfoTableEnlacesFreeLB } from '../../../../../../redux/actions';
import PanelCliente from './PanelCliente'
import ItemCliente from './ItemCliente'
import $ from 'jquery'
import _ from 'underscore';
import firebase from '../../../../../../firebase/Firebase';
import moment from 'moment'
const db = firebase.database().ref();

class PanelLista extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clientes: this.props.clientes,
      clientes_ordenados: [],

      sortBy: this.props.sortBy,
      des: this.props.des,
      search: this.props.search,
      searchBy: this.props.searchBy,

      items: this.props.items,
      filtros: this.props.filtros,

      cliente_seleccionado: this.props.cliente_seleccionado,
      enlaces: {},
      enlaces_ordenados: [],
      fecha: this.props.fecha,


      empleado: this.props.empleado
    }
  }

  componentDidMount = () => {
    this.scrollToCliente()
  }

  componentWillMount = () => {
    //console.log('componentWillMountFree');


    this.ordenarClientes();
    this.getEnlaces();
    this.seleccionarCliente()
  }



  componentWillReceiveProps = newProps => {
    //console.log('traza1');
    if (this.state.clientes !== newProps.clientes ||
      this.state.sortBy !== newProps.sortBy ||
      this.state.des !== newProps.des ||
      this.state.filtros !== newProps.filtros ||
      this.state.search !== newProps.search ||
      this.state.searchBy !== newProps.searchBy ||
      this.state.fecha !== newProps.fecha
    ) {

      this.setState({
        clientes: newProps.clientes,
        sortBy: newProps.sortBy,
        des: newProps.des,
        filtros: newProps.filtros,
        search: newProps.search,
        searchBy: newProps.searchBy,
        fecha: newProps.fecha
      }, () => { this.ordenarClientes() })

    } else if (this.state.items !== newProps.items) { this.setState({ items: newProps.items }) }

    if (this.props.visibility !== newProps.visibility && newProps.visibility) { this.scrollToCliente() }

    if (this.state.empleado !== newProps.empleado) { this.setState({ empleado: newProps.empleado }) }

    if (this.state.cliente_seleccionado !== newProps.cliente_seleccionado) {
      //console.log('traza2');
      if (!this.state.cliente_seleccionado) {
        this.setState({ cliente_seleccionado: newProps.cliente_seleccionado }, () => this.getEnlaces())
      } else {
        if (this.state.cliente_seleccionado.id_cliente !== newProps.cliente_seleccionado.id_cliente) {
          this.setState({ cliente_seleccionado: newProps.cliente_seleccionado }, () => this.getEnlaces())
        } else {
          //habrá que cambiar solo el cliente seleccionado si cambia de empleado editandolo
          if (!_.isEqual(this.state.cliente_seleccionado.servicios.linkbuilding.free.editando_por, newProps.cliente_seleccionado.servicios.linkbuilding.free.editando_por) ||
            !_.isEqual(this.state.cliente_seleccionado.servicios.linkbuilding.paid.editando_por, newProps.cliente_seleccionado.servicios.linkbuilding.paid.editando_por)) {

            this.setState({ cliente_seleccionado: newProps.cliente_seleccionado }, () => {
              this.seleccionarCliente()
            })
          }

        }
      }
    } else if (newProps.cliente_seleccionado && this.state.fecha !== newProps.fecha) {
      //console.log('traza3');
      this.setState({ cliente_seleccionado: newProps.cliente_seleccionado, fecha: newProps.fecha }, () => this.getEnlaces(), this.ordenarClientes())
    } else if (this.state.fecha !== newProps.fecha) {
      //console.log('traza4');
      this.setState({ fecha: newProps.fecha }, () => this.ordenarClientes())
    }



  }

  seleccionarCliente = () => {
    if (this.props.cliente_seleccionado) {
      try { if (this.state.cliente_seleccionado.servicios.linkbuilding.free.editando_por.id_empleado === this.state.empleado.id_empleado && this.state.empleado.session.subpanel === 'linkbuilding_free') { return null } } catch (e) { }
      var multiPath = {}
      if (!this.state.cliente_seleccionado.servicios.linkbuilding.free.editando_por) {
        multiPath[`Empleados/${this.state.empleado.id_empleado}/session/cliente_seleccionado`] = this.state.cliente_seleccionado.id_cliente
        multiPath[`Empleados/${this.props.empleado.id_empleado}/session/subpanel`] = 'linkbuilding_free'
        multiPath[`Clientes/${this.state.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/editando_por`] = {
          id_empleado: this.state.empleado.id_empleado,
          nombre: this.state.empleado.nombre + ' ' + this.state.empleado.apellidos,
          subpanel: 'linkbuilding_free'
        }
      } else {
        multiPath[`Empleados/${this.state.empleado.id_empleado}/session/cliente_seleccionado`] = this.state.cliente_seleccionado.id_cliente
      }
      try {
        if (this.props.cliente_seleccionado.servicios.linkbuilding.paid.editando_por.id_empleado === this.props.empleado.id_empleado) {
          //multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/editando_por`] = null
          multiPath[`Empleados/${this.props.empleado.id_empleado}/session/subpanel`] = 'linkbuilding_free'
        }
      } catch (e) { }
      try {
        if (this.state.empleado.session.cliente_seleccionado && this.state.empleado.session.cliente_seleccionado !== this.state.cliente_seleccionado.id_cliente) {
          multiPath[`Clientes/${this.state.empleado.session.cliente_seleccionado}/servicios/linkbuilding/free/editando_por`] = null
        }
      } catch (e) { }
      if (Object.keys(multiPath).length > 0) {
        db.update(multiPath)
          .then(() => {
            //console.log('seleccionarClienteFree');

          })
      }
    }
  }

  getEnlaces = () => {
    if (this.state.cliente_seleccionado) {
      db.child(`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.state.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces`).on("value", snapshot => {
        var enlaces = {};
        snapshot.forEach(data => {
          enlaces[data.key] = data.val();
        });
        this.props.setEnlacesFree(enlaces);
        this.setState({ enlaces }, () => {
          this.ordernarEnlaces();
        });
      })
    }
  }

  ordernarEnlaces = () => {
    var enlaces_ordenados = Object.entries(this.state.enlaces)
    this.setState({ enlaces_ordenados })
  }
  ordenarClientes = () => {


    var clientes_ordenados = Object.entries(this.state.clientes)

    if (this.state.search.trim() !== '') {
      clientes_ordenados = clientes_ordenados.filter(item => {
        return item[1][this.state.searchBy] && limpiarString(item[1][this.state.searchBy]).includes(limpiarString(this.state.search))
      })
    }

    
    


    //filtramos por los filtros seleccionados

    const filtros = this.state.filtros;

    clientes_ordenados = clientes_ordenados.filter((item) => {
      item = item[1];
      var empleado = false;
      try {
        if (item.empleados && item.servicios.linkbuilding.free.home.mensualidades[this.state.fecha].empleados) {
          empleado = Object.entries(item.servicios.linkbuilding.free.home.mensualidades[this.state.fecha].empleados).some(([k, e]) => {
            return filtros.empleados.items[k].checked
          })
        }
      } catch (e) { }
      
      var {enlaces_restante, follows, follows_done_all} = getEnlacesRestantesFree(item, this.props.fecha, filtros.empleados);

      //var enlaces_estantes = getEnlacesRestantes()

      if (
        ((filtros.empleados.todos && filtros.empleados.todos.checked) || empleado) &&
        ((filtros.status.todos && filtros.status.todos.checked) || (filtros.status.items.activos.checked && item.activo && item.servicios.linkbuilding.free.activo && !item.eliminado) || (filtros.status.items.pausados.checked && (!item.activo || !item.servicios.linkbuilding.free.activo) && !item.eliminado) || (filtros.status.items.eliminados.checked && item.eliminado)) &&
        ((filtros.tipo_cliente.todos && filtros.tipo_cliente.todos.checked) || (item.tipo !== 'pause' && filtros.tipo_cliente.items[item.tipo].checked)) &&
        ((filtros.blog.todos && filtros.blog.todos.checked) || filtros.blog.items[item.blog ? 'si' : 'no'].checked) &&
        ((filtros.idioma.todos && filtros.idioma.todos.checked) || (filtros.idioma.items[item.idioma] && filtros.idioma.items[item.idioma].checked)) &&
        ((filtros.seo.todos && filtros.seo.todos.checked) || filtros.seo.items[item.seo].checked) &&
        ((filtros.estado.todos && filtros.estado.todos.checked) || filtros.estado.items[enlaces_restante>0 ? 'no' : 'si'].checked) 
      ) {
        return true
      }
      return false;
    })
    clientes_ordenados.sort((a, b) => {
      a = a[1]; b = b[1]
      if (a['dominio'].toLowerCase() > b['dominio'].toLowerCase()) { return 1; }
      if (a['dominio'].toLowerCase() < b['dominio'].toLowerCase()) { return -1; }
      return 0;
    });

    if (this.state.des) { clientes_ordenados.reverse(); }


    this.setState({ clientes_ordenados }, () => { this.changeContadorClientes() })

  }

  scrollToCliente = () => {
    setTimeout(function () {
      try {
        $('#container-clientes-lg').animate({ scrollTop: $("#container-clientes-lg").scrollTop() - $("#container-clientes-lg").offset().top + $("#container-clientes-lg").find(`.active-row-table`).offset().top - 100 }, 0);
      } catch (e) { }
    }, 0);
  }

  changeContadorClientes = () => {

    var clientes_eliminados = 0,
      clientes_parados = 0,
      clientes_disponibles = 0,
      clientes_finalizados = 0,
      follows_total = 0, follows_total_done = 0,
      nofollows_total = 0, nofollows_total_done = 0
      ;

    this.state.clientes_ordenados.forEach(item => {
      var cliente = item[1];
      if (cliente.eliminado) {
        clientes_eliminados++;
      } else if (!cliente.activo || !cliente.servicios.linkbuilding.free.activo) {
        clientes_parados++
      } else {

        var mes = cliente.servicios.linkbuilding.free.home.mensualidades[this.state.fecha] ? cliente.servicios.linkbuilding.free.home.mensualidades[this.state.fecha] : false
        var follows = mes ? mes.follows : 0
        var nofollows = mes ? mes.nofollows : 0


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
        if (mes && mes.empleados) {

          var empleados_filtro = this.state.filtros.empleados.items
          Object.entries(mes.empleados).forEach(([k, c]) => {
            //enlaces totales hechos sin tener encuenta a los empleados
            if (c.enlaces_follows) { follows_done_all = follows_done_all + Object.entries(c.enlaces_follows).filter(([k2, e]) => { return e === true }).length }
            if (c.enlaces_nofollows) { nofollows_done_all = nofollows_done_all + Object.entries(c.enlaces_nofollows).filter(([k2, e]) => { return e === true }).length }
            //De cada empleado sumaremos sus follows y no follows al total junto con los que se han completado
            if (empleados_filtro[k] && empleados_filtro[k].checked) {
              follows_empleados = follows_empleados + (c.follows ? c.follows : 0);//si no existe follows ni nofollows en el mes de ese cliente es por que ese empleado ha hecho un enlace que no estba obligado a hacer.
              nofollows_empleados = nofollows_empleados + (c.nofollows ? c.nofollows : 0);
              try {
                follows_done_empleados = follows_done_empleados + Object.entries(c.enlaces_follows).filter(([k2, e]) => { return e === true }).length
              } catch (e) { }

              try {
                nofollows_done_empleados = nofollows_done_empleados + Object.entries(c.enlaces_nofollows).filter(([k2, e]) => { return e === true }).length
              } catch (e) { }
            }
          })

          if (this.state.filtros.empleados.todos.checked) {
            follows_empleados = follows;
            follows_done_empleados = follows_done_all

            //sumamos al contador global todos los follows todos los cliente
            follows_total = follows_total + follows
            nofollows_total = nofollows_total + nofollows

            follows_total_done = follows_total_done + follows_done_all
            nofollows_total_done = nofollows_total_done + nofollows_done_all

            if (follows_done_all === follows) {
              clientes_finalizados++
            }

          } else {
            //sumamos al contador global todos los follows de cada cliente ese mes
            follows_total = follows_total + follows_empleados
            nofollows_total = nofollows_total + nofollows_empleados

            follows_total_done = follows_total_done + follows_done_empleados
            nofollows_total_done = nofollows_total_done + nofollows_done_empleados

            if (follows_empleados === follows_done_empleados) {
              clientes_finalizados++
            }

          }
          clientes_disponibles++
        }
      }
    })
    this.props.setInfoTableEnlacesFreeLB({
      enlaces: { follows_total_done, follows_total },
      clientes: { clientes_finalizados, clientes_disponibles },
      clientes_eliminados, clientes_parados
    })
    //this.props.setInfoTableClientesPaidLB(`${items_loaded} de ${this.state.clientes_ordenados.length} clientes`)
  }
  changeSort = (id) => {
    var des = false;
    if (this.state.sortBy === id) { des = this.state.des ? false : true; }
    this.props.setSortTableClientesFreeLB({ sortBy: id, des })
  }


  render() {

    var bloqueado = false;
    try { if (this.state.cliente_seleccionado.servicios.linkbuilding.free.editando_por.id_empleado !== this.state.empleado.id_empleado) { bloqueado = true } } catch (e) { }

    return (
      <div className='panel-medios-gratuitos pr'>
        <div className='categotias-barra'>
          {/*<div className='container-items-barra-lateral'>*/}
          <div id='container-clientes-lg' className='container-items-barra-lateral-scroll scroll-bar-exterior'>
            {this.state.clientes_ordenados.map((c, k) => {
              var cliente = c[1]
              return (
                <div key={k} data-id={k} className='container-item-lista-categoria '>
                  <ItemCliente cliente={cliente} />
                </div>
              )
            })}
          </div>
          {/*</div>*/}
        </div>
        <div className='sub-container-panels width-second-panel'>
          <div className='categorias-panel min-panel-enlaces-free'>
            {this.props.cliente_seleccionado ?
              <PanelCliente
                cliente_seleccionado={this.props.cliente_seleccionado}
                changeSort={(valor) => this.changeSort(valor)}
                sortBy={this.state.sortBy}
                enlaces_ordenados={this.state.enlaces_ordenados}
                enlaces={this.state.enlaces}
                bloqueado={bloqueado}
                empleado={this.props.empleado}
                fecha={this.props.fecha}
              />
              :

              <div className='div_info_panel_linkbuilding'>
                {!this.props.cliente_seleccionado ? 'Selecciona un cliente' : ''}
                {this.props.cliente_seleccionado && this.props.cliente_seleccionado.eliminado ? 'Este cliente está eliminado' : ''}
                {this.props.cliente_seleccionado && !this.props.cliente_seleccionado.eliminado && !this.props.cliente_seleccionado.activo ? 'Este cliente está desactivado' : ''}
                {this.props.cliente_seleccionado && !this.props.cliente_seleccionado.eliminado && this.props.cliente_seleccionado.activo && !this.props.cliente_seleccionado.servicios.linkbuilding.paid.activo ? 'Este cliente tiene desactivado los enlaces gratuitos' : ''}
              </div>

            }



          </div>
        </div>

      </div>

    )
  }

}

function mapStateToProps(state) {
  return {
    clientes: state.clientes,
    filtros: state.linkbuilding.enlaces.tipos.free.paneles.lista.filtros,
    search: state.linkbuilding.enlaces.tipos.free.paneles.lista.search,
    searchBy: state.linkbuilding.enlaces.tipos.free.paneles.lista.searchBy,
    sortBy: state.linkbuilding.enlaces.tipos.free.paneles.lista.sortBy,
    des: state.linkbuilding.enlaces.tipos.free.paneles.lista.des,
    items: state.linkbuilding.enlaces.tipos.free.paneles.lista.items_loaded,

    empleado: state.empleado,

    cliente_seleccionado: state.cliente_seleccionado,
    fecha: state.linkbuilding.enlaces.fecha
  }
}
function matchDispatchToProps(dispatch) { return bindActionCreators({ setSortTableClientesFreeLB, setItemsLoadTableClientesFreeLB, setInfoTableClientesFreeLB, setEnlacesFree, setInfoTableEnlacesFreeLB }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PanelLista);
