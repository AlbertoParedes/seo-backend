import React, {Component} from 'react'

class EmpleadoItem extends Component {

  constructor(props){
    super(props)
    this.state={

    }
  }

  changeFollows = (num) =>{
    this.props.changeFollows(num)
  }

  changeNoFollows = (num) =>{
    this.props.changeNoFollows(num)
  }

  render(){
    return(

      <div className='ei-contenedor pr'>

        <i className="material-icons clear-empleado" onClick={()=>{this.props.deleteEmpleado()}}>clear</i>

        {/* parte superior */}
        <div className='ei-parte-superior'>

          {/* container foto*/}
          <center>
            <img className="ei-picture" alt="" src={this.props.empleado.foto}/>
          </center>

          {/* container nombre*/}
          <div className='ei-nombre'>
            {this.props.empleado.nombre} {this.props.empleado.apellidos}
          </div>
          <div className='ei-tipo-empleado'>
            {this.props.empleado.role}
          </div>

        </div>

        {/* parte inferior */}
        {this.props.tipo && this.props.tipo==='follows'?

          <div>

            {/* container folloes y no follows*/}
            <div className='ei-container-links'>

              {/* follows*/}
              <div className='ei-follows'>
                <div><input className='ei-input-follows' value={this.props.follows} onChange={e=>this.changeFollows(e.target.value)}/></div>
                <div className='ei-subtitle-follows'>Follows</div>
              </div>

              {/*nofollows*/}
              <div className='ei-nofollows'>
                <div><input className='ei-input-nofollows' value={this.props.nofollows} onChange={e=>this.changeNoFollows(e.target.value)}/></div>
                <div className='ei-subtitle-follows'>Nofollows</div>
              </div>

            </div>

          </div>

        :null}



      </div>
    )
  }

}

export default EmpleadoItem
