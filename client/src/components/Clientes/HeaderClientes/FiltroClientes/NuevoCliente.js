import React, { Component } from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import * as functions from '../../../Global/functions'
import { connect } from 'react-redux';
import firebase from '../../../../firebase/Firebase';
import { URLESTADOCLIENTE } from '../../../Global/Data/constants'
import $ from 'jquery'
import { setPanelClientes, setClienteSeleccionado } from '../../../../redux/actions';
import { bindActionCreators } from 'redux';
const db = firebase.database().ref();

class NuevosCliente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web: ''
    }
  }

  guardarMedio = (e) => {

    var multiPath = {};

    var web_repetida = Object.entries(this.props.clientes).some(([k, c]) => { return functions.getDominio(c.web) === functions.getDominio(this.state.web) })
    if (web_repetida) {
      console.log('Este cliente ya existe');
      return false;
    } else if (!functions.isLink(this.state.web)) {
      console.log('La web del cliente debe empezar por http:// o https:// y contener un " . "');
      return false;
    }
    else if (this.state.web.trim() === '') {
      //this.props.mensajeInformativo('Exiten errores en los campos')
      console.log('Existen errores en los campos');
      return false;
    }

    var key = db.child(`Clientes`).push().key;
    var cliente = {
      activo: true,
      blog: false,
      dominio: functions.getDominio(this.state.web.trim()),
      eliminado: false,
      empleados: {},
      follows: 0,
      id_cliente: key,
      idioma: 'Español',
      nofollows: 0,
      nombre: '',
      seo: 'A medida',
      servicios: {
        linkbuilding: {
          free: {
            activo: false,
            home: {
              activo: true
            }
          },
          paid: {
            activo: false,
            beneficio: 0,
            bote: 0,
            comentarios: '',
            inversion_mensual: 0,
            porcentaje_perdida: 0,
            home: {
              activo: true,
              presupuesto_dedicado: false,
              tipo_de_presupuesto: false
            },
            micronichos: {
              activo: false
            }
          }
        },
        tracking: {
          activo: false
        }
      },
      tipo: 'new',
      web: this.state.web.trim()
    }
    multiPath[`Clientes/${key}`] = cliente

    console.log(multiPath);

    db.update(multiPath)
      .then(() => {
        console.log('Ok');


        var data = {}
        data.subject = `NUEVO CLIENTE: ${this.state.web.trim()}`
        data.status = 'good';
        data.empleado = this.props.empleado.nombre + " " + this.props.empleado.apellidos;
        data.frase = `Se ha creado un nuevo cliente: <a href='${this.state.web.trim()}' class='link-cliente'>${this.state.web.trim()}</a>`
        data.cliente = this.state.web.trim();
        $.post(URLESTADOCLIENTE, data, (request, data) => {
          //console.log(request, data);
        })



        this.updateCliente(cliente, e);


      })
      .catch(err => { console.log(err); })



  }

  updateCliente = (cliente, e) => {

    if (this.props.cliente_seleccionado) {

      var multiPath = {}
      try {
        if (this.props.cliente_seleccionado.servicios.linkbuilding.free.editando_por.id_empleado === this.props.empleado.id_empleado) {
          multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/editando_por`] = null
        }
      } catch (e) { }
      try {
        if (this.props.cliente_seleccionado.servicios.linkbuilding.paid.editando_por.id_empleado === this.props.empleado.id_empleado) {
          multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/editando_por`] = null
        }
      } catch (e) { }
      multiPath[`Empleados/${this.props.empleado.id_empleado}/session/cliente_seleccionado`] = cliente.id_cliente
      if (Object.keys(multiPath).length > 0) { db.update(multiPath) }
    }

    this.props.setClienteSeleccionado(cliente)
    this.props.setPanelClientes('info')
    e.stopPropagation(); this.props.close();

  }


  render() {
    var web_repetida = Object.entries(this.props.clientes).some(([k, c]) => { return functions.getDominio(c.web) === functions.getDominio(this.state.web) })
    var isLink = functions.isLink(this.state.web)
    return (
      <div className='container-opt-search nuevos-enlaces-paid-medios'>
        <div className='opciones-search-popup opciones-search-show-popup pop-up-enlaces-nuevos pop-up-medios-paid-nuevos'>
          <div className='size-medios-popup scroll-bar-exterior'>

            <div className="title-pop-up title-center-pop-up">Cliente nuevo</div>

            <SimpleInput title='Web del nuevo cliente' _class_container={this.state.web.trim() === '' || web_repetida || !isLink ? 'error-form-input' : null} text={this.state.web} changeValue={web => { this.setState({ web }) }} />

            <div className='btns-finalizar-add-medios-paid'>

              <div className="btn-cancelar-confirm" onClick={(e) => { e.stopPropagation(); this.props.close(); }}>Cancelar</div>
              <div className="btn-aceptar-confirm" onClick={(e) => this.guardarMedio(e)}>Guardar</div>

            </div>

          </div>

        </div>


      </div>
    )
  }
}

function mapStateToProps(state) { return { clientes: state.clientes, empleado: state.empleado } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPanelClientes, setClienteSeleccionado }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(NuevosCliente);
