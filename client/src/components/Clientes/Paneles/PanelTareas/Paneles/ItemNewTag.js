import React, { Component } from 'react';

class ItemNewTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  }
  componentWillMount = () => { document.addEventListener('mousedown', this.clickOutSide, false); }
  componentWillUnmount = () => { document.removeEventListener('mousedown', this.clickOutSide, false); }
  clickOutSide = (e) => { if (!this.node.contains(e.target)) { this.close() } }
  close = () => { this.props.close() }

  componentDidMount = () => {
    //var d = this.refs.InputTags;
    //d.focus();
    //console.log(d);

  }
  enterKey = event => { if (event.key === 'Enter') { this.passText() } }
  passText = () => {
    this.props.passTag(this.state.text);
    this.close();
  }

  render() {
    return (
      <div className={'addNewKeysTags'} ref={node => this.node = node}>
        <i className={`material-icons close-tag-key ${this.state.text.trim() !== '' ? 'addButtonTag' : ''}`} onClick={() => { this.state.text.trim() !== '' ? this.passText() : this.props.close() }} >close</i>
        <input spellCheck={false} placeholder='Separa por comas para introducir más de una etiqueta' ref='InputTags' value={this.state.text} onKeyPress={event => this.enterKey(event)} onChange={e => this.setState({ text: e.target.value })} autoFocus={true} />
      </div >
    )
  }
}

export default ItemNewTag