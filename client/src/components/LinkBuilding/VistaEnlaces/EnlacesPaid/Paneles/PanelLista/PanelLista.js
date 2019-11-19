import React, { Component } from 'react'
import * as functions from '../../../../../Global/functions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSortTableClientesPaidLB, setItemsLoadTableClientesPaidLB, setInfoTableClientesPaidLB, setEnlacesPaid, setInfoTableEnlacesPaidLB } from '../../../../../../redux/actions';
import PanelCliente from './PanelCliente'
import ItemCliente from './ItemCliente'
import $ from 'jquery'
import _ from 'underscore';
import firebase from '../../../../../../firebase/Firebase';
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
      gastado_mesualmente: 0,
      enlaces_fijos: 0, gastado_fijos: 0, beneficios_fijos: 0,

      empleado: this.props.empleado
    }
  }

  componentWillMount = () => {
    this.ordenarClientes();
    this.getEnlaces();
    this.seleccionarCliente()
  }
  componentDidMount = () => {
    this.scrollToCliente()
  }

  componentWillReceiveProps = newProps => {
    //console.log('hola 1');
    if (this.state.clientes !== newProps.clientes ||
      this.state.sortBy !== newProps.sortBy ||
      this.state.des !== newProps.des ||
      this.state.filtros !== newProps.filtros ||
      this.state.search !== newProps.search ||
      this.state.searchBy !== newProps.searchBy
    ) {
      //console.log('Traza 1');
      this.setState({
        clientes: newProps.clientes,
        sortBy: newProps.sortBy,
        des: newProps.des,
        filtros: newProps.filtros,
        search: newProps.search,
        searchBy: newProps.searchBy
      }, () => { this.ordenarClientes() })

    } else if (this.state.items !== newProps.items) {
      //console.log('Traza 2');
      this.setState({ items: newProps.items })
    }

    if (this.props.visibility !== newProps.visibility && newProps.visibility) { this.scrollToCliente() }

    if (this.state.empleado !== newProps.empleado) { this.setState({ empleado: newProps.empleado }) }

    if (this.state.cliente_seleccionado !== newProps.cliente_seleccionado && this.state.fecha === newProps.fecha) {
      //console.log('Traza 3');
      if (!this.state.cliente_seleccionado) {
        this.setState({ cliente_seleccionado: newProps.cliente_seleccionado }, () => this.getEnlaces())
      } else {
        if (this.props.cliente_seleccionado.id_cliente !== newProps.cliente_seleccionado.id_cliente) {
          this.setState({ cliente_seleccionado: newProps.cliente_seleccionado }, () => this.getEnlaces())
          //habrá que cambiar solo el cliente seleccionado si cambia de empleado editandolo
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
      //console.log('Traza 4');
      this.setState({ cliente_seleccionado: newProps.cliente_seleccionado, fecha: newProps.fecha }, () => { this.getEnlaces(); this.ordenarClientes() })
    } else if (this.state.fecha !== newProps.fecha) {
      //console.log('Traza 5');
      this.setState({ fecha: newProps.fecha }, () => this.ordenarClientes())
    }
  }

  seleccionarCliente = () => {
    if (this.props.cliente_seleccionado) {
      try { if (this.state.cliente_seleccionado.servicios.linkbuilding.paid.editando_por.id_empleado === this.state.empleado.id_empleado && this.state.empleado.session.subpanel === 'linkbuilding_paid') { return null } } catch (e) { }
      var multiPath = {}
      if (!this.state.cliente_seleccionado.servicios.linkbuilding.paid.editando_por) {
        multiPath[`Empleados/${this.state.empleado.id_empleado}/session/cliente_seleccionado`] = this.state.cliente_seleccionado.id_cliente
        multiPath[`Empleados/${this.props.empleado.id_empleado}/session/subpanel`] = 'linkbuilding_paid'
        multiPath[`Clientes/${this.state.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/editando_por`] = { id_empleado: this.state.empleado.id_empleado, nombre: this.state.empleado.nombre + ' ' + this.state.empleado.apellidos, subpanel: 'linkbuilding_paid' }
      } else {
        multiPath[`Empleados/${this.state.empleado.id_empleado}/session/cliente_seleccionado`] = this.state.cliente_seleccionado.id_cliente
      }
      try {
        if (this.props.cliente_seleccionado.servicios.linkbuilding.free.editando_por.id_empleado === this.props.empleado.id_empleado) {
          //multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/editando_por`] = null
          multiPath[`Empleados/${this.props.empleado.id_empleado}/session/subpanel`] = 'linkbuilding_paid'
        }
      } catch (e) { }
      try {
        if (this.state.empleado.session.cliente_seleccionado && this.state.empleado.session.cliente_seleccionado !== this.state.cliente_seleccionado.id_cliente) {
          multiPath[`Clientes/${this.state.empleado.session.cliente_seleccionado}/servicios/linkbuilding/paid/editando_por`] = null
        }
      } catch (e) { }
      if (Object.keys(multiPath).length > 0) {
        db.update(multiPath)
          .then(() => {
            //console.log('seleccionarClientePaid');

          })
      }
    }
  }

  getEnlaces = () => {
    if (this.state.cliente_seleccionado) {

      try {
        var beneficioCliente = this.state.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[this.state.fecha].beneficio
      } catch (e) {

      }

      db.child(`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.state.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces`).on("value", snapshot => {
        var enlaces = {};
        var gastado_mesualmente = 0, beneficio_mensual = 0, enlaces_fijos = 0, gastado_fijos = 0, beneficios_fijos = 0;
        snapshot.forEach(data => {
          enlaces[data.key] = data.val();

          if (data.val().fixed_price && data.val().precio_fijo) {
            enlaces_fijos++;
            gastado_fijos += data.val().precio ? data.val().precio : 0
            beneficios_fijos += data.val().precio ? (data.val().fixed_price - data.val().precio) : 0
          } else {
            gastado_mesualmente += data.val().precio ? data.val().precio : 0
          }

          var precioVentaEnlace = data.val().precio ? functions.calcularPrecioVenta(data.val().precio, beneficioCliente) : 0;
          if (data.val().fixed_price && data.val().precio_fijo) {
            //beneficio_mensual +=  data.val().fixed_price - data.val().precio
          } else if (data.val().fixed_price) {
            beneficio_mensual += data.val().precio ? ((+data.val().fixed_price) - precioVentaEnlace) + (precioVentaEnlace - (+data.val().precio)) : 0
          } else {
            beneficio_mensual += data.val().precio ? precioVentaEnlace - (+data.val().precio) : 0
          }

          //multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${data.key}/activo`]=true
          //multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${data.key}/eliminado`]=false
        });
        //console.log(multiPath);
        //db.update(multiPath)
        this.props.setEnlacesPaid(enlaces);
        this.setState({ gastado_mesualmente, beneficio_mensual, enlaces_fijos, gastado_fijos, beneficios_fijos })
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
        return item[1][this.state.searchBy] && functions.limpiarString(item[1][this.state.searchBy]).includes(functions.limpiarString(this.state.search))
      })
    }


    //filtramos por los filtros seleccionados

    const filtros = this.state.filtros;
    clientes_ordenados = clientes_ordenados.filter((item) => {
      item = item[1];
      var empleado = false;
      try {
        if (item.empleados && item.empleados && item.empleados.linkbuilding_paid) { empleado = Object.entries(item.empleados.linkbuilding_paid).some(([k, e]) => { return filtros.empleados.items[k].checked }) }
      } catch (e) { }

      //comprobaremos si los enlaces gratuitos estan activados y que es un seo enterprise para visualizar el cliente y no perderlo, asi Guillermo no tiene excusa
      var enterprise = false;
      try {
        if (item.servicios.linkbuilding.free.activo &&
          item.servicios.linkbuilding.paid.enlaces_por_seo.mensualidades[this.state.fecha].seo === 'Enterprise'
        ) {
          enterprise = true
        }
      } catch (error) { }

      if (
        ((filtros.empleados.todos && filtros.empleados.todos.checked) || empleado) &&
        ((filtros.status.todos && filtros.status.todos.checked) || (filtros.status.items.activos.checked && item.activo && (enterprise || item.servicios.linkbuilding.paid.activo) && !item.eliminado) || (filtros.status.items.pausados.checked && (!item.activo || !item.servicios.linkbuilding.paid.activo) && !item.eliminado) || (filtros.status.items.eliminados.checked && item.eliminado)) &&
        //( (filtros.tipo_cliente.todos && filtros.tipo_cliente.todos.checked) || (item.tipo!=='pause' && filtros.tipo_cliente.items[item.tipo].checked   )     )
        ((filtros.tipo_cliente.todos && filtros.tipo_cliente.todos.checked) || (item.tipo !== 'pause' && filtros.tipo_cliente.items[item.tipo].checked)) &&
        ((filtros.blog.todos && filtros.blog.todos.checked) || filtros.blog.items[item.blog ? 'si' : 'no'].checked) &&
        ((filtros.idioma.todos && filtros.idioma.todos.checked) || (filtros.idioma.items[item.idioma] && filtros.idioma.items[item.idioma].checked)) &&
        ((filtros.seo.todos && filtros.seo.todos.checked) || filtros.seo.items[item.seo].checked)
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
    this.setState({ clientes_ordenados }, () => { this.changeContadorClientes(); /*this.scrollToCliente()*/ })

  }

  scrollToCliente = () => {
    setTimeout(function () {
      try {
        $('#container-clientes-lp').animate({ scrollTop: $("#container-clientes-lp").scrollTop() - $("#container-clientes-lp").offset().top + $("#container-clientes-lp").find(`.active-row-table`).offset().top - 100 }, 0);
      } catch (e) { }
    }, 0);
  }

  changeContadorClientes = () => {

    var clientes_eliminados = 0,
      clientes_parados = 0,
      clientes_disponibles = 0,
      clientes_finalizados = 0
      ;

    this.state.clientes_ordenados.forEach(item => {
      var cliente = item[1];
      if (cliente.eliminado) {
        clientes_eliminados++;
      } else if (!cliente.activo || !cliente.servicios.linkbuilding.paid.activo) {
        clientes_parados++
      } else {
        clientes_disponibles++
      }
    })

    this.props.setInfoTableEnlacesPaidLB({
      clientes: { clientes_finalizados, clientes_disponibles },
      clientes_eliminados, clientes_parados
    })
    //this.props.setInfoTableClientesPaidLB(`${items_loaded} de ${this.state.clientes_ordenados.length} clientes`)


  }
  changeSort = (id) => {
    var des = false;
    if (this.state.sortBy === id) { des = this.state.des ? false : true; }
    this.props.setSortTableClientesPaidLB({ sortBy: id, des })
  }


  render() {

    var inversion_mensual = 0,
      bote = 0,
      disponible_mensual = 0,
      comision = 0
    if (this.props.cliente_seleccionado) {
      bote = functions.getDecimcals(this.props.cliente_seleccionado.servicios.linkbuilding.paid.bote) + ' €'
      try {
        var ganancia = this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[this.props.fecha].beneficio / 100
        inversion_mensual = this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[this.props.fecha].inversion_mensual;
        var inversionMensualString = this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[this.props.fecha].inversion_mensual;
        disponible_mensual = (inversion_mensual * (1 - ganancia))

        if (this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[this.props.fecha].presupuestado_aparte) {
          var presupuestado_aparte = 0
          Object.entries(this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[this.props.fecha].presupuestado_aparte).forEach(([k, e]) => {
            presupuestado_aparte = presupuestado_aparte + (+e)
          })
          comision = ((+functions.getDecimcals(inversion_mensual - presupuestado_aparte)) * ganancia)
          inversionMensualString = functions.getDecimcals(inversion_mensual - presupuestado_aparte);
          inversion_mensual = `${functions.getDecimcals(inversion_mensual - presupuestado_aparte)} € + ${functions.getDecimcals(presupuestado_aparte)} €`
          disponible_mensual = `${functions.getDecimcals(disponible_mensual - (presupuestado_aparte * (1 - ganancia)))} €`

        } else {
          comision = (inversion_mensual * ganancia)
          inversion_mensual += ' €'
          disponible_mensual += ' €'
        }

        //comision = `Comisión: ${comision} € (${this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[this.props.fecha].beneficio}%)`

      } catch (e) { /*console.log('No se encuentra este mes en este cliente'); */ }

      inversionMensualString = inversionMensualString * (1 - ganancia)

    }
    //inversion_mensual+=' €'

    var bloqueado = false;
    try { if (this.state.cliente_seleccionado.servicios.linkbuilding.paid.editando_por.id_empleado !== this.state.empleado.id_empleado) { bloqueado = true } } catch (e) { }

    var enlacesEnterprise = false
    if (this.props.cliente_seleccionado && this.props.cliente_seleccionado.seo === 'Enterprise') {
      enlacesEnterprise = this.state.enlaces_ordenados.filter(item => { return item[1].id_empleado === 'Enterprise' })
    }



    return (
      <div className='panel-medios-gratuitos pr'>
        <div className='categotias-barra'>
          {/*<div className='container-items-barra-lateral'>*/}
          <div id='container-clientes-lp' className='container-items-barra-lateral-scroll scroll-bar-exterior'>
            {this.state.clientes_ordenados.map((c, k) => {
              var cliente = c[1]
              return (
                <div key={k} data-id={k} className='container-item-lista-categoria'>
                  <ItemCliente cliente={cliente} />
                </div>
              )
            })}
          </div>
          {/*</div>*/}
        </div>
        <div className='sub-container-panels width-second-panel pr'>
          <div className='categorias-panel min-panel-enlaces-free'>
            {this.props.cliente_seleccionado && this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades ?

              <PanelCliente
                cliente_seleccionado={this.props.cliente_seleccionado}
                changeSort={(valor) => this.changeSort(valor)}
                sortBy={this.state.sortBy}
                enlaces_ordenados={this.state.enlaces_ordenados}
                enlaces={this.state.enlaces}
                bloqueado={bloqueado}
                empleado={this.props.empleado}
                fecha={this.props.fecha}
                enlacesEnterprise={enlacesEnterprise}
                inversion_mensual={inversion_mensual}
                disponible_mensual={disponible_mensual}
                bote={bote}
                inversionMensualString={inversionMensualString}
                comision={comision}
              />


              :

              <div className='div_info_panel_linkbuilding'>
                {!this.props.cliente_seleccionado ? 'Selecciona un cliente' : ''}
                {this.props.cliente_seleccionado && this.props.cliente_seleccionado.eliminado ? 'Este cliente está eliminado' : ''}
                {this.props.cliente_seleccionado && !this.props.cliente_seleccionado.eliminado && !this.props.cliente_seleccionado.activo ? 'Este cliente está desactivado' : ''}
                {this.props.cliente_seleccionado && !this.props.cliente_seleccionado.eliminado && this.props.cliente_seleccionado.activo && !this.props.cliente_seleccionado.servicios.linkbuilding.paid.activo ? 'Este cliente tiene desactivado los enlaces de pago' : ''}
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
    filtros: state.linkbuilding.enlaces.tipos.paid.paneles.lista.filtros,
    search: state.linkbuilding.enlaces.tipos.paid.paneles.lista.search,
    searchBy: state.linkbuilding.enlaces.tipos.paid.paneles.lista.searchBy,
    sortBy: state.linkbuilding.enlaces.tipos.paid.paneles.lista.sortBy,
    des: state.linkbuilding.enlaces.tipos.paid.paneles.lista.des,
    items: state.linkbuilding.enlaces.tipos.paid.paneles.lista.items_loaded,

    empleado: state.empleado,

    cliente_seleccionado: state.cliente_seleccionado,
    fecha: state.linkbuilding.enlaces.fecha
  }
}
function matchDispatchToProps(dispatch) { return bindActionCreators({ setSortTableClientesPaidLB, setItemsLoadTableClientesPaidLB, setInfoTableClientesPaidLB, setEnlacesPaid, setInfoTableEnlacesPaidLB }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PanelLista);