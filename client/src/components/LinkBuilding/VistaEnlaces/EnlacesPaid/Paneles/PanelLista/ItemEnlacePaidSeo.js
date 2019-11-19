import React, { Component } from 'react';
import * as functions from '../../../../../Global/functions'
import PopUpLista from '../../../../../Global/Popups/ListaOpciones'
import ListaMediosDisponibles from './ListaMediosDisponibles'
import InputPopUp from '../../../../../Global/Popups/InputPopUp'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setPopUpInfo, selectMedioMediosGratuitos, setPanelMediosFreeLinkbuilding } from '../../../../../../redux/actions';
import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();
class ItemEnlacePaidSeo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_categorias: false,
      show_medios: false,
      show_enlace: false,
      show_destinos: false,
      show_micronichos: false,
      show_venta: false,

      medios_disponibles: {},
      destinos_disponibles: {}, id_destino_selected: false,
      anchors_disponibles: {}, id_anchor_selected: false,
      micronichos_disponibles: {},
      destinosRepetidos:[]

    };
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.bloqueado) {
      this.setState({
        show_categorias: false,
        show_medios: false,
        show_enlace: false,
        show_destinos: false,
        show_micronichos: false,
        show_venta: false,
      })
    }
  }



  clickLink = (e) => {
    e.preventDefault();
  }

  //Medio----------
  openMedios = (editable, done_by) => {
    if (this.props.bloqueado) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Este cliente lo esta editando otro empleado' })
      return false;
    }
    if (this.props.enlace.enlace) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Para editar el medio debes eliminar el enlace' })

      return false;
    }

    if (this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.activo && !this.props.enlace.micronicho) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Debes seleccionar un micronicho antes' })

      return false
    }

    if (!editable) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: `Permiso exclusivo para los Super Administradores${done_by ? ' y ' + done_by : ''}` })

      return false;
    }
    this.setState({ show_medios: true })
  }
  seleccionarMedio = (enlace, disponibilidad) => {
    if (disponibilidad === 'nodisponible') {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No puedes seleccioar este enlace' })

      return false
    }

    var multiPath = {}, medio_usado = {}, pathMediosUsados = '', medioEnUso = false;

    //si tiene micronichos cambiaremos la ruta para que se guarde todo en su sitio **********************************************************************************************
    if (this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.activo && this.props.enlace.micronicho !== 'home') {

      if (this.props.enlace.id_medio) {
        medio_usado = this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs[this.props.enlace.micronicho]['medios_usados'][this.props.enlace.id_medio];
      }
      pathMediosUsados = `Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/micronichos/webs/${this.props.enlace.micronicho}/medios_usados`
      try {
        medioEnUso = this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs[this.props.enlace.micronicho].medios_usados[enlace.id_medio]
      } catch (e) { }
    } else {

      if (this.props.enlace.id_medio) {
        medio_usado = this.props.cliente_seleccionado.servicios.linkbuilding.paid.home['medios_usados_follows'][this.props.enlace.id_medio];
      }
      pathMediosUsados = `Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/medios_usados_follows`
      try {
        medioEnUso = this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.medios_usados_follows[enlace.id_medio]
      } catch (e) { }
    }
    //*************************************************************************************************************************************************************************

    //tenemos que revertir cambios si se selecciona otro medio
    if (this.props.enlace.id_medio) {
      if (enlace.id_enlace === this.props.enlace.id_enlace_comprado) {
        this.setState({ show_medios: false })
        return false
      }
      //si se cambia de medio y ya habia un enlace hecho, se borrará el enlace y el done_by
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/enlace`] = null
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/done_by`] = null

      if (this.props.enlace.id_compartido || this.props.enlace.id_compartido === 0) {
        multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.enlace.id_medio}/enlaces/${this.props.enlace.id_enlace_comprado}/mini_enlaces/${this.props.enlace.id_compartido}/id_cliente`] = null
        multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.enlace.id_medio}/enlaces/${this.props.enlace.id_enlace_comprado}/mini_enlaces/${this.props.enlace.id_compartido}/fecha_selected`] = null
        multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.enlace.id_medio}/enlaces/${this.props.enlace.id_enlace_comprado}/mini_enlaces/${this.props.enlace.id_compartido}/micronicho`] = null
      }

      multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.enlace.id_medio}/enlaces/${this.props.enlace.id_enlace_comprado}/id_cliente`] = null
      multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.enlace.id_medio}/enlaces/${this.props.enlace.id_enlace_comprado}/fecha_selected`] = null


      //var medio_usado = this.props.cliente_seleccionado.servicios.linkbuilding.paid.home['medios_usados_follows'][this.props.enlace.id_medio];
      if (medio_usado.fechas && Object.keys(medio_usado.fechas).length === 1 && medio_usado.fechas[this.props.fecha]) {
        //si no se ha repetido este medio eliminaremos todos de los medios disponibles
        multiPath[`${pathMediosUsados}/${this.props.enlace.id_medio}`] = null
      } else if (medio_usado.fechas && Object.keys(medio_usado.fechas).length > 1 && medio_usado.fechas[this.props.fecha]) {
        //si se ha repetido este medio solo eliminaremos la fecha de este mes
        multiPath[`${pathMediosUsados}/${this.props.enlace.id_medio}/fechas/${this.props.fecha}`] = null
      }
    }

    //agregamos el medio a los medios usados------------------------------------------------------------------------------------------------------------------------------------------------------------
    if (medioEnUso) {
      multiPath[`${pathMediosUsados}/${enlace.id_medio}/fechas/${this.props.fecha}`] = true
    } else {
      multiPath[`${pathMediosUsados}/${enlace.id_medio}`] = { tipo: 'sin_oferta', id_medio: enlace.id_medio, fechas: { [this.props.fecha]: true } }
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    //añadimos id_cliente y fecha_selected al enlace comprado----------------------------------------------------------------------------------------------------------------------------------------------------
    var precioCompartido = false
    if (enlace.mini_enlaces) {// si existe mini_enlaces significa que el enlace es compartido
      var new_mini_enlaces = enlace.mini_enlaces
      //asginamos el id del cliente a el enlace compartido
      new_mini_enlaces.find((e, i) => {
        if (!e.id_cliente) {
          precioCompartido = e.precio
          new_mini_enlaces[i].id_cliente = this.props.cliente_seleccionado.id_cliente;
          new_mini_enlaces[i].fecha_selected = functions.getNow();
          new_mini_enlaces[i].micronicho = this.props.enlace.micronicho ? this.props.enlace.micronicho : null;
          multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/id_compartido`] = i
          multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/precio`] = e.precio
          return true
        }
        return false
      })
      multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${enlace.id_medio}/enlaces/${enlace.id_enlace}/mini_enlaces`] = new_mini_enlaces


      var disponible = new_mini_enlaces.some((e, i) => { return !e.id_cliente })
      if (!disponible) {
        multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${enlace.id_medio}/enlaces/${enlace.id_enlace}/id_cliente`] = true
        multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${enlace.id_medio}/enlaces/${enlace.id_enlace}/fecha_selected`] = functions.getNow()
      }

    } else {
      multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${enlace.id_medio}/enlaces/${enlace.id_enlace}/id_cliente`] = this.props.cliente_seleccionado.id_cliente
      multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${enlace.id_medio}/enlaces/${enlace.id_enlace}/fecha_selected`] = functions.getNow()

      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/id_compartido`] = null
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //añadimos el medio y demas datos al enlace hecho en este cliente en este mes
    if (!enlace.mini_enlaces) { multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/precio`] = enlace.precio }
    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/id_medio`] = enlace.id_medio

    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/tipo`] = 'sin_oferta';
    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/id_enlace_comprado`] = enlace.id_enlace

    //si el enlace ya tenia un precio, hay que sumarle el precio anterior y quitar el nuevo al bote
    var bote = this.props.cliente_seleccionado.servicios.linkbuilding.paid.enlaces_por_seo.bote
    if (this.props.enlace.precio) {
      bote = bote + this.props.enlace.precio
    }
    if (precioCompartido || precioCompartido === 0) {//si es un enlace compartido se sumara la parte proorcional de ese enlace
      bote = bote - precioCompartido
    } else {
      bote = bote - enlace.precio
    }
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/enlaces_por_seo/bote`] = (+bote)
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/enlaces_por_seo/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}`] = true


    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
        this.setState({ show_medios: false })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })


  }
  eliminarMedio = (precioVentaEnlace) => {
    var multiPath = {}, medio_usado = {}, pathMediosUsados = ''
    //si tiene micronichos cambiaremos la ruta para que se guarde todo en su sitio **********************************************************************************************
    if (this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.activo && this.props.enlace.micronicho !== 'home') {

      if (this.props.enlace.id_medio) {
        medio_usado = this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs[this.props.enlace.micronicho]['medios_usados'][this.props.enlace.id_medio];
      }
      pathMediosUsados = `Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/micronichos/webs/${this.props.enlace.micronicho}/medios_usados`
    } else {

      if (this.props.enlace.id_medio) {
        medio_usado = this.props.cliente_seleccionado.servicios.linkbuilding.paid.home['medios_usados_follows'][this.props.enlace.id_medio];
      }
      pathMediosUsados = `Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/medios_usados_follows`
    }
    //si se cambia de medio y ya habia un enlace hecho, se borrará el enlace y el done_by
    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/enlace`] = null
    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/done_by`] = null

    if (this.props.enlace.id_compartido || this.props.enlace.id_compartido === 0) {
      multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.enlace.id_medio}/enlaces/${this.props.enlace.id_enlace_comprado}/mini_enlaces/${this.props.enlace.id_compartido}/id_cliente`] = null
      multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.enlace.id_medio}/enlaces/${this.props.enlace.id_enlace_comprado}/mini_enlaces/${this.props.enlace.id_compartido}/fecha_selected`] = null
      multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.enlace.id_medio}/enlaces/${this.props.enlace.id_enlace_comprado}/mini_enlaces/${this.props.enlace.id_compartido}/micronicho`] = null
    }

    multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.enlace.id_medio}/enlaces/${this.props.enlace.id_enlace_comprado}/id_cliente`] = null
    multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.enlace.id_medio}/enlaces/${this.props.enlace.id_enlace_comprado}/fecha_selected`] = null


    //var medio_usado = this.props.cliente_seleccionado.servicios.linkbuilding.paid.home['medios_usados_follows'][this.props.enlace.id_medio];
    if (medio_usado.fechas && Object.keys(medio_usado.fechas).length === 1 && medio_usado.fechas[this.props.fecha]) {
      //si no se ha repetido este medio eliminaremos todos de los medios disponibles
      multiPath[`${pathMediosUsados}/${this.props.enlace.id_medio}`] = null
    } else if (medio_usado.fechas && Object.keys(medio_usado.fechas).length > 1 && medio_usado.fechas[this.props.fecha]) {
      //si se ha repetido este medio solo eliminaremos la fecha de este mes
      multiPath[`${pathMediosUsados}/${this.props.enlace.id_medio}/fechas/${this.props.fecha}`] = null
    }

    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/precio`] = null
    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/id_medio`] = null

    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/tipo`] = null
    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/id_enlace_comprado`] = null


    var bote = this.props.cliente_seleccionado.servicios.linkbuilding.paid.enlaces_por_seo.bote
    //bote = bote + this.props.enlace.precio
    //multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/bote`]=(+bote)

    if (this.props.enlace.precio_fijo) {
      bote = bote + this.props.enlace.precio_proporcionado;
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${this.props.fecha}/presupuestado_aparte/${this.props.enlace.id_enlace}`] = null
    } else if (!this.props.enlace.precio_fijo && this.props.enlace.fixed_price) {
      bote = bote + this.props.enlace.precio + (this.props.enlace.fixed_price - precioVentaEnlace)
    } else {
      bote = bote + this.props.enlace.precio
    }
    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/fixed_price`] = null
    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/precio_fijo`] = null
    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/precio_proporcionado`] = null
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/enlaces_por_seo/bote`] = (+bote)
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/enlaces_por_seo/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}`] = null

    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })

  }
  guardarPrecioVenta = (new_precio, precio_fijo, old_precio) => {

    var bote = this.props.cliente_seleccionado.servicios.linkbuilding.paid.enlaces_por_seo.bote;
    var diferencia = 0;

    var multiPath = {}
    if ((functions.getDecimcals(new_precio) === functions.getDecimcals(old_precio) || new_precio.toString().trim() === '') && !precio_fijo) {
      // si entra en este if significa que quitaremos cualquier precio fijado anteriormente
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/fixed_price`] = null
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/precio_fijo`] = null
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/precio_proporcionado`] = null
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${this.props.fecha}/presupuestado_aparte/${this.props.enlace.id_enlace}`] = null
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${this.props.fecha}/subida_precios/${this.props.enlace.id_enlace}`] = null

      new_precio = (+new_precio)

      if (this.props.enlace.precio_fijo) {
        bote = bote + this.props.enlace.precio_proporcionado;

      } else if (!this.props.enlace.precio_fijo && this.props.enlace.fixed_price) {
        bote = bote + this.props.enlace.precio + (this.props.enlace.fixed_price - old_precio)
      } else {
        bote = bote + this.props.enlace.precio
      }

      bote = bote - this.props.enlace.precio

      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/enlaces_por_seo/bote`] = (+bote)


      //sumar o restar al bote lo anterior

    } else {
      var precioSinComision = false;
      diferencia = false;
      if (this.props.enlace.precio_fijo) {
        bote = bote + this.props.enlace.precio_proporcionado;
      } else if (!this.props.enlace.precio_fijo && this.props.enlace.fixed_price) {
        bote = bote + this.props.enlace.precio + (this.props.enlace.fixed_price - old_precio)
      } else {
        bote = bote + this.props.enlace.precio
      }

      if (precio_fijo) {
        if (new_precio.toString().trim() === '') new_precio = functions.getDecimcals(this.props.enlace.precio * ((100 + this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[this.props.fecha].beneficio) / 100));
        //si se ha seleccionado precio proporcionado debemos sacar el porcentaje de ese precio y restarselo al bote
        precioSinComision = (+new_precio) * ((100 - this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[this.props.fecha].beneficio) / 100);
        bote = bote - precioSinComision;
        multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/precio_proporcionado`] = (+precioSinComision)
      } else {
        diferencia = (+new_precio) - old_precio;
        bote = bote - this.props.enlace.precio - diferencia;
        multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/precio_proporcionado`] = (+this.props.enlace.precio)
      }


      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/fixed_price`] = (+new_precio)
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/precio_fijo`] = precio_fijo ? precio_fijo : null

      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${this.props.fecha}/presupuestado_aparte/${this.props.enlace.id_enlace}`] = precioSinComision ? (+new_precio) : null
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${this.props.fecha}/subida_precios/${this.props.enlace.id_enlace}`] = !precioSinComision && diferencia ? (+diferencia) : null

      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/enlaces_por_seo/bote`] = (+bote)

    }
    if (Object.keys(multiPath).length > 0) {
      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })

    }

  }

  //Micronichos
  openMicronichos = (editable, done_by) => {
    if (this.props.bloqueado) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Este cliente lo esta editando otro empleado' })

      return false;
    }
    if (this.props.enlace.id_medio) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Para editar el micronicho debes eliminar el medio' })

      return false;
    }

    if (!editable) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: `Permiso exclusivo para los Super Administradores${done_by ? ' y ' + done_by : ''}` })

      return false;
    }
    var micronichos_disponibles = {}


    micronichos_disponibles.home = {
      valor: this.props.cliente_seleccionado.web,
    }

    try {
      var micronichos = this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs;
      Object.entries(micronichos).forEach(([k, d]) => {
        if (d.activo) {
          micronichos_disponibles[k] = { valor: d.web }
        }
      })
    } catch (e) { }
    this.setState({ micronichos_disponibles, show_micronichos: true })
  }
  seleccionarMicronicho = (id_micronicho, obj) => {

    if (this.props.enlace.id_medio) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Debes elimiar el medio para poder cambiar el micronicho' })
      return false;
    }

    var multiPath = {};

    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/micronicho`] = id_micronicho
    if (Object.entries(multiPath).length > 0) {

      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
          this.setState({ id_destino_selected: false })
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })
    }

  }

  //Destinos---------
  openDestinos = (editable, done_by) => {
    if (this.props.bloqueado) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: `Este cliente lo esta editando otro empleado` })

      return false;
    }
    if (!editable) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: `Permiso exclusivo para los Super Administradores${done_by ? ' y ' + done_by : ''}` })

      return false;
    }

    var destinos_disponibles = {}, id_destino_selected = false;

    var destinosDisponibles = {}
    //crear destinos disponibles y que no se repitan
    console.log(this.props);

    var estrategia = this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.estrategia

    if(estrategia && estrategia.urls){
      Object.entries(estrategia.urls).forEach(([i,url])=>{
        var repetidas = Object.entries(this.props.enlaces).filter(([k,e])=>e.destino && url.url===e.destino)
        if(repetidas.length<2 || (this.props.enlace.destino && functions.cleanProtocolo(this.props.enlace.destino)===functions.cleanProtocolo(url.url))){
          destinosDisponibles[i]={ valor: url.url }
        }
        if(this.props.enlace.destino && functions.cleanProtocolo(url.url)===functions.cleanProtocolo(this.props.enlace.destino)){
          id_destino_selected = i
        }
      })
    }

    var destinosRepetidos = []
    //crear array de repetidos para no añadirlos como un enlace nuevo
    Object.entries(this.props.enlaces).forEach(([i,enlace])=>{
      if(enlace.destino){
        var repetidos = Object.entries(this.props.enlaces).filter(([j,e])=>{return e.destino && functions.cleanProtocolo(e.destino)===functions.cleanProtocolo(enlace.destino) && !destinosRepetidos.includes(functions.cleanProtocolo(enlace.destino)) })
        if(repetidos.length>=2){
          destinosRepetidos.push(functions.cleanProtocolo(enlace.destino))
        }
      }
    })

    /*
    if (this.props.enlace.destino && functions.cleanProtocolo(this.props.cliente_seleccionado.web) === functions.cleanProtocolo(this.props.enlace.destino)) {
      id_destino_selected = 'home'
    }

    destinos_disponibles.home = {
      valor: this.props.cliente_seleccionado.web,
    }

    try {
      var destinos = this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.destinos;
      Object.entries(destinos).forEach(([k, d]) => {

        if (this.props.enlace.destino && functions.cleanProtocolo(d.web) === functions.cleanProtocolo(this.props.enlace.destino)) {
          id_destino_selected = k
        }

        destinos_disponibles[k] = { valor: d.web }

      })
    } catch (e) { }
    */

    this.setState({ destinos_disponibles: destinosDisponibles, id_destino_selected, show_destinos: true, destinosRepetidos })

  }
  seleccionarDestino = (id_medio, obj) => {
    var multiPath = {};

    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/destino`] = obj.valor
    if (Object.entries(multiPath).length > 0) {

      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
          this.setState({ id_destino_selected: false })
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })
    }
  }
  //Anchors
  openAnchors = (editable, done_by) => {
    if (this.props.bloqueado) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Este cliente lo esta editando otro empleado' })

      return false;
    }
    if (!editable) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: `Permiso exclusivo para los Super Administradores${done_by ? ' y ' + done_by : ''}` })

      return false;
    }

    var anchors_disponibles = {}, id_anchor_selected = false, achorsDisponibles= {};

    var estrategia = this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.estrategia

    if(estrategia && estrategia.urls && this.props.enlace.destino){
      var keywords = Object.entries(estrategia.urls).find(([i,u])=>functions.cleanProtocolo(u.url)===functions.cleanProtocolo(this.props.enlace.destino))
      
      if(keywords && keywords[1].keywords){
        keywords = keywords[1].keywords
        Object.entries(keywords).forEach(([i,keyword])=>{
          if (this.props.enlace.anchor && keyword.keyword.toLowerCase() === this.props.enlace.anchor.toLowerCase()) {
            id_anchor_selected = i
          }
          achorsDisponibles[i]={valor:keyword.keyword}
        })
      }
    }
    this.setState({ anchors_disponibles:achorsDisponibles, id_anchor_selected, show_anchors: true })
  }
  seleccionarAnchor = (id_anchor, obj) => {
    var multiPath = {};

    multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/anchor`] = obj.valor
    if (Object.entries(multiPath).length > 0) {
      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
          this.setState({ id_destino_selected: false })
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })
    }
  }
  //------------------
  //Enlace ---------
  openEnlace = (editable, done_by) => {
    if (this.props.bloqueado) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Este cliente lo esta editando otro empleado' })
      return false;
    }
    if (!editable) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: `Permiso exclusivo para los Super Administradores${done_by ? ' y ' + done_by : ''}` })
      return false;
    }

    if (this.props.enlace.id_medio) {
      this.setState({ show_enlace: true })
    } else {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Tienes que seleccionar un medio' })
    }

  }
  guardarEnlace = (link) => {
    var multiPath = {}
    if (link.trim() === '') {
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/enlace`] = null
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/done_by`] = null
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${this.props.fecha}/empleados/${this.props.enlace.done_by}/${this.props.enlace.tipo === 'follow' ? 'enlaces_follows' : 'enlaces_nofollows'}/${this.props.enlace.id_enlace}`] = null
    } else {
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/enlace`] = link
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/done_by`] = this.props.empleado.id_empleado
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${this.props.fecha}/empleados/${this.props.empleado.id_empleado}/${this.props.enlace.tipo === 'follow' ? 'enlaces_follows' : 'enlaces_nofollows'}/${this.props.enlace.id_enlace}`] = true
    }
    if (Object.entries(multiPath).length > 0) {
      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })
    }
  }
  //-----------------
  //Precio venta enlace
  openPrecioVenta = (editable, done_by) => {
    if (this.props.bloqueado) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })

      return false;
    }
    if (!editable) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: `Permiso exclusivo para los Super Administradores${done_by ? ' y ' + done_by : ''}` })

      return false;
    }

    if (this.props.enlace.id_medio) {
      this.setState({ show_venta: true })
    } else {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Tienes que seleccionar un medio' })

    }

  }

  //-------

  eliminar = (id) => {
    var multiPath = {}
    if (id === 'destino') {
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/destino`] = null
    }
    else if (id === 'anchor') {
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/anchor`] = null
    }
    else if (id === 'micronicho') {
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/micronicho`] = null
    }

    if (Object.entries(multiPath).length > 0) {
      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
          if (id === 'destino') {
            this.setState({ id_destino_selected: false, show_destinos:false })
          } else if (id === 'anchor') {
            this.setState({ id_anchor_selected: false, show_anchors:false })
          }
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })
    }

  }

  guardarNew = (id, text) => {
    var multiPath = {}
    if (id === 'destino') {
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/destino`] = text.trim()
    } else if (id === 'anchor') {
      multiPath[`Servicios/Linkbuilding/Paid/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.props.fecha}/enlaces/${this.props.enlace.id_enlace}/anchor`] = text.trim() !== '' ? text.trim() : null
    }

    if (Object.entries(multiPath).length > 0) {
      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
          if (id === 'destino') {
            this.setState({ id_destino_selected: false })
          } else if (id === 'anchor') {
            this.setState({ id_anchor_selected: false })
          }
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
        })
    }
  }

  getStatus = () => {
    var enlace = this.props.enlace, i = 0;
    if (enlace.anchor) i++;
    if (enlace.categoria) i++;
    if (enlace.destino) i++;
    if (enlace.enlace) i++;
    if (enlace.id_medio) i++;

    if (enlace.status && enlace.status.includes('Error')) {
      return 'error'
    } else {
      if (enlace.enlace) {
        return 'done'
      } else if (i > 1 && i < 5) {
        return 'warning'
      }
    }
    return 'new'
  }

  render() {
    var enlace = this.props.enlace;

    var medio = enlace.id_medio ? this.props.medios[enlace.id_medio].web : false
    var editable = !enlace.done_by || this.props.empleado.id_empleado === enlace.done_by || this.props.empleado.role === 'Super Administrador';
    var done_by = enlace.done_by ? this.props.empleados[enlace.done_by].nombre : false;
    var status = this.getStatus()

    var empleado = ''
    try {
      if (this.props.empleados) {
        if (enlace.done_by) {
          empleado = this.props.empleados[enlace.done_by].nombre
        } else { empleado = this.props.empleados[enlace.id_empleado].nombre }
      }
    } catch (e) {

    }



    var
      beneficio = '-', beneficioCliente = 0,
      precioVentaEnlace = enlace.precio ? functions.calcularPrecioVenta(enlace.precio, beneficioCliente) : '-'
    //try {precioVentaEnlace = enlace.precio ?this.calcularPrecioVenta(enlace.precio,beneficioCliente)  : '-'} catch (e) {}
    try {
      //var beneficioPorcentaje = (+this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[this.props.fecha].beneficio/100);
      if (enlace.fixed_price && enlace.precio_fijo) {
        beneficio = enlace.precio ? (+enlace.fixed_price) - (+enlace.precio) : '-'
      } else if (enlace.fixed_price) {
        beneficio = enlace.precio ? ((+enlace.fixed_price) - precioVentaEnlace) + (precioVentaEnlace - (+enlace.precio)) : '-'
      } else {
        beneficio = enlace.precio ? precioVentaEnlace - (+enlace.precio) : '-'

      }

    } catch (e) { }

    var micronicho = false

    try {
      if (enlace.micronicho && this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.activo) {
        if (enlace.micronicho === 'home') {
          micronicho = this.props.cliente_seleccionado.web
        } else {
          micronicho = this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs[enlace.micronicho].web
        }
      }
    } catch (e) { }




    return (
      <tr>

        {/*this.props.clientes_edit && this.props.clientes_edit.activo?

          <td className={`lb-enlaces-free-checkbox`} >
            <CheckBox _class={`checkbox-in-table ${!permiso_edit?'no-selecionable':''}`} checked={!this.props.clientes_edit.seleccionados[this.props.cliente.id_cliente]?false:this.props.clientes_edit.seleccionados[this.props.cliente.id_cliente].checked } changeValue={value=>this.updateCheckBox(value)}/>
          </td>

          :null
        */}

        <td className='lb-enlaces-paid-status'>
          <div className={`status-point ${status === 'done' ? 'good-status' : ''} ${status === 'warning' ? 'warning-status' : ''} ${status === 'new' ? 'normal-status' : ''} ${status === 'error' ? 'wrong-status' : ''}      `} ></div>
        </td>

        <td className='lb-enlaces-paid-empleado block-with-text'>
          <span>{enlace.id_empleado}</span>
        </td>

        {this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.activo ?
          <td className='lb-enlaces-paid-medio pr' onClick={() => this.openMicronichos(editable, done_by)}>
            <span className="span_edit">
              <a href={micronicho ? micronicho : '# '} onClick={(e) => { this.clickLink(e) }} className={`break_sentence ${micronicho ? '' : 'text_inactivo'}`} >{micronicho ? micronicho : 'Selecciona el micronicho'}</a>
              {editable ? <i className="material-icons span_i_edit_input idit_icon icon_seleccionable">arrow_drop_down</i> : null}

              {this.state.show_micronichos ?
                <PopUpLista
                  cerrarClick={true}
                  cleanLink={false}
                  opcionEliminar={enlace.micronicho ? true : false}
                  title_eliminar='eliminar'
                  selectOpcion={(id_micronicho, obj) => this.seleccionarMicronicho(id_micronicho, obj)}
                  opcion_selected={enlace.micronicho ? enlace.micronicho : false}
                  opciones={this.state.micronichos_disponibles} title='Micronichos'
                  _class='rigth-popup-enlaces'
                  _class_div={`max-width min-width-305 ${enlace.micronicho ? 'padding-delete-pop-up' : ''}`}
                  _class_container='size-medios-popup scroll-bar-exterior'
                  _class_new={'new-item-enlaces'}
                  close={() => this.setState({ show_micronichos: false })}
                  tag='a'
                  obligacion='link'
                  eliminar={() => { this.eliminar('micronicho') }}
                />
                : null}

            </span>
          </td>
          : null}

        <td className='lb-enlaces-paid-medio pr' onClick={() => this.openMedios(editable, done_by)}>
          <span className="span_edit">
            <a href={medio ? medio : '# '} onClick={(e) => { this.clickLink(e) }} className={`break_sentence ${medio ? '' : 'text_inactivo'}`}>{medio ? medio : 'Selecciona un medio'}</a>
            {editable && enlace.id_medio ?
              <i className="material-icons span_i_edit_input idit_icon icon_seleccionable pdd-left-5">notes</i>
              : null}

            {editable ? <i className="material-icons span_i_edit_input idit_icon icon_seleccionable">arrow_drop_down</i> : null}
            {this.state.show_medios ?
              <ListaMediosDisponibles
                bote={this.props.cliente_seleccionado.servicios.linkbuilding.paid.enlaces_por_seo.bote}
                enlace={enlace}
                cerrarClick={true}
                cleanLink={true}
                opcionEliminar={enlace.id_medio ? true : false}
                inversionMensualString={0}
                title_eliminar='eliminar'
                placeholder_buscar={'Buscar medio'}
                selectOpcion={(enlace, disponibilidad) => this.seleccionarMedio(enlace, disponibilidad)}
                opcion_selected={enlace.id_medio}
                opciones={this.state.medios_disponibles} title='Medios disponibles'
                _class='rigth-popup-enlaces'
                _class_div={`max-width min-width-305 ${enlace.id_medio ? 'padding-delete-pop-up' : ''}`}
                _class_container='size-medios-popup scroll-bar-exterior'
                close={() => this.setState({ show_medios: false })}
                eliminar={() => { this.eliminarMedio(precioVentaEnlace) }}
                tag='a' buscar={true} />
              : null}
          </span>
        </td>

        <td className='lb-enlaces-paid-destino pr' onClick={() => this.openDestinos(editable, done_by)}>
          <span className="span_edit">
            <a href={enlace.destino ? enlace.destino : '# '} onClick={(e) => { this.clickLink(e) }} className={`break_sentence ${enlace.destino ? '' : 'text_inactivo'}`} >{enlace.destino ? enlace.destino : 'Introduce el destino del enlace'}</a>
            {editable ? <i className="material-icons span_i_edit_input idit_icon icon_seleccionable">arrow_drop_down</i> : null}

            {this.state.show_destinos ?
              <PopUpLista
                cerrarClick={true}
                cleanLink={false}
                opcionEliminar={enlace.destino ? true : false}
                placeholder_new={'Introduce un destino'}
                title_eliminar='eliminar'
                selectOpcion={(id_medio, obj) => this.seleccionarDestino(id_medio, obj)}
                opcion_selected={this.state.id_destino_selected}
                opciones={this.state.destinos_disponibles} title='Destinos'
                _class='rigth-popup-enlaces'
                _class_div={`max-width min-width-305 ${enlace.destino ? 'padding-delete-pop-up' : ''}`}
                _class_container='size-medios-popup scroll-bar-exterior'
                _class_new={'new-item-enlaces'}
                close={() => this.setState({ show_destinos: false })}
                search_new={!enlace.destino ? '' : this.state.id_destino_selected ? '' : enlace.destino}
                tag='a'
                obligacion='link'
                eliminar={() => { this.eliminar('destino') }}
                guardarNew={(txt) => { this.guardarNew('destino', txt) }}
                new={true}
              />
              : null}

          </span>
        </td>

        <td className='lb-enlaces-paid-anchor pr' onClick={() => this.openAnchors(editable, done_by)}>
          <span className="span_edit">
            <a href={enlace.anchor ? enlace.anchor : '# '} onClick={(e) => { this.clickLink(e) }} className={`break_sentence ${enlace.anchor ? '' : 'text_inactivo'}`} >{enlace.anchor ? enlace.anchor : 'Introduce el anchor del enlace'}</a>
            {editable ? <i className="material-icons span_i_edit_input idit_icon icon_seleccionable">arrow_drop_down</i> : null}

            {this.state.show_anchors ?
              Object.keys(this.state.anchors_disponibles).length > 0 ?
                <PopUpLista
                  cerrarClick={true}
                  cleanLink={false}
                  opcionEliminar={enlace.anchor ? true : false}
                  placeholder_new={'Introduce un anchor'}
                  title_eliminar='eliminar'
                  selectOpcion={(id_anchor, obj) => this.seleccionarAnchor(id_anchor, obj)}
                  opcion_selected={this.state.id_anchor_selected}
                  opciones={this.state.anchors_disponibles} title='Anchors'
                  _class='rigth-popup-enlaces'
                  _class_div={`max-width min-width-305 ${enlace.anchor ? 'padding-delete-pop-up' : ''}`}
                  _class_container='size-medios-popup scroll-bar-exterior'
                  _class_new={'new-item-enlaces'}
                  close={() => this.setState({ show_anchors: false })}
                  search_new={!enlace.anchor ? '' : this.state.id_anchor_selected ? '' : enlace.anchor}
                  tag='a'
                  //obligacion='link'
                  eliminar={() => { this.eliminar('anchor') }}
                  guardarNew={(txt) => { this.guardarNew('anchor', txt) }}
                  new={true}
                />
                :
                <InputPopUp
                  cerrarClick={true}
                  title={'Anchor'}
                  _class='rigth-popup-enlaces'
                  tipo='text'
                  obligacion='text'
                  valor={enlace.anchor ? enlace.anchor : ''}
                  placeholder={'Introduce el anchor'}
                  guardarValor={(text) => { this.guardarNew('anchor', text) }}
                  close={() => this.setState({ show_anchors: false })}

                />
              : null}

          </span>
        </td>

        <td className='lb-enlaces-paid-enlace pr' onClick={() => this.openEnlace(editable, done_by)}>
          <span className="span_edit">
            <a href={enlace.enlace} onClick={(e) => { this.clickLink(e) }} className={`break_sentence ${enlace.enlace ? '' : 'text_inactivo'}`}>{enlace.enlace ? enlace.enlace : 'Introduce el enlace generado'}</a>
            {editable ? <i className="material-icons span_i_edit_input idit_icon icon_seleccionable">arrow_drop_down</i> : null}

            {this.state.show_enlace ?
              <InputPopUp
                cerrarClick={true}
                title={'Enlace'}
                _class='rigth-popup-enlaces'
                tipo='text'
                obligacion='link'
                valor={enlace.enlace ? enlace.enlace : ''}
                placeholder={'Enlace con http:// o https://'}
                guardarValor={(text) => { this.guardarEnlace(text) }}
                close={() => this.setState({ show_enlace: false })}

              />
              : null}

          </span>
        </td>

        {/*<td  className='lb-enlaces-paid-tipo block-with-text'>
          <i className={`material-icons align-center ${enlace.tipo==='follow'?'color-azul':'color-wrong'}`}> link </i>
        </td>
        */}

        <td className='lb-enlaces-paid-compra-iva block-with-text'>
          <span>{enlace.precio ? functions.getDecimcals(enlace.precio * 1.21) + ' €' : '-'}</span>
        </td>

        <td className='lb-enlaces-paid-compra block-with-text'>
          <span>{enlace.precio ? functions.getDecimcals(enlace.precio) + ' €' : '-'}</span>
        </td>

        <td className='lb-enlaces-paid-venta pr' onClick={() => this.openPrecioVenta(editable, done_by)}>
          <span className={`${enlace.fixed_price ? 'color-new' : ''}`}>{

            enlace.fixed_price ?
              functions.getDecimcals(enlace.fixed_price) + ' €'
              :
              precioVentaEnlace !== '-' ? functions.getDecimcals(precioVentaEnlace) + ' €' : '-'}


          </span>

          {this.state.show_venta ?
            <InputPopUp
              cerrarClick={true}
              title={'Precio de venta'}
              _class='rigth-popup-enlaces pop-up-precio-venta'
              tipo='float'
              valor={enlace.fixed_price ? functions.getDecimcals(enlace.fixed_price) : functions.getDecimcals(precioVentaEnlace)}
              placeholder={'El mínimo es ' + functions.getDecimcals(precioVentaEnlace) + ' €'}
              placeholder_fijo={'El mínimo es ' + functions.getDecimcals(enlace.precio) + ' €'}
              guardarValor={(newPrecio, precio_fijo) => { this.guardarPrecioVenta(newPrecio, precio_fijo, precioVentaEnlace) }}
              checkbox={false}
              checkbox_value={enlace.precio_fijo ? true : false}
              text_checkbox={'Presupuestado aparte: '}
              force={'cambiar_precio_venta'}
              close={() => this.setState({ show_venta: false })}
              neverLess={functions.getDecimcals(precioVentaEnlace)}
              neverLess_fijo={functions.getDecimcals(enlace.precio)}

            />
            : null}

        </td>

        <td className='lb-enlaces-paid-beneficio block-with-text'>
          <span>{beneficio !== '-' ? functions.getDecimcals(beneficio) + ' €' : beneficio}</span>
        </td>

        <td onClick={() => { this.seleccionarMedio() }} className='lb-enlaces-paid-more'>
          <i className="material-icons align-center">chevron_right</i>
        </td>
      </tr>

    )
  }
}

function mapStateToProps(state) { return { cliente_seleccionado: state.cliente_seleccionado, medios: state.linkbuilding.medios.tipos.paid.medios, empleados: state.empleados, fecha: state.linkbuilding.enlaces.fecha, empleado: state.empleado } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo, selectMedioMediosGratuitos, setPanelMediosFreeLinkbuilding }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemEnlacePaidSeo);
