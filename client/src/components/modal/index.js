import React from 'react'
import Button from '../button'

class Modal extends Component {
 render(){
   return (
    <div className="wrapper">
      <div className="modal">
        <Button 
          className={style.close}
          onClick={this.props.close}
        ></Button>
      </div>
    </div>
 }
}
