import React, { Component } from 'react'
import SimpleInput from '../../../../Global/SimpleInput'
import SimpleTextArea from '../../../../Global/SimpleTextArea'
import SimpleInputDesplegable from '../../../../Global/SimpleInputDesplegable'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setOpenNewTask } from '../../../../../redux/actions'
import data from '../../../../Global/Data/Data';
import ItemNewTag from './ItemNewTag'
import ItemNewEmpleado from './ItemNewEmpleado'
import DatePicker from './DatePicker';
import moment from 'moment'
import firebase from '../../../../../firebase/Firebase';
const db = firebase.firestore();
class NewTask extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: '',
      descripcion: '',
      prioridad: 'baja',

      addTag: false,
      tags: [],
      addEmpleado: false,
      empleadosSeleccionados: {},

      repeat: 'nunca',
      intervalo: {
        repeat: 'nunca',
        valor: null,
        valorExtra: null
      },
      startDate: moment(),
      repetir: {
        nunca: {
          texto: 'Nunca'
        },
        diariamente: {
          texto: 'Diariamente'
        },
        periodicamente: {
          texto: 'Periodicamente',
          intervalo: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],

        },
        semanalmente: {
          texto: 'Semanalmente',
          intervalo: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
          dia: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
        },
        mensualmente: {
          texto: 'Mensualmente',
          intervalo: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
          dia: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "Último"]
        },
        anualmente: {
          texto: 'Anualmente'
        },

      }

    }
  }
  saveTags = (text) => {
    var arrayTags = text.split(',');
    var tags = this.state.tags;
    arrayTags.forEach((item, key) => {
      if (item.trim() === '') return null;
      tags.push(item.toLowerCase())
    })
    this.setState({ tags })
  }

  deleteTag = (id) => {
    var tags = this.state.tags;
    delete tags[id]
    this.setState({ tags })
  }

  selectEmpleado = (index) => {
    var { empleadosSeleccionados } = this.state;
    empleadosSeleccionados[index] = true;
    this.setState({ empleadosSeleccionados })
  }

  deleteEmpleado = (index) => {
    var { empleadosSeleccionados } = this.state;
    delete empleadosSeleccionados[index];
    this.setState({ empleadosSeleccionados })
  }

  changeFecha = (data) => {
    var { repeat, intervalo, startDate } = data;
    this.setState({
      repeat, intervalo, startDate
    })
  }

  gurdarEnlaces = () => {
    console.log(this.state);
    var { descripcion, empleadosSeleccionados, intervalo, prioridad, repeat, startDate, tags, title } = this.state;

    if (intervalo.repeat === repeat) {
      intervalo.valor = intervalo.valor ? intervalo.valor : this.state.repetir[repeat].intervalo ? this.state.repetir[repeat].intervalo[0] : null;
      intervalo.valorExtra = intervalo.valorExtra ? intervalo.valor : this.state.repetir[repeat].dia ? this.state.repetir[repeat].dia[0] : null;
    } else {
      intervalo = null
    }

    var batch = db.batch();

    var id_tarea = db.collection(`Servicios`).doc('Tareas').collection('tareas').doc().id

    var newTask = db.collection(`Servicios`).doc('Tareas').collection('tareas').doc(id_tarea)
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
      console.log('OKAY');
    });

    /*db.update(multipath)
      .then(() => {
        console.log('Ok');
        this.props.setOpenNewTask(false)

      })
      .catch(err => console.log(err))
*/

  }

  render() {
    console.log(this.props.tarea);

    return (
      <div className='content-task'>
        <div className='scrollTask'>
          <div className="title-pop-up title-center-pop-up">Tarea nueva</div>
          <div className='wrapper-sections-task'>
            <SimpleInput title='Titulo' _class_container={this.state.title.trim() === '' && false ? 'error-form-input' : ''} text={this.state.title} changeValue={title => { this.setState({ title }) }} />
            <SimpleTextArea _class='pdd-top-10' title='Descripción' text={this.state.descripcion} changeValue={descripcion => { this.setState({ descripcion }) }} />
          </div>


          <div className='col-2-input div_2_newTask'>
            <div className="container-simple-input ">
              <div className="title-input">Fecha fin:</div>
              <DatePicker repetir={this.state.repetir} repeat={this.state.repeat} intervalo={this.state.intervalo} startDate={this.state.startDate} changeFecha={(data) => { this.changeFecha(data) }} />
            </div>
            <SimpleInputDesplegable title='Prioridad' text={this.state.prioridad ? data.prioridadTask[this.state.prioridad].texto : 'Selecciona prioridad'} type='object' lista={data.prioridadTask} changeValor={prioridad => { this.setState({ prioridad }) }} />
          </div>

          <div className='wrapper-sections-task'>
            <div className="container-simple-input ">
              <div className="title-input">Etiquetas:</div>
              <div className="div-tags-task">
                {
                  this.state.tags.map((item, i) => {
                    return (
                      <div className='tagTask' key={i}>
                        <span>{item}</span><i onClick={() => this.deleteTag(i)} className="material-icons">close</i>
                      </div>
                    )
                  })
                }
                <div className={`newTagTask ${this.state.addTag ? '' : ''}`} onClick={() => this.setState({ addTag: true })}>
                  <i className="material-icons">add</i><span>ADD TAG</span>

                  {this.state.addTag ?
                    <ItemNewTag passTag={(tags) => { this.saveTags(tags) }} close={() => this.setState({ addTag: false })} />
                    : null}
                </div>

              </div>
            </div>
          </div>


          <div className='wrapper-sections-task'>
            <div className="container-simple-input ">
              <div className="title-input">Empleados:</div>
              <div className="div-tags-task">


                {
                  Object.entries(this.state.empleadosSeleccionados).map(([index, item]) => {
                    if (!item) return null
                    var fullName = this.props.empleados[index].nombre + " " + this.props.empleados[index].apellidos;
                    return (
                      <div className='empleadoTask' key={index}>
                        <div className='container-picture-empl-task'><img className="picture-profile" alt="" src={this.props.empleados[index].foto} /></div>
                        <div className='div-empl-tag'>
                          <div className='div-empl-tag-1'>Asignado a </div>
                          <div className='div-empl-tag-2'>{fullName}</div>
                        </div>
                        <i onClick={() => this.deleteEmpleado(index)} className="material-icons">close</i>
                      </div>
                    )
                  })
                }

                <div className={`empleadoTask newEmpleTask ${this.state.addEmpleado ? '' : ''}`} onClick={() => this.setState({ addEmpleado: true })}>
                  <div className='container-picture-empl-task'><i className="material-icons">group_add</i></div>
                  <div className='div-empl-tag'>
                    <div className='div-empl-tag-1'>Asigna </div>
                    <div className='div-empl-tag-1 div-empl-tag-2'>empleados</div>
                  </div>
                  {this.state.addEmpleado ?
                    <ItemNewEmpleado selectEmpleado={(index) => this.selectEmpleado(index)} empleados={this.props.empleados} empleadosSeleccionados={this.state.empleadosSeleccionados} close={() => this.setState({ addEmpleado: false })} />
                    : null}
                </div>

              </div>
            </div>
          </div>





        </div>


        <div className='btns-finalizar-add-medios-paid bottom-add-task '>

          <div className="btn-cancelar-confirm" onClick={(e) => { e.stopPropagation(); this.props.setOpenNewTask(false); }}>Cancelar</div>
          <div className="btn-aceptar-confirm" onClick={() => this.gurdarEnlaces()}>Guardar</div>

        </div>



      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    cliente_seleccionado: state.cliente_seleccionado, empleados: state.empleados, empleado: state.empleado,
  };
}
function matchDispatchToProps(dispatch) { return bindActionCreators({ setOpenNewTask }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(NewTask);