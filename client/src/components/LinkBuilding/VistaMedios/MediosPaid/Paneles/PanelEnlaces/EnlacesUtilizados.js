import React, { Component } from 'react'
import data from '../../../../../Global/Data/Data'
import * as functions from '../../../../../Global/functions'
import UpdateStateInputs from '../../../../../Global/UpdateStateInputs'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../../../redux/actions';
import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();

class EnlacesUtilizados extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enlaces_utilizados: this.props.enlaces_utilizados,
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.props.enlaces_utilizados !== nextProps.enlaces_utilizados) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.enlaces_utilizados !== newProps.enlaces_utilizados) { this.setState({ enlaces_utilizados: newProps.enlaces_utilizados }) }
  }

  undoData = () => { this.setState(this.props) }

  saveData = () => {

    var multiPath = {};
    multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.id_medio}/enlaces_utilizados`] = this.state.enlaces_utilizados;

    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })



  }

  render() {
    var edited = false;
    if (this.props.enlaces_utilizados !== this.state.enlaces_utilizados) {
      edited = true;
    }
    return (
      <div className='sub-container-informacion'>

        {edited ? <UpdateStateInputs saveData={() => this.saveData()} undoData={() => this.undoData()} /> : null}

        <p className='title-informacion-alumno'>2. Enlaces utilizados</p>

        {this.state.enlaces_utilizados.length > 0 ?

          <div className='container-enlaces-paid'>
            {this.state.enlaces_utilizados.map((item, key) => {

              var fechas = '', clientes = '';
              if (item.mini_enlaces) {
                item.mini_enlaces.forEach((e, k2) => {
                  if (e.fecha_selected) {
                    fechas = fechas + functions.getStringDate(e.fecha_selected) + ' | '

                    if (e.micronicho && e.micronicho !== 'home') {
                      clientes = clientes + functions.cleanProtocolo(this.props.clientes[e.id_cliente].servicios.linkbuilding.paid.micronichos.webs[e.micronicho].web) + ', '
                    } else {
                      clientes = clientes + functions.cleanProtocolo(this.props.clientes[e.id_cliente].web) + ', '
                    }

                  }
                })
              }
              fechas += '.'; fechas = fechas.replace(' | .', '')
              clientes += '.'; clientes = clientes.replace(', .', '')
              return (

                <div key={key} className={`item-enlace-comprado`}>

                  <div className='datos-enlace-right'>
                    <div>
                      <span className='item-enlace-comprado-title'>Precio de compra: </span>
                      <span className='item-enlace-comprado-data'>{`${functions.getDecimcals(item.precio_con_iva)} €  (${functions.getDecimcals(item.precio)} € sin IVA)`}</span>
                    </div>
                    <div>
                      <span className='item-enlace-comprado-title'>Plataforma: </span>
                      <span className='item-enlace-comprado-data'>{item.id_plataforma ? this.props.plataformas[item.id_plataforma].texto : ''}</span>
                    </div>
                    <div>
                      <span className='item-enlace-comprado-title'>Fecha de compra: </span>
                      <span className='item-enlace-comprado-data'>{functions.getDateNTimeFromDate(item.timestamp)}</span>
                    </div>

                    <div>
                      <span className='item-enlace-comprado-title'>Tipo de enlace: </span>
                      <span className='item-enlace-comprado-data'>{data.compartir_enlaces[item.compartir] ? data.compartir_enlaces[item.compartir].texto : 'Único ?'}</span>
                    </div>
                  </div>

                  <div className='datos-enlace-left'>
                    <div>
                      <span className='item-enlace-comprado-title'>Compra realizada por: </span>
                      <span className='item-enlace-comprado-data'>{this.props.empleados[item.id_empleado].nombre + ' ' + this.props.empleados[item.id_empleado].apellidos}</span>
                    </div>
                    <div>
                      <span className='item-enlace-comprado-title'>Disponible para: </span>
                      <span className='item-enlace-comprado-data'>Todos</span>
                    </div>

                    <div>
                      <span className='item-enlace-comprado-title'>Fecha de asignación: </span>
                      <span className='item-enlace-comprado-data'>{item.mini_enlaces ? fechas : functions.getStringDate(item.fecha_selected)}</span>
                    </div>

                    <div>
                      <span className='item-enlace-comprado-title'>Cliente asignado: </span>
                      <span className='item-enlace-comprado-data'>{item.mini_enlaces ? clientes : functions.cleanProtocolo(this.props.clientes[item.id_cliente].web)}</span>
                    </div>

                  </div>









                </div>

              )
            })}
          </div>



          :
          <div class="div_info_panel_linkbuilding">No hay enlaces utilizados</div>
        }

      </div>
    )
  }
}

function mapStateToProps(state) { return { empleados: state.empleados, clientes: state.clientes, plataformas: state.linkbuilding.medios.tipos.paid.plataformas } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(EnlacesUtilizados);
