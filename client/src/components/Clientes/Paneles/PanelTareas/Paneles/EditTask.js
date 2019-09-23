import 'react-quill/dist/quill.snow.css';
import React, { Component } from 'react'
import ContentEditable from "react-contenteditable";

import ReactDOM from 'react-dom'
import SimpleInputDesplegable from '../../../../Global/SimpleInputDesplegableMin'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setOpenNewTask, setEditTask } from '../../../../../redux/actions'
import data from '../../../../Global/Data/Data';
import ItemNewTag from './ItemNewTag'
import ItemNewEmpleado from './ItemNewEmpleado'
import DatePicker from './DatePicker';
import moment from 'moment'
import firebase from '../../../../../firebase/Firebase';
import dotProp from 'dot-prop-immutable';
import _ from 'underscore';
import ReactQuill from 'react-quill';

import $ from 'jquery'
import StarRatingComponent from 'react-star-rating-component';
import Conversacion from './Conversacion'
const df = firebase.firestore();
const db = firebase.database().ref();
class EditTask extends Component {

  constructor(props) {
    super(props)
    this.state = {


      addTag: false,
      addEmpleado: false,


      repetir: data.repetirTask,

      tarea: this.props.tarea,
      en_proceso: this.props.tarea && this.props.tarea.en_proceso?this.props.tarea.en_proceso:{}, //almacenamos el proceso de la tarea 

      estado: this.props.tarea.estado,
      title: this.props.tarea.title,
      descripcion: this.props.tarea.descripcion,
      repeat: this.props.tarea.repetir,
      intervalo: this.props.tarea.intervalo,
      tags: this.props.tarea.tags,
      empleadosSeleccionados: this.props.tarea.empleados ? this.props.tarea.empleados : {},
      empleados:this.props.empleados,
      prioridad: this.props.tarea.prioridad,
      startDate: moment(this.props.tarea.fecha_limite),

      comment: "",



      _class: '',
      _class_content: '',
    }
  }

  shouldComponentUpdate = (newProps,newState) => {
    var update = false;
    if(!_.isEqual(this.state.empleados,newProps.empleados)){
      update = false;
    }
    if(!_.isEqual(this.state.tarea,newProps.tarea)){
      update = true
    }
    if(!_.isEqual(this.state,newState)){
      update = true
    }

    

    return update
  } 

  componentWillReceiveProps = newProps => {
    if (this.state.tarea !== newProps.tarea) {
      this.setState({
        tarea: newProps.tarea,
        en_proceso: newProps.tarea.en_proceso,
        estado: newProps.tarea.estado,
        title: newProps.tarea.title,
        descripcion: newProps.tarea.descripcion,
        prioridad: newProps.tarea.prioridad,
        repeat: newProps.tarea.repetir,
        intervalo: newProps.tarea.intervalo,
        tags: newProps.tarea.tags,
        empleadosSeleccionados: newProps.tarea.empleados ? newProps.tarea.empleados : {},
        startDate: moment(newProps.tarea.fecha_limite),
      })
    }
  }

  saveTags = (text) => {
    var arrayTags = text.split(',');
    var tags = JSON.parse(JSON.stringify(this.state.tags));
    arrayTags.forEach((item, key) => {
      if (item.trim() === '') return null;
      tags.push(item.toLowerCase().trim())
    })
    this.setState({ tags })
  }

  deleteTag = (id) => {
    var tags = dotProp.delete(this.state.tags, id);
    this.setState({ tags })
  }

  selectEmpleado = (index) => {

    var empleadosSeleccionados = dotProp.set(this.state.empleadosSeleccionados, index, true);
    this.setState({ empleadosSeleccionados })
  }

  deleteEmpleado = (index) => {
    var empleadosSeleccionados = JSON.parse(JSON.stringify(this.state.empleadosSeleccionados));
    delete empleadosSeleccionados[index];
    this.setState({empleadosSeleccionados})
  }

  changeFecha = (data) => {
    var { repeat, intervalo, startDate } = data;
    this.setState({
      repeat, intervalo, startDate
    })
  }

