import React, {Component} from 'react';
class StatusBar extends Component {

    constructor(props){
      super(props);
      this.state = {
        cantidad:this.props.cantidad,
        itemSelected: this.props.itemSelected
      }
    }

    componentWillReceiveProps = (newProps)  => {
      if(this.state.cantidad!==newProps.cantidad){this.setState({cantidad:newProps.cantidad})}
      if(this.state.itemSelected!==newProps.itemSelected){this.setState({itemSelected:newProps.itemSelected})}
    }

    render() {
      return (


        <div className='bar-status-form'>

          {
            this.state.cantidad.map((c,k)=>{
              var paso = k+1;
              return(
                <div key={k} className='display_inline_flex'>
                  <div className={`container-circles ${this.state.itemSelected===paso?'external-circle':''}`}>
                    <div className={`bar-circle ${paso<=this.state.itemSelected?'bar-circle-done':''}`}>{paso}</div>
                  </div>

                  {
                    paso<this.state.cantidad.length?
                      <div className='display_inline_flex'>
                        <div className={`line-separate ${paso<=this.state.itemSelected?'line-separate-active':''}`}></div>
                        <div className={`line-separate ${paso<this.state.itemSelected?'line-separate-active':''}`}></div>
                      </div>
                    :null
                  }


                </div>
              )
            })
          }

        </div>
      )
    }
}

export default StatusBar;

/*
<div className='container-circles external-circle'>
  <div className='bar-circle bar-circle-done'>1</div>
</div>

<div className='line-separate line-separate-active'></div>
<div className='line-separate'></div>

<div className='container-circles'>
  <div className='bar-circle'>2</div>
</div>

<div className='line-separate'></div>
<div className='line-separate'></div>

<div className='container-circles'>
  <div className='bar-circle'>3</div>
</div>

<div className='line-separate'></div>
<div className='line-separate'></div>

<div className='container-circles'>
  <div className='bar-circle'>4</div>
</div>

<div className='line-separate'></div>
<div className='line-separate'></div>

<div className='container-circles'>
  <div className='bar-circle'>5</div>
</div>

<div className='line-separate'></div>
<div className='line-separate'></div>

<div className='container-circles'>
  <div className='bar-circle'>6</div>
</div>

<div className='line-separate'></div>
<div className='line-separate'></div>

<div className='container-circles'>
  <div className='bar-circle'>7</div>
</div>
*/
