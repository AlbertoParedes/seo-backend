import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import $ from 'jquery';
export default class ListaClientes extends Component {

  constructor(props){
    super(props);
    this.state = {
      clss: this.props.clss,
      id: this.props.id,
      position: this.props.position
    }
  }

  changeMonth = (x) =>{
    var m = ("0" + $(x).attr('data-m-sld')).slice(-2);
    var y = $(x).attr('data-y-sld');
    var fecha = y+"-"+m;
    this.props.setFecha(fecha);
  }
  render() {
    return (
      <div className={`${this.state.position?this.state.position:''}`}>
        <input onClick={event=>this.changeMonth(event.currentTarget)} id={this.state.id} className={this.state.clss} data-lock="to" type="text" data-lang="es" data-min-year="2017" data-large-mode="false" data-format="F" data-default-date={`${this.props.month}/1/${this.props.year}`}/>
        <Helmet>
          <script type="text/javascript">{`$('input#${this.state.id}').dateDropper();`}</script>
        </Helmet>
      </div>
    );
  }
}
// <script type="text/javascript"> $(`input#${this.state.id}`).dateDropper(); </script>
