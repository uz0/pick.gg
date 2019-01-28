import React from 'react'
import Input from '../input'
import Select from '../select'
import Button from '../button'
import './newTournament.module.css'
import style from './newTournament.module.css'

const newTournament = ({ closeTournament }) => {
  return (
    <div className={style.wrap}>
      <div className={style.newTournament}>
        <div className={style.createBlock}>
          <p>Create a new tournament</p>
        </div>
        <form>
          <Button onClick={closeTournament} className={style.closeBlock} />
          <div className={style.wrapForm}>
            <div className={style.topBlock}>
              <Input label="Name" name="" placeholder="" type="text" />
              <Select label="Tournament (from list)" option="Tournament Name" />
              <Input label="Entry $" name="" placeholder="" type="text" />
            </div>
            <p>Rules</p>
            <div className={style.rulesInputs}>
              <input placeholder="Cost" type="text" />
              <input placeholder="Cost" type="text" />
              <input placeholder="Cost" type="text" />
              <input placeholder="Cost" type="text" />
              <input placeholder="Cost" type="text" />
              <input placeholder="Cost" type="text" />
            </div>
            <div className={style.bottomBtn}>
              <Button text={'Create'} />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default newTournament
