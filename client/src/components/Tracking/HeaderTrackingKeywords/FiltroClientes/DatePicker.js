import React, { Component } from 'react';
import { DateRangePicker, isInclusivelyBeforeDay } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './react_dates_overrides.css';
import moment from 'moment'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setDateKeywords, } from '../../../../redux/actions';


const TODAY = moment();
const LAST30 = moment().subtract(30 - 1, 'days');
const LAST7 = moment().subtract(7 - 1, 'days');

var PREV_MONTH_FIRST_DAY = moment().subtract(1, 'months').startOf('month')
var PREV_MONTH_LAST_DAY = moment().subtract(1, 'months').endOf('month')

var PREV_WEEK_FIRST_DAY = moment().subtract(1, 'weeks').startOf('week').add(1, 'days');
var PREV_WEEK_LAST_DAY = moment().subtract(1, 'weeks').endOf('week').add(1, 'days');

var PREV_90_FIRST_DAY = moment().subtract(90 - 1, 'days');

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      focused: null,

      endDate: this.props.endDate,
      startDate: this.props.startDate,

      endDateAux: this.props.endDate,
      startDateAux: this.props.startDate
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
  renderCalendarInfo = (last30, last7, lastMonth, lastWeek, last90, personalizado) => {
    return (

      <div>
        <div className='sidebar-react-dates'>

          <div onClick={() => this.setFechaLabels('lastWeek')} className={`${lastWeek ? 'label-selected-react-dates' : ''}`}>Semana anterior</div>
          <div onClick={() => this.setFechaLabels('lastMonth')} className={`${lastMonth ? 'label-selected-react-dates' : ''}`} >Mes anterior</div>

          <div onClick={() => this.setFechaLabels('last7')} className={`${last7 ? 'label-selected-react-dates' : ''}`}>Últimos 7 días</div>
          <div onClick={() => this.setFechaLabels('last30')} className={`${last30 ? 'label-selected-react-dates' : ''}`}>Últimos 30 días</div>
          <div onClick={() => this.setFechaLabels('last90')} className={`${last90 ? 'label-selected-react-dates' : ''}`}>Últimos 90 días</div>

          <div className={`${!lastWeek && !lastMonth && !last7 && !last30 && !last90 ? 'label-selected-react-dates' : ''}`}>Personalizado</div>

        </div>
        <div className='bottom-bar-react-dates'>
          <div className='bottom-bar-react-dates-reset' onClick={() => this.setState({ startDate: this.state.startDateAux, endDate: this.state.endDateAux })}> Reset </div>
          <div className='bottom-bar-react-dates-apply' onClick={(e) => this.changeFechas(e)}> Apply </div>
        </div>
      </div>

    )
  }
  changeFechas = (e) => {
    e.stopPropagation();
    if (this.state.startDate.format('LL') !== this.state.startDateAux.format('LL') || this.state.endDate.format('LL') !== this.state.endDateAux.format('LL')) {
      this.setState({
        startDateAux: this.state.startDate,
        endDateAux: this.state.endDate,
        focusedInput: null
      }, () => {
        //guardar fecha en el store con redux
        console.log('Aplicado');
        this.props.setDateKeywords({ startDate: this.state.startDate, endDate: this.state.endDate })
      })
    } else {
      this.setState({
        focusedInput: null
      })
    }
  }
  setFechaLabels = valor => {
    var fechas = false;
    if (valor === 'lastWeek') {
      fechas = { startDate: PREV_WEEK_FIRST_DAY, endDate: PREV_WEEK_LAST_DAY }
    } else if (valor === 'lastMonth') {
      fechas = { startDate: PREV_MONTH_FIRST_DAY, endDate: PREV_MONTH_LAST_DAY }
    } else if (valor === 'last7') {
      fechas = { startDate: LAST7, endDate: TODAY }
    } else if (valor === 'last30') {
      fechas = { startDate: LAST30, endDate: TODAY }
    } else if (valor === 'last90') {
      fechas = { startDate: PREV_90_FIRST_DAY, endDate: TODAY }
    }

    if (fechas) {
      this.setState({
        startDate: fechas.startDate, endDate: fechas.endDate
      })
    }

  }
  onClose = value => {
    if (this.state.startDate.format('LL') !== this.state.startDateAux.format('LL') || this.state.endDate.format('LL') !== this.state.endDateAux.format('LL')) {
      this.setState({ startDate: this.state.startDateAux, endDate: this.state.endDateAux, focusedInput: null })
    }
  }

  openClendar = (e, tipoFecha) => {
    if (e.currentTarget.getAttribute("data-id") && tipoFecha !== 'personalizado') {
      this.setState({
        focusedInput: 'startDate'
      })
    }
  }

  rendarDay = (date) => {
    return (
      <div className='circle-calendar-day'>{moment(date).format('D')}</div>
    )
  }

  render() {
    var last30 = false, last7 = false, lastMonth = false, lastWeek = false, last90 = false, personalizado = false, tipoFecha = 'personalizado';
    if (this.state.endDate && this.state.startDate) {
      if (this.state.endDate.format('LL') === TODAY.format('LL') && this.state.startDate.format('LL') === LAST30.format('LL')) {
        last30 = true; tipoFecha = 'Últimos 30 días'
      } else if (this.state.endDate.format('LL') === TODAY.format('LL') && this.state.startDate.format('LL') === LAST7.format('LL')) {
        last7 = true; tipoFecha = 'Últimos 7 días'
      } else if (this.state.endDate.format('LL') === PREV_MONTH_LAST_DAY.format('LL') && this.state.startDate.format('LL') === PREV_MONTH_FIRST_DAY.format('LL')) {
        lastMonth = true; tipoFecha = 'Mes anterior'
      } else if (this.state.endDate.format('LL') === PREV_WEEK_LAST_DAY.format('LL') && this.state.startDate.format('LL') === PREV_WEEK_FIRST_DAY.format('LL')) {
        lastWeek = true; tipoFecha = 'Semana anterior'
      } else if (this.state.endDate.format('LL') === TODAY.format('LL') && this.state.startDate.format('LL') === PREV_90_FIRST_DAY.format('LL')) {
        last90 = true; tipoFecha = 'Últimos 90 días'
      } else {
        personalizado = true;
      }
    }
    return (
      <div data-id='container-calendar' className='button-calendar-react-dates1' data-tipofecha={tipoFecha} onClick={(e) => this.openClendar(e, tipoFecha)} >

        <i className="material-icons icon-calendar-react-date"> calendar_today </i>
        <span className='fecha_no_personalizada'>{tipoFecha}</span>

        <span className='date-dp' startdate={this.state.startDate ? 'true' : 'false'} ></span>
        <span className='date-dp' enddate={this.state.endDate ? 'true' : 'false'} ></span>
        <DateRangePicker

          startDate={this.state.startDate} // momentPropTypes.momentObj or null,
          startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
          endDate={this.state.endDate} // momentPropTypes.momentObj or null,
          endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
          onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
          keepOpenOnDateSelect={true}
          firstDayOfWeek={1}
          isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}

          renderDayContents = {this.rendarDay}
          numberOfMonths={1}
          navPrev={this.navPrev()} navNext={this.navNext()}

          calendarInfoPosition="bottom"
          renderCalendarInfo={() => this.renderCalendarInfo(last30, last7, lastMonth, lastWeek, last90, personalizado)}
          anchorDirection="right"
          hideKeyboardShortcutsPanel
          readOnly
          onClose={(value) => this.onClose(value)}
          displayFormat="DD/MM/YYYY"

        />
      </div>

    )
  }

}



function mapStateToProps(state) { return { endDate: state.tracking.paneles.keywords.dates.endDate, startDate: state.tracking.paneles.keywords.dates.startDate, } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setDateKeywords }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(DatePicker);