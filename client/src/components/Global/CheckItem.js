import React, {Component} from 'react';
class CheckeItem extends Component {

    constructor(props){
      super(props);
      this.state = {
        checked: this.props.checked,
        text: this.props.text,
        id: this.props.id,
        clss_span: this.props.clss_span,
        clss_div: this.props.clss_div,
        clss_i: this.props.clss_i,
        link: this.props.link,
        hiddeCheckBox: this.props.hiddeCheckBox,
        tipo: this.props.tipo,
      }
    }

    componentWillReceiveProps = (newProps)  => {
      if(this.state.checked!==newProps.checked) this.setState({checked: newProps.checked})
      if(this.state.text!==newProps.text) this.setState({text: newProps.text})
      if(this.state.id!==newProps.id) this.setState({id: newProps.id})
      if(this.state.clss_span!==newProps.clss_span) this.setState({clss_span: newProps.clss_span})
      if(this.state.clss_div!==newProps.clss_div) this.setState({clss_div: newProps.clss_div})
      if(this.state.clss_i!==newProps.clss_i) this.setState({clss_i: newProps.clss_i})
    }


    checkItem = (e) => {
      //$('#panel_cargando').removeClass('display_none')
      this.setState({checked: this.state.checked ? false : true}, () => {

          if(this.props.json){
            var json = this.props.json;
            json['valor']= this.state.checked;
            this.props.callbackCheckItem(json);
          }else{
            this.props.callbackCheckItem(this.state.checked)
          }

      });
    }

    render() {
      return (
        <div onClick={event => this.checkItem(event.currentTarget)} className={`item_ckecked noselect display_inline_flex ${this.state.clss_div? this.state.clss_div:''}`} data-id={this.state.id} data-checked={this.state.checked ? true : false}>
          {!this.props.hiddeCheckBox?
            <i className={`material-icons checkbox_cuadrado ${this.state.clss_i? this.state.clss_i:''} ${this.state.checked ? 'check_box_selected' : ''}`} >
              {this.state.checked ? 'check_box_selected' : 'check_box_outline_blank'}
            </i>
          : null}
          {this.props.tipo==='link'?
            <span>{this.props.text}<a rel="noopener noreferrer" href={this.props.link_1} target="_blank">{this.props.text_1}</a> {this.props.text_2} <a rel="noopener noreferrer" href={this.props.link_2} target="_blank">{this.props.text_3}</a></span>
          :
            <span className={`span_checkbox ${this.state.clss_span?this.state.clss_span:''} ${this.state.checked && this.props.listItem ? 'check_box_selected' : ''}`}>{this.state.text}</span>
          }
        </div>
      );
    }
}

export default CheckeItem;
