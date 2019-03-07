import React, {Component} from 'react';
class RadioButton extends Component {

    constructor(props){
      super(props);
      this.state = {
      // checked: this.props.checked,
      }
    }

    componentWillReceiveProps = (newProps)  => {
    }


    checkItem = (e) => {
      //$('#panel_cargando').removeClass('display_none')
      this.setState({checked: this.state.checked ? false : true}, () => {

          if(this.props.json){

            var json = this.props.json;
            //json['valor']= !this.state.checked?false:json.valor;
            this.props.callbackCheckItem(json);

          }else{
            this.props.callbackCheckItem(this.state.checked)
          }

      });
    }

    render() {
      return (
        <div onClick={event => this.checkItem(event.currentTarget)}  data-checked={this.props.checked ? true : false}>
          <i className={`material-icons radio-btn-select ${this.props.checked?'color_corporativo':''}`}>{this.props.checked?'radio_button_checked':'radio_button_unchecked'}</i>
        </div>
      );
    }
}

export default RadioButton;
