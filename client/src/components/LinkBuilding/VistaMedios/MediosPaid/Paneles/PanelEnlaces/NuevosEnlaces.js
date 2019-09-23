import React, { Component } from 'react'
import SimpleInput from '../../../../../Global/SimpleInput'
import * as functions from '../../../../../Global/functions'
import SimpleInputDesplegable from '../../../../../Global/SimpleInputDesplegable'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../../../redux/actions';
import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();

class NuevosEnlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      precio_iva: '',
      precio_sin_iva: '',
      n_enlaces: 1,
      id_plataforma: false,

      precio_unidad: 'igualdad',
      lista_precio_unidad: {
        igualdad: { texto: 'Precios iguales', valor: 'Iguales' },
        //desigualdad:{texto:'Precios distintos', valor:'Distintos'}
      },
      compartir: {
        unico: { texto: 'Único' },
        compartido_1: { texto: 'Compartir (1)' },
        compartido_2: { texto: 'Compartir (2)' },
        compartido_3: { texto: 'Compartir (3)' },
        compartido_4: { texto: 'Compartir (4)' },
      },

      enlaces: {
        0: { compartir: 'unico', visible: true }
      }
    }
  }

  cambiarPrecioIVA = (precio_iva) => {
    var num = functions.getNumber(precio_iva)
    var precio_sin_iva = num / 1.21;

    var decimales = num.toString().split('.');
    if (decimales[1] && decimales[1].length > 2) {
      return false
    }

    this.setState({ precio_iva: num.toString(), precio_sin_iva: precio_sin_iva.toString() }, () => this.updatePreciosEnlacesCompartidos(this.state.enlaces))
  }

  cambiarPrecioSinIVA = precio_sin_iva => {



    //this.setState({precio_sin_iva})
    var num = functions.getNumber(precio_sin_iva)
    var precio_iva = num * 1.21;

    var decimales = num.toString().split('.');
    if (decimales[1] && decimales[1].length > 2) {
      return false
    }

    this.setState({ precio_iva: precio_iva.toString(), precio_sin_iva: num.toString() }, () => this.updatePreciosEnlacesCompartidos(this.state.enlaces))
  }

  changeOpcion = (id, compartir) => {
    var enlaces = this.state.enlaces;
    enlaces[id].compartir = compartir
    this.updatePreciosEnlacesCompartidos(enlaces)
  }
  updatePreciosEnlacesCompartidos = (enlaces) => {

    var precio_unidad = 0;
    var enlaces_visibles = Object.entries(enlaces).filter(([k, e]) => { return e.visible })
    if (enlaces_visibles.length > 0 && this.state.precio_iva) {
      precio_unidad = functions.getNumber(this.state.precio_iva) / enlaces_visibles.length
    }

    Object.entries(enlaces).forEach(([k, e]) => {
      var compartir = e.compartir
      if (compartir === 'compartido_1') {
        enlaces[k].mini_enlaces = {
          0: { precio_con_iva: precio_unidad, precio: precio_unidad / 1.21 }
        }
      } else if (compartir === 'compartido_2') {
        enlaces[k].mini_enlaces = {
          0: { precio_con_iva: precio_unidad / 2, precio: (precio_unidad / 2) / 1.21 },
          1: { precio_con_iva: precio_unidad / 2, precio: (precio_unidad / 2) / 1.21 }
        }
      } else if (compartir === 'compartido_3') {
        enlaces[k].mini_enlaces = {
          0: { precio_con_iva: precio_unidad / 3, precio: (precio_unidad / 3) / 1.21 },
          1: { precio_con_iva: precio_unidad / 3, precio: (precio_unidad / 3) / 1.21 },
          2: { precio_con_iva: precio_unidad / 3, precio: (precio_unidad / 3) / 1.21 }
        }
      } else if (compartir === 'compartido_4') {
        enlaces[k].mini_enlaces = {
          0: { precio_con_iva: precio_unidad / 4, precio: (precio_unidad / 4) / 1.21 },
          1: { precio_con_iva: precio_unidad / 4, precio: (precio_unidad / 4) / 1.21 },
          2: { precio_con_iva: precio_unidad / 4, precio: (precio_unidad / 4) / 1.21 },
          3: { precio_con_iva: precio_unidad / 4, precio: (precio_unidad / 4) / 1.21 }
        }
      } else {
        enlaces[k].mini_enlaces = null;
      }
    })
    this.setState({ enlaces })
  }

  changePrecio = (id, valor) => {
    var enlaces = this.state.enlaces;
    enlaces[id].precio = functions.getNumber(valor)
    this.setState({ enlaces }, () => this.updatePreciosEnlacesCompartidos(enlaces))
  }

  changeEnlaces = (n_enlaces) => {
    var enlaces = this.state.enlaces
    if (n_enlaces.trim() !== '' && !n_enlaces.includes('.') && !n_enlaces.includes(',') && n_enlaces !== '0') {

      //creamos los enlaces en la variable
      for (var i = 0; i < (+n_enlaces); i++) {
        if (!enlaces[i]) {
          enlaces[i] = {
            compartir: 'unico',
            visible: true
          }
        }
      }

      Object.entries(enlaces).forEach(([k, e]) => {
        if (k < (+n_enlaces)) {
          e.visible = true;
        } else {
          e.visible = false;
        }

      })


    } else {
      Object.entries(enlaces).forEach(([k, e]) => {
        e.visible = false;
      })
    }

    this.setState({ n_enlaces, enlaces }, () => this.updatePreciosEnlacesCompartidos(enlaces))
  }

  gurdarEnlaces = () => {
    var enlaces_visibles = Object.entries(this.state.enlaces).filter(([k, e]) => { return e.visible })

    if (this.state.n_enlaces.toString().includes('.') || this.state.n_enlaces.toString().includes(',') || this.state.n_enlaces.toString() === '' || (+this.state.n_enlaces) <= 0) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'El numero de enlaces es incorrecto' })

      return false;
    } else if (this.state.precio_iva === '') {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Precio de compra no válido' })

      return false;
    } else if ((+this.state.precio_iva) <= 0) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Precio de compra no válido' })

      return false;
    } else if (!this.state.id_plataforma) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Selecciona un plataforma' })

      return false;
    }

    var multiPath = {}
    enlaces_visibles.forEach(([k, e]) => {
      var id_enlace = db.child(`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.medio_seleccionado.id_medio}/enlaces/`).push().key;
      multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.medio_seleccionado.id_medio}/enlaces/${id_enlace}`] = {
        id_enlace,
        fecha: functions.getNow(),
        id_empleado: this.props.empleado.id_empleado,
        //just_for:
        id_plataforma: this.state.id_plataforma,
        precio: (+this.state.precio_sin_iva) / enlaces_visibles.length,//Precio sin interval
        precio_con_iva: (+this.state.precio_iva) / enlaces_visibles.length,
        timestamp: functions.getTimestamp(),
        compartir: e.compartir,
        mini_enlaces: e.mini_enlaces
      }
    })

    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
        this.props.close()
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })
  }


  render() {



    var precio_unidad = '';
    var enlaces_visibles = Object.entries(this.state.enlaces).filter(([k, e]) => { return e.visible })
    if (enlaces_visibles.length > 0 && this.state.precio_iva) {
      precio_unidad = functions.getNumber(this.state.precio_iva) / enlaces_visibles.length
    }


    var error_suma_enlaces = false
    if (this.state.precio_unidad !== 'igualdad') {
      var suma_enlaces = 0
      enlaces_visibles.forEach((e, k) => {
        var item = e[1];
        if (item.precio && item.precio !== '') {
          suma_enlaces = suma_enlaces + (+item.precio)
        } else if (item.precio !== '') {
          suma_enlaces = suma_enlaces + (+precio_unidad)
        }
      })
      if (suma_enlaces.toString() !== this.state.precio_iva.toString()) error_suma_enlaces = true
    }

    var num_precio_iva = false, num_precio_sin_iva = false, decimales = 0;
    if (this.state.precio_iva !== '') {
      num_precio_iva = functions.getNumber(this.state.precio_iva)
      if (num_precio_iva.toString().includes('.') || num_precio_iva.toString().includes(',')) {
        decimales = num_precio_iva.toString().substring(num_precio_iva.toString().indexOf('.'), num_precio_iva.toString().length)
        if (decimales.length > 2) {
          num_precio_iva = functions.getDecimcals(num_precio_iva)
        }
      } else {
        num_precio_iva = functions.getDecimcals(num_precio_iva)
      }
    }
    if (this.state.precio_sin_iva !== '') {
      num_precio_sin_iva = functions.getNumber(this.state.precio_sin_iva)

      if (num_precio_sin_iva.toString().includes('.') || num_precio_sin_iva.toString().includes(',')) {
        decimales = num_precio_sin_iva.toString().substring(num_precio_sin_iva.toString().indexOf('.'), num_precio_sin_iva.toString().length)
        if (decimales.length > 2) {
          num_precio_sin_iva = functions.getDecimcals(num_precio_sin_iva)
        }
      } else {
        num_precio_sin_iva = functions.getDecimcals(num_precio_sin_iva)
      }
    }

    var blockPrecioIva = false, blockPrecioSinIva = false
    if (!this.state.id_plataforma) {
      blockPrecioIva = true
      blockPrecioSinIva = true
    } else if (this.props.plataformas[this.state.id_plataforma].setPrecioWith === 'con_iva') {
      blockPrecioSinIva = true
    } else if (this.props.plataformas[this.state.id_plataforma].setPrecioWith === 'sin_iva') {
      blockPrecioIva = true
    }



    return (
      <div className='container-opt-search nuevos-enlaces-paid-medios '>
        <div className='opciones-search-popup opciones-search-show-popup pop-up-enlaces-nuevos'>
          <div className='size-medios-popup scroll-bar-exterior'>

            <div className="title-pop-up title-center-pop-up">Enlaces nuevos</div>

            <SimpleInputDesplegable _class_container={!this.state.id_plataforma ? 'error-form-input' : null} type='object' lista={this.props.plataformas} title='Plataforma' text={this.state.id_plataforma ? this.props.plataformas[this.state.id_plataforma].texto : 'Selecciona una plataforma'} changeValor={(id_plataforma) => this.setState({ id_plataforma })} />

            <div className='col-2-input'>
              <SimpleInput type={`${blockPrecioIva ? 'block' : 'float'}`} title='Precio total (IVA)' _class_container={!num_precio_iva ? 'error-form-input' : null} text={num_precio_iva ? num_precio_iva : ''} changeValue={precio_iva => { this.cambiarPrecioIVA(precio_iva) }} />
              <SimpleInput type={`${blockPrecioSinIva ? 'block' : 'float'}`} title='Precio total (sin IVA)' _class_container={!num_precio_iva ? 'error-form-input' : null} text={num_precio_sin_iva ? num_precio_sin_iva : ''} changeValue={precio_sin_iva => { this.cambiarPrecioSinIVA(precio_sin_iva) }} />
            </div>

            <div className='col-2-input'>
              <SimpleInput type='float' title='Número de enlaces' text={this.state.n_enlaces ? this.state.n_enlaces : ''} changeValue={n_enlaces => { this.changeEnlaces(n_enlaces) }} />
              {enlaces_visibles.length === 0 ?
                <SimpleInput type='block' title='Precio unidad (IVA)' text={functions.getDecimcals(precio_unidad)} />
                :
                enlaces_visibles.length === 1 ?
                  <SimpleInput type='block' title='Precio unidad (IVA)' text={functions.getDecimcals(precio_unidad)} />
                  :
                  <SimpleInputDesplegable type='object' lista={this.state.lista_precio_unidad} title='Precio unidad (IVA)' text={this.state.lista_precio_unidad[this.state.precio_unidad].valor} changeValor={(precio_unidad) => this.setState({ precio_unidad })} />
              }
            </div>

            {enlaces_visibles.length > 0 ?

              enlaces_visibles.map((e, k) => {
                var item = e[1]
                return (
                  <div className='container-enlace-medio' key={e[0]}>
                    <div className="title-pop-up title-center-pop-up">Enlace {k + 1}</div>

                    <div className='col-2-input'>
                      <SimpleInputDesplegable type='object' lista={this.state.compartir} title='Tipo de enlace' text={this.state.compartir[item.compartir].texto} changeValor={(compartir) => this.changeOpcion((+e[0]), compartir)} />
                      <SimpleInput type={this.state.precio_unidad === 'igualdad' ? 'block' : 'float'} _class_container={error_suma_enlaces ? 'error-form-input' : null} title='Precio (IVA)' text={this.state.precio_unidad === 'igualdad' ? functions.getDecimcals(precio_unidad) : item.precio || item.precio === '' ? item.precio : precio_unidad} changeValue={(valor) => this.changePrecio((+e[0]), valor)} />
                    </div>


                    {/*<div className='col-2-input'>
                        <SimpleInput type={item.precio_unidad==='igualdad'?'block':'float'} title='Precio enlace 1 (IVA)'  text={this.state.precio_unidad==='igualdad'?precio_unidad:item.precio || item.precio===''?item.precio:precio_unidad} changeValue={(valor)=>this.changePrecio((+e[0]),valor)}/>
                        <SimpleInput type={item.precio_unidad==='igualdad'?'block':'float'} title='Precio enlace 2 (IVA)'  text={this.state.precio_unidad==='igualdad'?precio_unidad:item.precio || item.precio===''?item.precio:precio_unidad} changeValue={(valor)=>this.changePrecio((+e[0]),valor)}/>
                      </div>
                      */}

                    {/*<div className='col-2-input'>
                        <SimpleInput type={item.precio_unidad==='igualdad'?'block':'float'} title='Precio enlace 3 (IVA)'  text={this.state.precio_unidad==='igualdad'?precio_unidad:item.precio || item.precio===''?item.precio:precio_unidad} changeValue={(valor)=>this.changePrecio((+e[0]),valor)}/>
                        <SimpleInput type={item.precio_unidad==='igualdad'?'block':'float'} title='Precio enlace 4 (IVA)'  text={this.state.precio_unidad==='igualdad'?precio_unidad:item.precio || item.precio===''?item.precio:precio_unidad} changeValue={(valor)=>this.changePrecio((+e[0]),valor)}/>
                      </div>
                      */}


                  </div>
                )
              })

              :
              <div className='blank-div-enlaces-new'></div>
            }

            <div className='btns-finalizar-add-medios-paid'>

              <div className="btn-cancelar-confirm" onClick={(e) => { e.stopPropagation(); this.props.close(); }}>Cancelar</div>
              <div className="btn-aceptar-confirm" onClick={() => this.gurdarEnlaces()}>Guardar</div>

            </div>


          </div>




        </div>


      </div>
    )
  }
}

function mapStateToProps(state) { return { empleados: state.empleados, plataformas: state.linkbuilding.medios.tipos.paid.plataformas, empleado: state.empleado, medio_seleccionado: state.linkbuilding.medios.tipos.paid.medio_seleccionado, } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(NuevosEnlaces);
