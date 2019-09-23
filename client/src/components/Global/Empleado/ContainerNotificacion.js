
import React, { Component } from 'react'
import ItemNotificacion from './ItemNotificacion'
class ContainerNotificacion extends Component {
  componentWillMount = () => { document.addEventListener('mousedown', this.clickOutSide, false); }
  componentWillUnmount = () => { document.removeEventListener('mousedown', this.clickOutSide, false); }
  clickOutSide = (e) => { if (!this.node.contains(e.target)) { this.props.close() } }
  render() {
    return (
      <div className='container-notificacions' ref={node => this.node = node}>
        <div>
          <div class="size-medios-popup scroll-bar-exterior">

            {this.props.notificaciones.map((item, key) => {
              return (
                <ItemNotificacion key={key} item={item} close={() => this.props.close()} />
              )

            })

            }
          </div>
        </div>
      </div>
    )
  }
}

export default ContainerNotificacion