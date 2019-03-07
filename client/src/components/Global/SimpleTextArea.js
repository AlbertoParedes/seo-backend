import React, {Component} from 'react';
class SimpleTextArea extends Component {

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

    render() {
      return (
        <div className={`container-simple-input ${this.state._class?this.state._class:''}`}>
          <div className='title-input'>{this.state.title}:</div>

            <textarea className={`txtarea-simple ${this.state._class_input?this.state._class_input:''}`} value={this.state.text} onChange={e=>this.props.changeValue(e.target.value)}/>

        </div>
      );
    }
}

export default SimpleTextArea;
