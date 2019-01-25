import React from 'react'
import Input from '../InputComponent'
import Select from '../SelectComponent'
import './newTournament.css'
import close from '../../assets/icon-close.svg'

const newTournament = () => {
  return (
    <div>
      <div className="fade" />
      <div className="newTournament">
        <div className="createBlock">
          <p>
            Create <br /> a new <br /> tournament
          </p>
        </div>
        <form>
          <img className="closeBlock" onClick={this.createToutnament} src={close} />

          <div className="wrapForm">
            <div className="topBlock">
              <Input label="Name" name="" placeholder="" type="text" />
              <Select label="Tournament (from list)" option="Tournament Name" />
              <Input label="Entry $" name="" placeholder="" type="text" />
            </div>
            <p>Rules</p>
            <div className="rules-inputs">
              <input placeholder="Cost" type="text" />
              <input placeholder="Cost" type="text" />
              <input placeholder="Cost" type="text" />
              <input placeholder="Cost" type="text" />
              <input placeholder="Cost" type="text" />
              <input placeholder="Cost" type="text" />
            </div>
            <div className="bottom-btn">
              <button onClick="">Create</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default newTournament