  gurdarEnlaces = () => {
    var { descripcion, empleadosSeleccionados, intervalo, prioridad, repeat, startDate, tags, title } = this.state;

    if (intervalo.repeat === repeat) {
      intervalo.valor = intervalo.valor ? intervalo.valor : this.state.repetir[repeat].intervalo ? this.state.repetir[repeat].intervalo[0] : null;
      intervalo.valorExtra = intervalo.valorExtra ? intervalo.valor : this.state.repetir[repeat].dia ? this.state.repetir[repeat].dia[0] : null;
    } else {
      intervalo = null
    }

    var batch = df.batch();

    var id_tarea = df.collection(`Servicios`).doc('Tareas').collection('tareas').doc().id

    var newTask = df.collection(`Servicios`).doc('Tareas').collection('tareas').doc(id_tarea)
    batch.set(newTask,
      {
        id_tarea,
        estado: 'No completado'/*No completado, en proceso, completado*/,
        eliminado: false,
        title,
        descripcion,
        fecha_limite: startDate.format("YYYY-MM-DD"),
        prioridad,
        tags,
        empleados: empleadosSeleccionados,
        id_cliente: this.props.cliente_seleccionado.id_cliente,
        fecha_creacion: moment().format("YYYY-MM-DD"),
        repetir: repeat,
        intervalo,
        creado_por: this.props.empleado.id_empleado,
        //tarea_padre,este atributo existirá cuando se reptita la tarea

      });

    batch.commit().then(function () {

    });

    /*df.update(multipath)
      .then(() => {
        console.log('Ok');
        this.props.setOpenNewTask(false)

      })
      .catch(err => console.log(err))
*/

  }

  undoData = () => {
    this.setState({
      tarea: this.props.tarea,
      en_proceso: this.props.tarea && this.props.tarea.en_proceso? this.props.tarea.en_proceso:{},
      estado: this.props.tarea.estado?this.props.tarea.estado:{},
      title: this.props.tarea.title,
      descripcion: this.props.tarea.descripcion,
      prioridad: this.props.tarea.prioridad,
      repeat: this.props.tarea.repetir,
      intervalo: this.props.tarea.intervalo,
      tags: this.props.tarea.tags,
      empleadosSeleccionados: this.props.tarea.empleados ? this.props.tarea.empleados : {},
      startDate: moment(this.props.tarea.fecha_limite)
    })
  }


  changeDescripcion = (e) => {
    this.setState({ descripcion: e })
  }

  onStarClick(nextValue, prevValue, name) {
    this.setState({ prioridad: nextValue });
  }

  changeTitle = e => {
    var texto = $('<div>'+e.target.value+'</div>').text()
    this.setState({ title: texto });
  };


  /*  */
  saveComment = () => {
    
    if (this.state.comment.trim() !== '') {
      var multipath = {}
      var key = db.child(`Servicios/Tareas/clientes/${this.props.cliente_seleccionado.id_cliente}/tareas/${this.state.tarea.id_tarea}/conversacion`).push().key;
      var path = `Servicios/Tareas/clientes/${this.props.cliente_seleccionado.id_cliente}/tareas/${this.state.tarea.id_tarea}/conversacion/${key}`;
      multipath[path] = {
        type:'msg',
        id_empleado:this.props.empleado.id_empleado,
        mensaje: this.state.comment,
        timestamp: Date.now(),
      }

      if(Object.keys(multipath).length>0){
        db.update(multipath)
        .then(()=>{
          //cerramos el panel de la conversacion 
          var elComment = ReactDOM.findDOMNode(this.refs.quillTextComment)
          var toolbar = $(elComment).find('.ql-toolbar');
          toolbar.removeClass('diplay_block_toolbar')
          $(elComment).find('.ql-container .ql-editor').removeClass('comment-task-input-ql-editor-activo')
          $('.comment-btn-task').removeClass('comment-btn-task-active')
          this.setState({ comment: '' })
        })
        .catch(err=>{
          console.log(err);
        })
      }

      
    
    


      //guardar en base de datos
      //this.setState({ comment: '' })

    }

  }

