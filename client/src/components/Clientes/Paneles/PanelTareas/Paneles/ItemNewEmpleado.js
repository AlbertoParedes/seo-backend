import React, { Component } from 'react';
import Checkbox from '../../../../Global/CheckBox';

class ItemNewEmpleado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      checkbox:this.props.checkbox,
      empleados: this.props.empleados,
      empleadosSeleccionados: this.props.empleadosSeleccionados,
      empleadosOrdenados:[]
    }
  }

  componentWillReceiveProps = (newProps) => {    
    if(this.state.empleadosSeleccionados!==newProps.empleadosSeleccionados){
      this.setState({empleadosSeleccionados:newProps.empleadosSeleccionados})
    }
  }

  componentWillMount = () => { 
    document.addEventListener('mousedown', this.clickOutSide, false); 
    this.ordernarEmpleados()
  }
  componentWillUnmount = () => { document.removeEventListener('mousedown', this.clickOutSide, false); }
  clickOutSide = (e) => { if (!this.node.contains(e.target)) { this.close() } }
  close = () => { this.props.close() }

  ordernarEmpleados = () => {
    var empleadosOrdenados = Object.entries(this.state.empleados)
    empleadosOrdenados.sort((a, b) => {
      a = a[1]; b = b[1]
      
      var fullNameA = `${a.nombre} ${a.apellidos}`;
      var fullNameB = `${b.nombre} ${b.apellidos}`;
      if (fullNameA.toLowerCase() > fullNameB.toLowerCase()) { return 1; }
      if (fullNameA.toLowerCase() < fullNameB.toLowerCase()) { return -1; }
      
      return 0;
    });
    this.setState({empleadosOrdenados})
  }

  passText = () => {
    this.props.passTag(this.state.text);
    this.close();
  }

  selectEmpleado = (index) => {
    this.props.selectEmpleado(index)
    //this.close()
  }

  changeValue = (valor, index) => {

    if(valor){
      this.props.selectEmpleado(index)
    }else{
      this.props.deleteEmpleado(index)
    }
    
  }

  nothing = () => {
    
  }

  render() {

    var empleadosOrdenados = JSON.parse(JSON.stringify(this.state.empleadosOrdenados));
    var obj = [
      'cliente',
      {
        nombre : 'Cliente', apellidos:''
      }
    ]
    
    empleadosOrdenados.unshift(obj)

    return (
      <div className={`addNewEmpleadosTags ${this.props._class?this.props._class:''}`} onClick={(e) => e.stopPropagation()} ref={node => this.node = node}>
        <i className={`material-icons close-tag-key`} onClick={() => this.props.close()} >close</i>
        <div className='CTGSE'>
          <input placeholder={'Busca a un empleado'} ref='InputTags' value={this.state.text} onChange={e => this.setState({ text: e.target.value })} autoFocus={true} />
        </div>

        <div className='container-empleados-task-sc'>

          {
            empleadosOrdenados.map((item, index) => {
              index=item[0]
              item = item[1];
              //if (!item.activo) return null;

              //if (this.props.empleadosSeleccionados[index]) return null
              var fullName = `${item.nombre} ${item.apellidos}`;
              if (this.state.text.trim() !== '' && !fullName.toLocaleLowerCase().includes(this.state.text.toLocaleLowerCase())) return null
              return (
                <div key={index}  onClick={ (e) => { !this.state.checkbox?this.selectEmpleado(index):this.nothing() }}>
                  {this.state.checkbox?
                    <Checkbox changeValue={(valor)=>this.changeValue(valor, index)} text={fullName} checked={this.props.empleadosSeleccionados[index]?true:false}/>
                  :null}

                  {!this.state.checkbox?<span>{fullName}</span>:null}
                  
                </div>
              )
            })

          }



        </div>
      </div >
    )
  }
}

export default ItemNewEmpleado