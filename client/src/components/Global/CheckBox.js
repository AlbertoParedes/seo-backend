import React, {Component} from 'react';
class Checkbox extends Component {

  shouldComponentUpdate = nextProps => {
    if(this.props.checked!==nextProps.checked)return true;
    return false;
  }

  render(){
    return(
      <div className={`container-item-check-box ${this.props._class?this.props._class:''}`} onClick={()=>this.props.changeValue(this.props.checked?false:true)}>
        <div>
          <div className={`checkbox-container-w2a checkbox-w2a  ${this.props.checked?'checkbox-w2a-active':''}`} ></div>
        </div>
        {this.props.text?
          <span>{this.props.text}</span>
        :null}


      </div>
    )
  }

}

export default  Checkbox