  componentDidMount = () => {


    var el = ReactDOM.findDOMNode(this.refs.quillText)
    el.setAttribute('spellcheck', false)
    $(el).find('.ql-container .ql-editor').focus(function () {
      var toolbar = $(el).find('.ql-toolbar');
      toolbar.addClass('diplay_block_toolbar')
    });
    $(el).find('.ql-container .ql-editor').blur(function () {
      var toolbar = $(el).find('.ql-toolbar');
      toolbar.removeClass('diplay_block_toolbar')
    });

    var elComment = ReactDOM.findDOMNode(this.refs.quillTextComment)
    elComment.setAttribute('spellcheck', false)
    $(elComment).find('.ql-container .ql-editor').focus(function () {
      var toolbar = $(elComment).find('.ql-toolbar');
      toolbar.addClass('diplay_block_toolbar')
      $(elComment).find('.ql-container .ql-editor').addClass('comment-task-input-ql-editor-activo')
      $('.comment-btn-task').addClass('comment-btn-task-active')

    });


    $(elComment).find('.ql-container .ql-editor').blur(function () {
      var text = this.textContent
      if(text.trim()===''){
        var toolbar = $(elComment).find('.ql-toolbar');
        toolbar.removeClass('diplay_block_toolbar')
        $(elComment).find('.ql-container .ql-editor').removeClass('comment-task-input-ql-editor-activo')
        $('.comment-btn-task').removeClass('comment-btn-task-active')
      }
    });
    
    this.setState({ _class: 'content-task-active', _class_content: 'panel-flotante-task-active' })

  }

  componentWillUnmount = () => {
    this.props.setEditTask(false)
  }

  multiPathConv = (multipath, campo, tipo, oldValue, newValue) =>{

    var key = db.child(`Servicios/Tareas/clientes/${this.props.cliente_seleccionado.id_cliente}/tareas/${this.state.tarea.id_tarea}/conversacion`).push().key;
    var path = `Servicios/Tareas/clientes/${this.props.cliente_seleccionado.id_cliente}/tareas/${this.state.tarea.id_tarea}/conversacion/${key}`;

    var edicion = ''
    var update = false,obj=false, ultimaModificacion=false

    var timestamp = Date.now()

    if(tipo==='texto'){

      var textOldValue = $('<div>'+oldValue+'</div>').text().replace(/<div><br><\/div>/g,'').trim() //oldValue.replace(/<[^>]*>?/gm, '').trim()
      var textNewValue = $('<div>'+newValue+'</div>').text().replace(/<div><br><\/div>/g,'').trim() //newValue.replace(/<[^>]*>?/gm, '').trim() 
      
      if(textOldValue==='' && textNewValue!==''){ edicion = 'agregar'; update=true }
      else if(textOldValue!=='' && textNewValue!=='' && textOldValue!==textNewValue){ edicion = 'modificar'; update=true}
      else if(textOldValue!=='' && textNewValue===''){ edicion = 'eliminar'; update=true}
      
    }else if(tipo==='object'){
      var eliminados = Object.entries(oldValue).filter(([k,o])=>{return !newValue[k]})
      var agregados = Object.entries(newValue).filter(([k,o])=>{return !oldValue[k]})
      obj = {}
      eliminados.forEach((o,i)=>{
        obj[o[0]]=false
      })
      agregados.forEach((o,i)=>{
        obj[o[0]]=true
      })
      if(Object.keys(obj).length>0){update=true;edicion='modificar'}
    }else if(tipo==='object-array'){
      var eliminados = oldValue.filter((o)=>{return !newValue.includes(o)})
      var agregados = newValue.filter((o)=>{return !oldValue.includes(o)})
      obj = {eliminados,agregados}
      if(Object.keys(obj).length>0){update=true;edicion='modificar'}

    }else if(tipo==='en_proceso'){
      oldValue = oldValue?oldValue:{}
      newValue = newValue?newValue:{}
      update = true;
      edicion='modificar'
    }else if(tipo==='num'){
      update = true;
      edicion='modificar'
    }else if(tipo==='date'){
      update = true;
      edicion='modificar'
      
    }else {

    }

    if(campo==='estado' || campo==='en_proceso'){
      ultimaModificacion='estado_proceso_'+timestamp
    }


    if(update){
      multipath[path] = {
        type:'log',
        campo,
        edicion,
        id_empleado:this.props.empleado.id_empleado,
        newValue,
        oldValue,
        obj: obj?obj:null,
        timestamp: timestamp,
        ultimaModificacion: ultimaModificacion?ultimaModificacion:null
      }
    }
    
    

  }

