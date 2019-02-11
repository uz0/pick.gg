import React, { Component } from 'react'
import AuthService from '../../services/authService'
import TournamentService from '../../services/tournamentService'
import { NavLink } from 'react-router-dom'
import uuid from 'uuid'
import style from './rating.module.css'

class Rating extends Component {
  constructor() {
    super()
    this.AuthService = new AuthService()
    this.TournamentService = new TournamentService(); 
    this.state = {
        arrPlayers: [
          {number: 1, name: "Painkiller", percent: 2.4, img_url: "http://download.seaicons.com/icons/bad-blood/yolks-2/256/eyes-on-fire-icon.png"},
          {number: 2, name: "Felix", percent: 2.1, img_url:"http://www.avatar-mix.ru/avatars_low_200x200/1427.jpg"},
          {number: 3, name: "Gart",percent: 1.9, img_url:"https://yasdnepra.com/download/file.php?avatar=16801_1514274042.png"},
          {number: 4, name: "Mario",percent: 1.8, img_url:"http://avatarbox.net/avatars/img26/south_park_chef_avatar_picture_62880.png"},
          {number: 5, name: "Jack M.",percent: 1.5, img_url:"https://s.gravatar.com/avatar/c5b6bf542ec004619ea119551ed47998?size=100&default=retro"},
          {number: 6, name: "Mr. D",percent: 1.4, img_url:"https://wf.mail.ru/forums/image.php?u=1339510&dateline=1468449541"},
          {number: 7, name: "NetSky",percent: 1.2, img_url:"https://iknowyourmeme.files.wordpress.com/2016/04/6ee.jpg?w=616"},
          {number: 8, name: "Zzz",percent: 1.1, img_url:"http://www.avatarsdb.com/avatars/panda_kiss.gif"},
          {number: 9, name: "Navi",percent: 1, img_url:"http://rs891.pbsrc.com/albums/ac113/Onigiri_Iconz/Fairy%20Tail/Happy/6.png~c200"},
        ],
    }
  }
  
  handleChange = () => {}

  render() {
    return (
      <div className={style.home_page}>
        <div className={style.bg_wrap} />
        <main>
          <h1>Best Players rankings</h1>
          <div className={style.content}>
            <div className={style.header_table}>
              <div className={style.number_header}>#</div>
              <div className={style.name_header}>Name</div>
              <div className={style.percent_header}>%</div>
            </div>
            {this.state.arrPlayers.map(item => (
              <NavLink key={uuid()} className={style.item_table} to="/user/1">
              <div>{item.number}.</div>
              <div className={style.avatar_table}><img src={item.img_url}/></div>
              <div className={style.name_table}>{item.name}</div>
              <div className={style.percent_table}>{item.percent}</div>
            </NavLink>
            ))}
          </div>
        </main>
      </div>
    )
  }
}

export default Rating