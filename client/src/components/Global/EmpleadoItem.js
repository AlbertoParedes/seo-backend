import React, {Component} from 'react'

class EmpleadoItem extends Component {

  constructor(props){
    super(props)
    this.state={

    }
  }

  changeFollows = (num) =>{

    if(!this.props.privilegio){
      console.log('No tienes suficientes permisos');
      return null
    }

    this.props.changeFollows(num)
  }

  changeNoFollows = (num) =>{
    if(!this.props.privilegio){
      console.log('No tienes suficientes permisos');
      return null
    }
    this.props.changeNoFollows(num)
  }

  render(){
    return(

      <div className='ei-contenedor pr'>
        {this.props.privilegio?
          <i className="material-icons clear-empleado" onClick={()=>{this.props.deleteEmpleado()}}>clear</i>
        :null}

        {/* parte superior */}
        <div className='ei-parte-superior'>

          {/* container foto*/}
          <center>
            <img className="ei-picture" alt="" src={this.props.empleado?this.props.empleado.foto:null}/>
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
                <div><input className={`ei-input-follows ${this.props.errorFollows || (+this.props.follows)<0 || this.props.follows.toString().includes('.') || this.props.follows.toString()===''?'color-wrong':''}`} value={this.props.follows} onChange={e=>this.changeFollows(e.target.value)}/></div>
                <div className={`ei-subtitle-follows ${this.props.errorFollows || (+this.props.follows)<0 || this.props.follows.toString().includes('.') || this.props.follows.toString()===''?'color-wrong':''}`}>Follows</div>
              </div>

              {/*nofollows*/}
              <div className='ei-nofollows'>
                <div><input className={`ei-input-nofollows ${this.props.errorNofollows || (+this.props.nofollows)<0 || this.props.nofollows.toString().includes('.') || this.props.nofollows.toString()===''?'color-wrong':''}`} value={this.props.nofollows} onChange={e=>this.changeNoFollows(e.target.value)}/></div>
                <div className={`ei-subtitle-follows ${this.props.errorNofollows || (+this.props.nofollows)<0 || this.props.nofollows.toString().includes('.') || this.props.nofollows.toString()===''?'color-wrong':''}`}>Nofollows</div>
              </div>

            </div>

          </div>

        :null}



      </div>
    )
  }

}

export default EmpleadoItem