  guardarEnlaces = () => {
    var { tarea, estado, title, descripcion, prioridad, repeat, intervalo, tags, empleadosSeleccionados, startDate, en_proceso } = this.state
    var cambios = [], multipath={}

    if (tarea.fecha_limite !== startDate.format('YYYY-MM-DD')) { 
      cambios.push({ id: 'fecha_limite', valor: startDate.format('YYYY-MM-DD') })
      this.multiPathConv(multipath, 'fecha_limite', 'date', tarea.fecha_limite, startDate.format('YYYY-MM-DD'))
    }
    if (this.props.tarea.repetir !== repeat) { 
      cambios.push({ id: 'repetir', valor: repeat })
      //this.multiPathConv(multipath, 'repetir', 'num', this.props.tarea.repetir, repeat)
    }
    if (!_.isEqual(this.props.tarea.intervalo, intervalo)) { 
      cambios.push({ id: 'intervalo', valor: intervalo })
      this.multiPathConv(multipath, 'intervalo', 'num', this.props.tarea.intervalo, intervalo)
    }

    
    if (tarea.prioridad !== prioridad) { 
      cambios.push({ id: 'prioridad', valor: prioridad }) 
      this.multiPathConv(multipath, 'prioridad', 'num', tarea.prioridad, prioridad)
    }
    if (tarea.title !== title) { 
      cambios.push({ id: 'title', valor: title })
      this.multiPathConv(multipath, 'title', 'texto', tarea.title, title)
    }
    if (tarea.descripcion !== descripcion) { 
      cambios.push({ id: 'descripcion', valor: descripcion })
      this.multiPathConv(multipath, 'descripcion', 'texto', tarea.descripcion, descripcion)
    }
    if (!_.isEqual(tarea.empleados, empleadosSeleccionados)) { 
      cambios.push({ id: 'empleados', valor: empleadosSeleccionados }) 
      this.multiPathConv(multipath, 'empleados', 'object', tarea.empleados, empleadosSeleccionados)
    }

    if (!_.isEqual(tarea.tags, tags)) { 
      cambios.push({ id: 'tags', valor: tags }) 
      this.multiPathConv(multipath, 'tags', 'object-array', tarea.tags, tags)
    }

    
    console.log(!_.isEqual(tarea.en_proceso, en_proceso),tarea.en_proceso,en_proceso);
    
    if (!_.isEqual(tarea.en_proceso, en_proceso)) { 


      //si el proceso es numerico y los numeros coinciden se cambiara el estado de la tarfea a completada
      if(en_proceso.type==='numerico'){
        if((+en_proceso.valor.first_value)===(+en_proceso.valor.last_value) && ((+en_proceso.valor.first_value)!==0 && (+en_proceso.valor.last_value)!==0)){
          cambios.push({ id: 'estado', valor: 'completado' })
          this.multiPathConv(multipath, 'estado', 'texto', tarea.estado, 'completado')
        }else{
          cambios.push({ id: 'estado', valor: 'en_proceso' })
          this.multiPathConv(multipath, 'estado', 'texto', tarea.estado, 'en_proceso')
        }
      }else if(en_proceso.type==='simple'){
        cambios.push({ id: 'estado', valor: 'en_proceso' })
        this.multiPathConv(multipath, 'estado', 'texto', tarea.estado, 'en_proceso')
      }

      cambios.push({ id: 'en_proceso', valor: en_proceso }) 
      this.multiPathConv(multipath, 'en_proceso', 'en_proceso', tarea.en_proceso, en_proceso)

    }else{
      if (tarea.estado !== estado) {
        cambios.push({ id: 'estado', valor: estado })
        this.multiPathConv(multipath, 'estado', 'texto', tarea.estado, estado)
      }
    }

    
    if (cambios.length > 0) {
      var batch = df.batch();
      var sfRef = df.collection(`Servicios`).doc('Tareas').collection('tareas').doc(tarea.id_tarea)
      cambios.forEach((item) => {
        batch.update(sfRef, { [item.id]: item.valor });
      })

      batch.commit().then(function () {

        if(Object.keys(multipath)){
          db.update(multipath)
          .then(()=>{

          })
          .catch(err=>{
            console.log(err);
            
          })
        }

      });
    }
    
    




  }
  empleadoSelectedView = () => {
    var id_empleado = Object.entries(this.state.empleadosSeleccionados).find(([key, item]) => { return item === true })[0];
    return (
      <div className="TokenButton TokenButton--hasValue TokenButton--interactive AssigneeToken">
        <div className="TokenButton-icon">
          <div className="Avatar Avatar--medium Avatar--color7 AssigneeToken-avatar" style={{ backgroundImage: `url(${this.state.empleados[id_empleado].foto})` }}></div>
        </div>
        <div className="TokenButton-labelAndTitle">
          <div className="TokenButton-title">Assigned To</div>
          <div className="TokenButton-label">
            <span className="AssigneeToken-label">
              <span className="AssigneeToken-userNameLabel">{this.state.empleados[id_empleado].nombre + ' ' + this.state.empleados[id_empleado].apellidos}</span>
            </span>
          </div>
        </div>
        <div className="TokenButton-removeButtonBuffer"></div>
        <a className="RemoveButton TokenButton-removeButton"><svg className="Icon XIcon RemoveButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16L27,7.1c0.6-0.6,0.6-1.5,0-2.1s-1.5-0.6-2.1,0L16,13.9l-8.9-9C6.5,4.3,5.6,4.3,5,4.9S4.4,6.4,5,7l8.9,8.9L5,24.8c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg>
        </a>
      </div>
    )
  }


