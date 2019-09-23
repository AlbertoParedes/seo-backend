import React, {Component} from 'react';
import * as functions from './functions'
class SimpleInput extends Component {

    constructor(props){
      super(props);
      this.state = {
        title:this.props.title,
        text:this.props.text,
        _class:this.props._class,
        _class_input:this.props._class_input
      }
    }

    componentWillReceiveProps = newProps => {
      if(this.state.text!==newProps.text){this.setState({text:newProps.text})}
    }

    changeFloat = (text) => {
      if(functions.isNumber(text)){
        this.props.changeValue(text.trim())
      }
    }

    changeInt = (text) => {
      if(functions.isNumber(text) && !text.includes('.') && !text.includes(',')){

        this.props.changeValue(text.trim())
      }
    }

    changeEmail = (text) => {
      if(functions.isEmail(text)){
        this.props.changeValue(text)
      }
    }
    changePhone = (text) => {
      if(functions.isTelefono(text)){
        this.props.changeValue(text)
      }
    }

    render() {
      return (
        <div className={`container-simple-input ${this.state._class?this.state._class:''}`}>
          <div className='title-input'>{this.state.title}:</div>
          <div className={`container-input ${this.props._class_container?this.props._class_container:''}`}>

            {!this.props.type?
              <input className={` ${this.state._class_input?this.state._class_input:''}`} value={this.state.text?this.state.text:''} onChange={e=>this.props.changeValue(e.target.value)}/>:null
            }

            {this.props.type && this.props.type==='float'?
              <input className={` ${this.state._class_input?this.state._class_input:''}`} value={this.state.text?this.state.text:''} onChange={e=>this.changeFloat(e.target.value)}/>:null
            }

            {this.props.type && this.props.type==='int'?
              <input className={` ${this.state._class_input?this.state._class_input:''}`} value={this.state.text?this.state.text:''} onChange={e=>this.changeInt(e.target.value)}/>:null
            }

            {this.props.type && this.props.type==='email'?
              <input className={` ${this.state._class_input?this.state._class_input:''}`} value={this.state.text?this.state.text:''} onChange={e=>this.changeEmail(e.target.value)}/>:null
            }

            {this.props.type && this.props.type==='phone'?
              <input className={` ${this.state._class_input?this.state._class_input:''}`} value={this.state.text?this.state.text:''} onChange={e=>this.changePhone(e.target.value)}/>:null
            }

            {this.props.type && this.props.type==='block'?
              <input className={` ${this.state._class_input?this.state._class_input:''}`} value={this.state.text?this.state.text:''} readOnly={true}/>:null
            }




          </div>
        </div>
      );
    }
}

export default SimpleInput;
