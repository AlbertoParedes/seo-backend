import React, { Component } from 'react';
import { SingleDatePicker, isInclusivelyBeforeDay } from 'react-dates';
import SimpleInputDesplegableMin from '../../../../Global/SimpleInputDesplegableMin'
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import dotProp from 'dot-prop-immutable';
//import './react_dates_overrides.css';
import moment from 'moment'
const TODAY = moment();

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      focused: null,
      startDate: this.props.startDate,
      startDateAux: this.props.startDate,
      repeat: this.props.repeat,
      intervaloAux: this.props.intervalo,

      intervalo: this.props.intervalo,

      repetir: this.props.repetir
    }
  }

  componentWillReceiveProps = newProps => {

    if (this.state.startDate !== newProps.startDate ||
      this.state.repeat !== newProps.repeat ||
      this.state.intervaloAux !== newProps.intervalo
    ) {
      this.setState({
        startDate: newProps.startDate,
        startDateAux: newProps.startDate,
        repeat: newProps.repeat,
        intervaloAux: newProps.intervalo,
        intervalo: newProps.intervalo,
      })
    }
  }

  navPrev = () => {
    return (
      <div className='rigth-arror-date-picker'><i className="material-icons"> arrow_back_ios </i></div>
    )
  }
  navNext = () => {
    return (
      <div className='left-arror-date-picker'><i className="material-icons"> arrow_forward_ios </i></div>
    )
  }

  changeIntervalo = (repeticion, inter) => {
    var { intervalo } = this.state;
    intervalo = {

      valor: inter,
      valorExtra: this.state.repeat === repeticion ? intervalo.valorExtra : null,
      repeat: repeticion,
    }
    this.setState({ intervalo })
  }
  changeValorExtra = (repeticion, valorExtra) => {

    var intervalo = dotProp.set(this.state.intervalo, `repeat`, repeticion);
    intervalo.valor = intervalo.repeat === repeticion ? intervalo.valor : null;
    intervalo.valorExtra = valorExtra;
    this.setState({ intervalo })

  }

  changeRepeat = (repeat) => {

    var intervalo = dotProp.set(this.state.intervalo, `repeat`, repeat);
    intervalo.valor = null;
    intervalo.valorExtra = null;

    this.setState({ repeat, intervalo })
  }

  renderCalendarInfo = () => {

    return (

      <div onClick={(e) => e.stopPropagation()}>

        <div>
          <div>

            <div className='repetir-container' >
              <span className='title-repetir-container'>Repetir:</span>
              <SimpleInputDesplegableMin title='Prioridad' _class_input='mgn_0' text={this.state.repeat ? this.state.repetir[this.state.repeat].texto : 'nunca'} type='object' lista={this.state.repetir} changeValor={repeat => { this.changeRepeat(repeat) }} />
            </div>

            {this.state.repeat === 'periodicamente' ?

              <div className='repetir-container' >
                <span className='title-repetir-container'>Intervalo:</span>
                <SimpleInputDesplegableMin _class_input='mrgR_5' text={this.state.intervalo.repeat === 'periodicamente' && this.state.repeat === 'periodicamente' && this.state.intervalo.valor ? this.state.intervalo.valor : this.state.repetir[this.state.repeat].intervalo[0]} lista={this.state.repetir.periodicamente.intervalo} changeValor={intervalo => { this.changeIntervalo('periodicamente', intervalo) }} /><span>día(s) después de finalizar  </span>
              </div>
              :
              null}



            {this.state.repeat === 'semanalmente' ?

              <div className='repetir-container' >
                <span className='title-repetir-container'>Intervalo:</span>
                <span> cada </span><SimpleInputDesplegableMin text={this.state.intervalo.repeat === 'semanalmente' && this.state.repeat === 'semanalmente' && this.state.intervalo.valor ? this.state.intervalo.valor : this.state.repetir[this.state.repeat].intervalo[0]} lista={this.state.repetir.semanalmente.intervalo} changeValor={intervalo => { this.changeIntervalo('semanalmente', intervalo) }} /><span>semana(s)</span>
              </div>
              :
              null}
            {this.state.repeat === 'semanalmente' ?

              <div className='repetir-container' >
                <span className='title-repetir-container'>Día de la semana:</span>
                <SimpleInputDesplegableMin _class_input='mgn_0' text={this.state.intervalo.repeat === 'semanalmente' && this.state.repeat === 'semanalmente' && this.state.intervalo.valorExtra ? this.state.intervalo.valorExtra : this.state.repetir[this.state.repeat].dia[0]} lista={this.state.repetir.semanalmente.dia} changeValor={valorExtra => { this.changeValorExtra('semanalmente', valorExtra) }} />
              </div>
              :
              null}

            {this.state.repeat === 'mensualmente' ?

              <div className='repetir-container' >
                <span className='title-repetir-container'>Intervalo:</span>
                <span> cada </span><SimpleInputDesplegableMin text={this.state.intervalo.repeat === 'mensualmente' && this.state.repeat === 'mensualmente' && this.state.intervalo.valor ? this.state.intervalo.valor : this.state.repetir[this.state.repeat].intervalo[0]} lista={this.state.repetir.mensualmente.intervalo} changeValor={intervalo => { this.changeIntervalo('mensualmente', intervalo) }} /><span>mes(es)</span>
              </div>
              :
              null}

            {this.state.repeat === 'mensualmente' ?

              <div className='repetir-container' >
                <span className='title-repetir-container'>Día del mes:</span>
                <SimpleInputDesplegableMin _class_input='mgn_0' text={this.state.intervalo.repeat === 'mensualmente' && this.state.repeat === 'mensualmente' && this.state.intervalo.valorExtra ? this.state.intervalo.valorExtra : this.state.repetir[this.state.repeat].dia[0]} lista={this.state.repetir.mensualmente.dia} changeValor={valorExtra => { this.changeValorExtra('mensualmente', valorExtra) }} />
              </div>
              :
              null}


          </div>
        </div>

        <div className='bottom-bar-react-dates mg_top_10'>
          <div className='bottom-bar-react-dates-reset' onClick={() => this.cancelSeleccion()}> Cancelar </div>
          <div className='bottom-bar-react-dates-apply' onClick={(e) => this.changeFechas(e)}> Aplicar </div>
        </div>
      </div>

    )
  }

  cancelSeleccion = () => {

    this.setState({
      startDate: this.state.startDateAux,
      intervalo: this.state.intervaloAux,
      repeat: this.state.intervaloAux.repeat,
      focused: null
    })
  }
  changeFechas = (e) => {
    e.stopPropagation();
    var newFecha = {
      repeat: this.state.repeat,
      intervalo: this.state.intervalo,
      startDate: this.state.startDate
    }
    this.setState({
      startDateAux: this.state.startDate,
      focused: null
    }, () => {
      this.props.changeFecha(newFecha)
    })

  }

  onClose = value => {

    if (this.state.startDate.format('LL') !== this.state.startDateAux.format('LL') || this.state.intervalo !== this.state.intervaloAux) {
      this.cancelSeleccion()
    }
  }

  openClendar = () => {
    this.setState({
      focused: true,
      focusedInput: 'startDate'
    })
  }

  rendarDay = (date) => {
    return (
      <div className='circle-calendar-day'>{moment(date).format('D')}</div>
    )
  }

  render() {

    return (


      <div id='datepicker-task' className="" onClick={() => this.openClendar()}>
        
        <div className='container-date-end-tsk'>
            <i className="material-icons icon-calendar"> calendar_today </i>
          <div className='container-fecha-string'>
            <span>{this.state.startDate ? this.state.startDate.format('LL') : ''}</span>
          </div>
        </div>
        
        {/*
        <div className="DueDateToken TaskPaneAssigneeDueDateRowStructure-dueDateToken">
          <div className="TokenButton TokenButton--interactive DueDateToken-tokenButton">
            <div className="TokenButton-icon">
              <svg className="Icon CalendarIcon" focusable="false" viewBox="0 0 32 32"><path d="M24,2V1c0-0.6-0.4-1-1-1s-1,0.4-1,1v1H10V1c0-0.6-0.4-1-1-1S8,0.4,8,1v1C4.7,2,2,4.7,2,8v16c0,3.3,2.7,6,6,6h16c3.3,0,6-2.7,6-6V8C30,4.7,27.3,2,24,2z M8,4v1c0,0.6,0.4,1,1,1s1-0.4,1-1V4h12v1c0,0.6,0.4,1,1,1s1-0.4,1-1V4c2.2,0,4,1.8,4,4v2H4V8C4,5.8,5.8,4,8,4z M24,28H8c-2.2,0-4-1.8-4-4V12h24v12C28,26.2,26.2,28,24,28z"></path></svg>
            </div>
            <div className="TokenButton-labelAndTitle">
              <div className="TokenButton-title">Due Date</div>
              <div className="TokenButton-label">
                <div className="DueDateToken-label">
                  <div className="DueDate DueDate--future DueDateToken-dueDate TaskPaneAssigneeDueDateRowStructure-dueDateToken">{this.state.startDate ? this.state.startDate.format('LL') : ''}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        */}

        <SingleDatePicker
          id='input-date-picker-task'
          date={this.state.startDate} // momentPropTypes.momentObj or null
          onDateChange={startDate => this.setState({ startDate })} // PropTypes.func.isRequired
          focused={this.state.focused} // PropTypes.bool
          onFocusChange={({ focused }) => this.setState({ focused })}
          numberOfMonths={1}
          navPrev={this.navPrev()} navNext={this.navNext()}
          anchorDirection="left"
          calendarInfoPosition="bottom"
          renderCalendarInfo={() => this.renderCalendarInfo()}
          hideKeyboardShortcutsPanel
          keepOpenOnDateSelect={true}
          displayFormat="DD/MM/YYYY"
          renderDayContents = {this.rendarDay}
          readOnly
          onClose={(value) => this.onClose(value)}

        />
      </div>




    )
  }

}



export default DatePicker;


/*
      <div id='datepicker-task' className='container-input' onClick={() => this.openClendar()} >

  <i className="material-icons icon-calendar-react-date"> calendar_today </i>
  <p className=''>{this.state.startDate ? this.state.startDate.format('LL') : 'Selecciona fecha'}</p>

  <SingleDatePicker
    id='input-date-picker-task'
    date={this.state.startDate} // momentPropTypes.momentObj or null
    onDateChange={startDate => this.setState({ startDate })} // PropTypes.func.isRequired
    focused={this.state.focused} // PropTypes.bool
    onFocusChange={({ focused }) => this.setState({ focused })}
    numberOfMonths={1}
    navPrev={this.navPrev()} navNext={this.navNext()}
    anchorDirection="left"
    calendarInfoPosition="bottom"
    renderCalendarInfo={() => this.renderCalendarInfo()}
    hideKeyboardShortcutsPanel
    keepOpenOnDateSelect={true}
    displayFormat="DD/MM/YYYY"
    readOnly
    onClose={(value) => this.onClose(value)}

  />
</div>
*/