  closeEverything = () => {
    var self = this;
    self.setState({ _class: '', _class_content: '' })
    setTimeout(() => {
      self.props.setEditTask(false)
    }, 1200);
  }

  openListaEmpleado = () => {
    this.setState({ addEmpleado: true })
  }

  closeStatus = () => {
    
  }
  changeValor = (valor) => {
    
    //entrar'a en este if siempre y cuando se haya seleccionado el estado en proceso 
    if(valor === Object(valor)){

      if(valor.o.id_parent==='en_proceso'){

        //si la tarea antes tenia el proceso en numerico vamos a asignarselo a la variable
        if(valor.estado==='numerico' && this.props.tarea.en_proceso && this.props.tarea.en_proceso.type==='numerico'){
          this.setState({
            estado:valor.o.id_parent,
            en_proceso:this.props.tarea.en_proceso
          })
        }else if(valor.estado==='numerico'){
          this.setState({
            estado:valor.o.id_parent,
            en_proceso:{
              type:'numerico',
              valor:{
                first_value:0,
                last_value:0,
                text:''
              }
            }
          })
        }else if(valor.estado==='simple'){
          this.setState({
            estado:valor.o.id_parent,
            en_proceso:{
              type:'simple',
            }
          })
        }


      }

    }else{
      this.setState({estado:valor})
    }

  }

  changeProceso = (value, id) => {
    var en_proceso = JSON.parse(JSON.stringify(this.state.en_proceso))
    en_proceso.valor[id] = id==='text'?value:(+value)
    this.setState({en_proceso})
  }

