## AUTHENTICATION
### Авторизация пользователя через OAUTH
Тип запроса: **POST**<br/>
Endpoint: **/api/authenticate/oauth**<br/>
Если пользователя с данным email не существует, тогда создаём нового пользователя и авторизируем его

## USERS
### Получение информации о пользователе
Тип запроса: **GET**<br/>
Endpoint: **/api/user/:id**<br/>
Response:<br/>
```javascript
  {
    imageUrl: string,
    username: string,
    summonerName: string,
    regionId: regionId,
    preferredPosition: 'adc' | 'mid' | 'top' | 'jungle' | 'supp',
  }
```

### Редактирование пользователем информации о себе
Тип запроса: **PUT**<br/>
Endpoint: **/api/user/me**<br/>
Body:<br/>
```javascript
  summonerName: string,
  imageUrl: string,
  about: string,
  regionId: regionId,
  prefferedPosition: 'adc' | 'mid' | 'top' | 'jungle' | 'supp',
```

## TOURNAMENTS
### Создание турнира
Тип запроса: **POST**<br/>
Endpoint: **/api/tournaments/**<br/>
Body:<br/>
```javascript
{
  id: tournamentId // mongo db сама сгенерит его,
  name: string,
  description?: string,
  imageUrl?: string,
  createdAt: Date, // проставляем дату на сервере
  startAt: Date, // предположительное ВРЕМЯ начала и день КОГДА будет проходить турнир
  rewards: [{ rewardId, rewardPositionId }], // если юзер не передал награды, то сохраняем пустой массив []
  price: number, // стоимость участия, если 0 - то бесплатно.
  rules: [{ ruleId: number }], // Массив правил. Правила - статическая сущность.
  creatorId: userId, // id юзера создавшего турнир - берем его текущий id
  summoners: [userId], // массив игроков, которые будут участвовать в матчах (их должно быть 10), по умолчанию [],
```

### Редактирование турнира
Тип запроса: **PUT**<br/>
Endpoint: **/api/tournaments/:id**<br/>
Body:<br/>
```javascript
{
  name: string,
  description: string,
  imageUrl: string,
  isReady: boolean, // отдельная кнопка
  summoners: [userId], // массив игроков, которые будут участвовать в матчах (их должно быть 10), по умолчанию [],
  applicants: [userId], // можно редактировать до начала турнира,
  viewers: [{ userId, summoners: [userId] }]
}
```

### Получение списка всех турниров
Тип запроса: **GET**<br/>
Endpoint: **/api/tournaments/**

### Получение определённого турнира
Тип запроса: **GET**<br/>
Endpoint: **/api/tournaments/:id**

### Получение списка турниров юзера
Тип запроса: **GET**<br/>
Endpoint: **/api/tournaments/user/:id**

### Предложить себя в качестве участника матча
Тип запроса: **POST**<br/>
Endpoint: **/api/tournaments/:id/apply**<br/>

### Принять участие в турнире в качестве зрителя выбравшего свою фентези-команду
Тип запроса: **POST**<br/>
Endpoint: **/api/tournaments/:id/setup**<br/>
Body:<br/>
```javascript
{
  summoners: [userId], // массив призывателей, которых выбрал зритель в качестве своей фентези-команды
}
```
### Финализация турнира
Тип запроса: **GET**<br/>
Endpoint: **/api/tournaments/:id/finalize**<br/>

## REWARD
### Получение списка наград пользователя
Тип запроса: **GET**<br/>
Endpoint: **/api/rewards/my**<br/>
id пользователя можно достать из токена

## ADMIN
### Обновление данных о пользователе
Тип запроса: **PUT**<br/>
Endpoint: **/api/admin/user/:id**<br/>
Body:<br/>
```javascript
  {
    email: string,
    username: string,
    imageUrl: string,
    username: string,
    summonerName: string,
    roles: 'admin' | 'streamer',
    regionId: regionId,
    preferredPosition: 'adc' | 'mid' | 'top' | 'jungle' | 'supp',
  }
```
### Удалить пользователя
Тип запроса: **DELETE**<br/>
Endpoint: **/api/admin/user/:id**<br/>