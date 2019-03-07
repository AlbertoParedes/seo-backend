import React, {Component} from 'react';
class Cookies extends Component {

    constructor(props){
      super(props);
      this.state = {
        verCookies:true
      }
    }

    acceptCookies = () => {
      this.setState({verCookies:false})
    }

    render() {
      if(!this.state.verCookies)return null;
      return (
        <div id="catapult-cookie-bar" className=" rounded-corners drop-shadowfloat-accept">
          <div className="cdlopd-inner ">
            <span className="cdlopd-left-side">Esta página utiliza cookies y otras tecnologías para que podamos mejorar su experiencia en nuestros sitios:
              <a className="cdlopd-more-info-link" tabIndex="0" target="_blank" rel="noopener noreferrer" href="https://w2americandream.es/home-en/"> Más información.</a>
            </span>
            <span className="cdlopd-right-side">
              <button id="catapultCookie" tabIndex="0" onClick={()=>this.acceptCookies()}>Acepto</button>
            </span>
          </div>
        </div>
      );
    }
}

export default Cookies;