  render() {
    
    var { tarea, estado, title, descripcion, prioridad, repeat, intervalo, tags, empleadosSeleccionados, startDate, en_proceso } = this.state

    var changed = false
    if (tarea.estado !== estado ||
      tarea.title !== title ||
      tarea.descripcion !== descripcion ||
      tarea.prioridad !== prioridad ||

      this.props.tarea.repetir !== repeat ||

      //tarea.intervalo.repeat !== intervalo.repeat || tarea.intervalo.valor !== intervalo.valor || tarea.intervalo.valorExtra !== intervalo.valorExtra ||
      !_.isEqual(this.props.tarea.intervalo, intervalo) ||
      !_.isEqual(tarea.tags, tags) ||
      !_.isEqual(this.props.tarea.en_proceso, en_proceso) ||
      !_.isEqual(tarea.empleados, empleadosSeleccionados) ||
      tarea.fecha_limite !== startDate.format('YYYY-MM-DD')
    ) {
      changed = true
    }

    var iconEstado = '', classEstado = '', textEstado='No completado'
    if (this.state.estado === 'no_completado') {
      iconEstado = 'alarm';
      textEstado = 'No completado'
      //No completado
    } else if (this.state.estado === 'en_proceso') {
      iconEstado = 'autorenew'
      classEstado = 'task-proceso'
      textEstado = 'En proceso'
      //En proceso
    } else if (this.state.estado === 'completado') {
      iconEstado = 'done'
      classEstado = 'task-done'
      textEstado = 'Completado'
      //Completado
    }

    
    
    return (
      <div>
        <div className={`content-task ${this.state._class}`}></div>

        <div className={`panel-flotante-task ${this.state._class_content}`}>

          {/*   HEADER    */}
          <div>
            <div className='header-task'>

              <div className={`btn-status-task ${classEstado}`}>
                <SimpleInputDesplegable close={()=>{this.closeStatus()}} icon={{icon:iconEstado, _class:(iconEstado === 'autorenew' ? 'color_parado rotating' : '')+' icon-status-task-inside '+(iconEstado === 'autorenew') }} type='object' submenu={true} title='' _class_input='mgn_0 status-task' text={textEstado} lista={data.taskStatius} changeValor={this.changeValor} />
              </div>

              <div className='container-stars-left'>
                {/*<div className='icon-tool-task'><i className="material-icons">more_vert</i> </div>*/}
                <DatePicker repetir={this.state.repetir} repeat={this.state.repeat} intervalo={this.state.intervalo} startDate={this.state.startDate} changeFecha={(data) => { this.changeFecha(data) }} />
                <div className='icon-tool-task pdd_0'> <i className="material-icons" onClick={() => { this.closeEverything() }}> close </i> </div>
              </div>
            </div>
          </div>


          {/*   CONTENT    */}
          <div className='content-scroll-task pr'>

            

            <div className='container-stars'>
              <StarRatingComponent name="app6" starColor="#1090f7" emptyStarColor="#1090f7" value={this.state.prioridad} onStarClick={this.onStarClick.bind(this)}
                renderStarIcon={(index, value) => { return (<span> <i className={index <= value ? 'fas fa-star' : 'far fa-star'} /> </span>); }}
                renderStarIconHalf={() => { return (<span> <span style={{ position: 'absolute' }}><i className="far fa-star" /></span> <span><i className="fas fa-star-half" /></span></span>); }}
              />
            </div>
            
            {/*TITULO DE LA TAREA Y LA PRIORIDAD*/}
            <div className='container-block-newTask'>
              <div className='titles-task'>Tarea: </div>

              <ContentEditable
                className='title-task'
                html={this.state.title}
                disabled={false} // use true to disable edition
                onChange={this.changeTitle} // handle innerHTML change
                placeholder={""}
              />

              

            </div>


            {/*En progreso, si existe en_progreso y es numerico mostraremos este container*/}
            {this.state.en_proceso && this.state.en_proceso.type==='numerico'?
              <div className='container-proceso-numerico'>
                <input className='input-num' value={this.state.en_proceso.valor.first_value} onChange={(e)=>this.changeProceso(e.target.value, 'first_value')} />
                <span className='separador-proceso'>/</span>
                <input className='input-num' value={this.state.en_proceso.valor.last_value} onChange={(e)=>this.changeProceso(e.target.value, 'last_value')} />
                {/*<input className='valor-en-proceso' value={this.state.en_proceso.valor.text} onChange={(e)=>this.changeProceso(e.target.value, 'text')} />*/}
              </div>
            :null}


            {/*DESCRIPCION*/}
            <div className='container-block-newTask' id='block-description'>
              <div className='titles-task'>Descripción: </div>
              <ReactQuill
                ref='quillText'
                modules={EditTask.modules}
                formats={EditTask.formats}
                value={this.state.descripcion}
                placeholder="Descripción"
                onChange={(e) => { this.changeDescripcion(e) }}
                autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck={false}
              />
            </div>
            {/*EMPLEADOS*/}
            <div className='container-block-newTask'>
              <div className='titles-task'>Asignado a: </div>

              <div className='display_flex wrap_flex pr'>
                {/*Esto sirve para mostrar el icono del cliente primero en vez de los consultores*/}
                {this.state.empleadosSeleccionados && this.state.empleadosSeleccionados.cliente?
                  <div className="item-empleado-newtask RemovableAvatar FollowersList-facepileAvatar">
                    <div className="Avatar Avatar--small Avatar--color7">
                      <i className="material-icons icon-person icon-client-task">person</i>
                    </div>
                    <div className='info-empleado-newtask'> <div>Cliente</div> </div>
                    <a onClick={() => this.deleteEmpleado('cliente')} className="RemoveButton RemovableAvatar-avatarRemoveButton"><svg className="Icon XIcon RemoveButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16L27,7.1c0.6-0.6,0.6-1.5,0-2.1s-1.5-0.6-2.1,0L16,13.9l-8.9-9C6.5,4.3,5.6,4.3,5,4.9S4.4,6.4,5,7l8.9,8.9L5,24.8c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></a>
        
                  </div>
                :null}

                <ListaEmpleados deleteEmpleado={this.deleteEmpleado} empleados={this.state.empleadosSeleccionados?this.state.empleadosSeleccionados:{}} listaEmpleados={this.state.empleados} />
                <div className='container-icon-person-newtask pr' onClick={()=>{this.openListaEmpleado()}}>
                  <i className="material-icons icon-person">person</i>
                  <div className='icon-plus'>
                    <i className="material-icons ">add</i>
                  </div>
                </div>
                                  
                {this.state.addEmpleado ?
                    <ItemNewEmpleado checkbox={true} empleados={this.state.empleados} empleadosSeleccionados={this.state.empleadosSeleccionados?this.state.empleadosSeleccionados:{}} _class='lista-asignacion-newtask' deleteEmpleado={(index)=>this.deleteEmpleado(index)} selectEmpleado={(index) => this.selectEmpleado(index)}  close={() => this.setState({ addEmpleado: false })} />
                    : null}
              </div>


            </div>
            
            {/*ETIQUETAS*/}
            <div className='container-block-newTask pr'>
              <div className='titles-task'>Etiquetas: </div>
              <div className='display_flex wrap_flex'>
                
                {
                  this.state.tags.map((item, i) => {
                    return (
                      <div className='tagTask' key={i}>
                        <span>{item}</span>
                        <a onClick={() => this.deleteTag(i)} className="RemoveButton RemovableAvatar-avatarRemoveButton"><svg className="Icon XIcon RemoveButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16L27,7.1c0.6-0.6,0.6-1.5,0-2.1s-1.5-0.6-2.1,0L16,13.9l-8.9-9C6.5,4.3,5.6,4.3,5,4.9S4.4,6.4,5,7l8.9,8.9L5,24.8c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></a>

                      </div>
                    )
                  })
                }
                <div onClick={() => this.setState({ addTag: true })} >
                  <div className='tagTask addTagLabel'>
                    <span>añadir</span>
                  </div>
                  {this.state.addTag ?
                    <ItemNewTag passTag={(tags) => { this.saveTags(tags) }} close={() => this.setState({ addTag: false })} />: null
                  }
                </div>
              </div>
            </div>

            {/*CONVERSACION Y LOGS*/}

            <Conversacion id_tarea={this.state.id_tarea} tarea={this.state.tarea} empleados={this.props.empleados} empleado={this.props.empleado}/>

          </div>

          {/*   FOOTER    */}

          <div className={`bottom-container-task`}>
            <div className={`CommentComposer CommentComposer--isCollapsed pr ${changed ? 'display_none' : ''}`}>
              <div className="Avatar Avatar--medium Avatar--color5 CommentComposer-avatar" style={{ backgroundImage: `url(${this.props.empleado.foto})` }}>
                {this.props.empleado.foto === 'x' ? this.props.empleado.nombre.substring(0,2).toLowerCase() : ''}
              </div>
              <div id='comment-task-input'>
                <ReactQuill
                  ref='quillTextComment'
                  modules={EditTask.modules}
                  formats={EditTask.formats}
                  value={this.state.comment}
                  placeholder="Añade algún comentario..."
                  onChange={(e) => { this.setState({ comment: e }) }}
                  autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                />
              </div>
              <div className='comment-btn-task' onClick={ ()=>this.saveComment() } >Comentar</div>
            </div>
            {changed ?
              <div className={`btns-finalizar-add-medios-paid bottom-add-task ${changed ? '' : 'display_none'}`}>
                <div className="btn-cancelar-confirm" onClick={(e) => { e.stopPropagation(); this.undoData() }}>Cancelar</div>
                <div className="btn-aceptar-confirm" onClick={() => this.guardarEnlaces()}>Guardar</div>
              </div>
              :
              null
            }

          </div>



        </div>
      </div >
    )
  }

}

