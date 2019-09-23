import React, { Component } from 'react'
import moment from 'moment'
class Temporizador extends Component {

  constructor(props) {
    super(props)
    this.state = {
      inicio: this.props.inicio,
      sumatorio: this.props.sumatorio,
      contador: this.props.contador
    }
  }

  componentWillReceiveProps = newProps => {
    if (this.state.inicio !== newProps.inicio || this.state.sumatorio !== newProps.sumatorio || this.state.contador !== newProps.contador) {
      this.setState({
        inicio: newProps.inicio,
        sumatorio: newProps.sumatorio,
        contador: newProps.contador,
      }, () => {
        this.reloadTimer();
        if (!this.state.contador) {
          clearInterval(this.timerID);
        } else {
          clearInterval(this.timerID);
          this.activarContador()
        }
      })
    }
  }

  componentWillMount = () => {
    this.reloadTimer()
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  reloadTimer = () => {
    var date1 = moment(new Date(this.state.inicio));
    var date2 = moment(new Date());
    var diff = date2.diff(date1, 'seconds');
    this.setState({ timer: diff + this.state.sumatorio })
  }

  componentDidMount() {
    this.activarContador()
  }
  activarContador = () => {
    if (this.state.contador) {
      this.timerID = setInterval(() => {
        this.setState({ timer: this.state.timer + 1 })
      },
        1000
      );
    }
  }

  render() {
    var seconds = this.state.timer;
    var days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * (24 * 60 * 60);
    var hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * (60 * 60);
    var minutes = Math.floor(seconds / (60));
    seconds -= minutes * (60);

    if (seconds < 10) {
      seconds = '0' + seconds
    }

    if (minutes < 10) {
      minutes = '0' + minutes
    }

    if (hours < 10) {
      hours = '0' + hours
    }

    if (days < 10) {
      days = '0' + days
    }

    return (
      <div className='counter'>

        {(+days) > 0 && (+days) < 100 ? <div className='counter-number'>{days}</div> : null}
        {(+days) > 0 && (+days) < 100 ? <div className='dots-counter'>:</div> : null}

        <div className='counter-number'>{hours}</div>
        <div className='dots-counter'>:</div>

        <div className='counter-number'>{minutes}</div>
        <div className='dots-counter'>:</div>
        <div className='counter-number'>{seconds}</div>
      </div>
    )
  }

}

export default Temporizador;