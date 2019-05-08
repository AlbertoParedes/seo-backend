import React,{Component} from 'react'
import EnlacesDisponibles from './EnlacesDisponibles'
import EnlacesUtilizados from './EnlacesUtilizados'

import { connect } from 'react-redux';



class PanelEnlaces extends Component {

  constructor(props){
    super(props)
    this.state={
      medio_seleccionado:this.props.medio_seleccionado,
      enlaces_disponibles:[],
      enlaces_utilizados:[]
    }
  }

  componentWillMount = () => {
    if(this.state.medio_seleccionado){this.setEnlaces()}
  }
  componentWillReceiveProps = newProps => {
    if(this.state.medio_seleccionado!==newProps.medio_seleccionado){this.setState({medio_seleccionado:newProps.medio_seleccionado}, ()=> {this.setEnlaces()}) }
  }

  setEnlaces = () => {

    if(this.state.medio_seleccionado.enlaces){

      var enlaces_disponibles_ordenados = [], enlaces_utilizados_ordenados=[];

      Object.entries(this.state.medio_seleccionado.enlaces).forEach(([k,e])=>{
        //Si contiene un id del cliente significa que este enlace ya ha sido utilizado
        if(e.id_cliente){ enlaces_utilizados_ordenados.push(e)
        }else{ enlaces_disponibles_ordenados.push(e) }
      })

      enlaces_disponibles_ordenados.sort((a, b) =>{ //a=a[1]; b=b[1]
        if (a.timestamp > b.timestamp) { return 1; }
        if (a.timestamp < b.timestamp) { return -1; }
        return 0;
      });
      enlaces_disponibles_ordenados.reverse()

      enlaces_utilizados_ordenados.sort((a, b) =>{ //a=a[1]; b=b[1]
        if (a.timestamp > b.timestamp) { return 1; }
        if (a.timestamp < b.timestamp) { return -1; }
        return 0;
      });
      enlaces_utilizados_ordenados.reverse()
      this.setState({enlaces_disponibles:enlaces_disponibles_ordenados,enlaces_utilizados:enlaces_utilizados_ordenados})
    }else{
      this.setState({enlaces_disponibles:[],enlaces_utilizados:[]})
    }

  }

  render(){

    return(
      <div className='container-informacion'>

        <EnlacesDisponibles

          id_medio={this.props.medio_seleccionado.id_medio}
          enlaces_disponibles={this.state.enlaces_disponibles}
        />

        <EnlacesUtilizados

          id_medio={this.props.medio_seleccionado.id_medio}
          enlaces_utilizados={this.state.enlaces_utilizados}
        />


      </div>
    )
  }

}
function mapStateToProps(state){return{ medio_seleccionado: state.linkbuilding.medios.tipos.paid.medio_seleccionado, }}
export default connect(mapStateToProps)(PanelEnlaces);