/**
 *
*  <div className='comment-btn-task'>Comment</div>
    */
EditTask.modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' },
    { 'indent': '-1' }, { 'indent': '+1' }],
    [{ header: '1' }, { header: '2' }],
  ]
};
EditTask.formats = ['header','font','size','bold','italic','underline','strike','list','indent','bullet','link',];

function mapStateToProps(state) {
  return {
    cliente_seleccionado: state.cliente_seleccionado, empleados: state.empleados, empleado: state.empleado,
  };
}
function matchDispatchToProps(dispatch) { return bindActionCreators({ setOpenNewTask, setEditTask }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(EditTask);





class ListaEmpleados extends Component {
  constructor(props){
    super(props)
    this.state={
      empleados:this.props.empleados,
      empleadosOrdenados: []
    }
  }

  
  shouldComponentUpdate(newProps, newState) {
    var update = false
    if( this.state.empleados!==newProps.empleados ){
      update = true;
    }
    if(this.state.empleadosOrdenados!==newState.empleadosOrdenados){
      update = true;
    }

    return true;
  }
  componentWillReceiveProps = newProps => {
    if(this.state.empleados!==newProps.empleados){
      this.setState({empleados: newProps.empleados},()=>this.ordenarEmpleados())
    }
  }
  componentWillMount = () => {
    this.ordenarEmpleados()
  }
  ordenarEmpleados = () => {
    var empleadosOrdenados = Object.entries(this.state.empleados)
    empleadosOrdenados.sort((a, b) => {
      a = a[0]; b = b[0]
      if(a==='cliente' || b==='cliente'){
        return 1
      }
      var fullNameA = `${this.props.listaEmpleados[a].nombre} ${this.props.listaEmpleados[a].apellidos}`;
      var fullNameB = `${this.props.listaEmpleados[b].nombre} ${this.props.listaEmpleados[b].apellidos}`;
      if (fullNameA.toLowerCase() > fullNameB.toLowerCase()) { return 1; }
      if (fullNameA.toLowerCase() < fullNameB.toLowerCase()) { return -1; }
      
      return 0;
    });
    this.setState({empleadosOrdenados})
  }

  render(){
    
    return(
      this.state.empleadosOrdenados.map((i,k)=>{
        var e = this.props.listaEmpleados[i[0]];
        if(!e)return false
        return(
          
          <div className="item-empleado-newtask RemovableAvatar FollowersList-facepileAvatar" key={k}>
            <div className="Avatar Avatar--small Avatar--color7" style={{ backgroundImage: `url(${e.foto})` }}>
              {e.foto === 'x' ? e.nombre.substring(0,2).toLowerCase() : ''}
            </div>

            <div className='info-empleado-newtask'>
              <div>{e.nombre}</div>
              <div>{e.apellidos}</div>
            </div>
            <a onClick={() => this.props.deleteEmpleado(i[0])} className="RemoveButton RemovableAvatar-avatarRemoveButton"><svg className="Icon XIcon RemoveButton-xIcon" focusable="false" viewBox="0 0 32 32"><path d="M18.1,16L27,7.1c0.6-0.6,0.6-1.5,0-2.1s-1.5-0.6-2.1,0L16,13.9l-8.9-9C6.5,4.3,5.6,4.3,5,4.9S4.4,6.4,5,7l8.9,8.9L5,24.8c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4l8.9-8.9l8.9,8.9c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L18.1,16z"></path></svg></a>

          </div>
        )
      })
    )
  }


}