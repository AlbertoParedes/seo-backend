import React, { Component } from 'react';
import firebase from '../../firebase/Firebase';
import { connect } from 'react-redux';
const db = firebase.database().ref();

class SignIn extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      user:null,
      error: ''
    };
  }
  componentWillMount(){

  }

  enterKey = event => {if(event.key === 'Enter'){this.signIn()}}

  signIn = () => {

    this.setState({error:''})
    var { username, password } = this.state;
    var user = null;
    //buscamos el email asociado al username del empleado
    db.child('Empleados').orderByChild('username').equalTo(username).once("value", snapshot => {

      snapshot.forEach( data => {
        if(data.val().password===password){
          user=data.val();
          user.password=null;
        }
      })
    })
    .then( () => {
      //si existe un email comprobamos la contraseña y el email, y si son correctos iniciamos sesion
      if(user) {
        firebase.auth().signInWithEmailAndPassword(user.email, password)
        .catch(error => {
          console.log(error);
        });
      }
      else this.setState({error:'El usuario o la contraseña son incorrectos'})
    })
    .catch (err=>{
      console.log(err);
    })
  }

/*  arreglar = () => {

    var multiPath = {}
    db.child('Resultados').once("value", snapshot => {

      snapshot.forEach( data => {

        var id_cliente = data.key;
        var keywords = data.val()


        Object.entries(keywords).forEach(([k,e])=>{

          var id_keyword = k

          Object.entries(e.dates).forEach(([k2,e2])=>{

            var fecha = k2.split('-')
            if(fecha[2].length===1){

              var newDay = '0'+fecha[2];
              var newFecha = fecha[0]+'-'+fecha[1]+'-0'+fecha[2];
              var obj = e2;
              obj.id_date = newFecha;
              multiPath[`Resultados/${id_cliente}/${id_keyword}/dates/${k2}`]=null

            }

          })


        })

      })

      console.log(multiPath);
      db.update(multiPath)

    })

  }
*/
  render() {
    //if(!this.props.empleado)return null;
    return (
      <div>

        <div className="containerApp contLogin">
            <h1 className="is">Iniciar sesión</h1>
            <div >

              <div className={`container-simple-input `}>
                <div className='title-input'>Username:</div>
                <div className='container-input'>
                  <input id="username" type="text" className="TextInput TextInput_large" onChange={ event => this.setState({username: event.target.value})}/>
                </div>
              </div>

              <div className={`container-simple-input `}>
                <div className='title-input'>Password:</div>
                <div className='container-input'>
                  <input id="password" type="password" className="TextInput TextInput_large" onKeyPress={ event => this.enterKey(event)} onChange={ event => this.setState({password: event.target.value})}/>
                </div>
              </div>


              <div><span className="login_info">{this.state.error}</span></div>
              <div className='container-btn-log-in'>
                <div onClick={ () => this.signIn() } className="btnContinuar">Log in</div>
              </div>
            </div>
        </div>


      </div>
    );
  }
}

function mapStateToProps(state){return{ empleado:state.empleado }}

export default connect(mapStateToProps)(SignIn);
