import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setPopUpInfo } from '../../redux/actions';

let timeOut;
class PopupInfo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      visibility: this.props.visibility,
      text: this.props.text,
      status: this.props.status,
    }
  }

  componentWillReceiveProps = (newProps) => {
    clearTimeout(timeOut)
    var container = this.refs.container;

    if (this.state.visibility && newProps.visibility && container.classList.value.includes('container-pop-up-info-visible')) {

      container.classList.remove('container-pop-up-info-visible')
      timeOut = setTimeout(() => {
        container.classList.add('container-pop-up-info-visible')
        this.setState({
          visibility: newProps.visibility,
          text: newProps.text,
          status: newProps.status,
          moment: newProps.moment
        }, () => { this.showPopUp() })
      }, 300);
    } else {
      container.classList.add('container-pop-up-info-visible')
      this.setState({
        visibility: newProps.visibility,
        text: newProps.text,
        status: newProps.status,
        moment: newProps.moment
      }, () => { this.showPopUp() })
    }






  }

  showPopUp = () => {



    if (this.state.visibility) {
      timeOut = setTimeout(() => {
        this.props.setPopUpInfo({ visibility: false, text: this.state.text, status: this.state.status })
      }, 3500);
    }

  }

  render() {
    return (
      <div ref={'container'} className={`container-pop-up-info ${this.state.visibility ? 'container-pop-up-info-visible' : ''}`}>
        {this.state.status ?
          <div className={`container-pop-up-info-icon status-${this.state.status}`}>
            <i className="material-icons">{this.state.status}</i>
          </div>
          : null
        }

        <div>{this.state.text}</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    visibility: state.global.popupInfo.visibility,
    text: state.global.popupInfo.text,
    status: state.global.popupInfo.status,
    moment: state.global.popupInfo.moment,
  }
}
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PopupInfo);