## Авторизация
### Авторизация пользователя через OAUTH
**POST /authenticate/oauth**<br/>
Колбек адрес куда oauth провайдер отправляет данные для авторизации.
Одновременно регистрирует если с данным email пользователя нет. 

### Авторизация пользователя по логинку / паролю
**POST /authenticate**<br/>
Запрос:<br/>
```javascript
  {
    email: string,
    password: string,
  }
```
Ответ (UserModel):<br/>
```javascript
  {
    authToken: String, // НЕ является частью модели пользователя, возвращается только с успешной авторизацией. Для ручек требующих авторизации, следует добавлять этот токен как заголовок x-access-token
    name: string,
    isAdmin: Boolean, // системное, скрытое поле, возвращается только если true 
    isVerified: Boolean, // если email не подтвержден, то false
    email: string,
    contact: string,
    imageUrl: string,
    twitchAccount: string,
    about: string,
    gameSpecificFields: {
        LOL: {
            displayName: string,
            regionId: regionId,
        },
        PUBG: {
            displayName: string
        }
    },
    summonerPoints: number, // сумма всех счетов в прошедших играх 
    viewerPoints: number, // сумма всех "прогнозов" в прошедших играх
    streamerPoints: number, // сумма просмотров всех турниров за авторством стримера
  }
```
Служебная ручка, сейчас не используется.

## Публичные контролеры
### Пользователь
**GET /public/users/:id**<br/>
Ответ (UserModel)<br/>
Для публичной страницы пользователя, не требует авторизации.

### Рейтинг
**GET /public/rating**<br/>
Ответ:<br/>
```javascript
  {
    streamersRating: [ UserModel ],
    viewersRating: [ UserModel ],
    applicantsRating: [ UserModel ]
  }
```
Не требует авторизации.
Возвращает топ 100 в каждом из направлений, простая выборка сортировкой по points "в лоб".
Используется для построения топ пользователей.

### Турнир
**GET /public/tournaments/:id**<br/>
Ответ (TournamentModel):<br/>
```javascript
  {
    name: String, // название турнира
    description: String,
    imageUrl: String, // обложка турнира
    createdAt: Date,
    startAt: Date,
    dateDetails: String, // комментарий к времени начала
    rewards: [ {
        id: String,
        position: String, // один из 'summoner', 'viewer'
        place: Number // место на котором получат награду
    } ],
    rulesTitle: String, // человеческое описание правил
    rules: String, // JS код валидатора правил, чистая функция в виде строки, аргумент - текущий пользователь и все данные результатов, а ответ число, points
    isForecastingActive: Boolean, // можно ли делать прогнозы зрителей
    isStarted: Boolean, // Отображать ли турнир в списке "активных" для просмотра
    isFinalized: Boolean, // Были ли выданы призы
    winners: [ { // победители, если турнир не завершен - массив пустой
        user: UserModel,
        position: String, // один из 'summoner', 'viewer'
        place: Number
    } ],
    applicants: [ { // Подавшие заявки на участие в турнир
        user: UserModel,
        status: String // один из 'PENDING', 'REJECTED', 'ACCEPTED'
    } ],
    viewers: [ { // Голоса пользователей
        user: UserModel,
        pick: [ { // избранные зрителем участники турнира
            summoner: UserModel,
            role: String // может быть произвольным hash, должен быть уникальным 
        } ]
    } ],
    creator: UserModel, // Автор турнира
    summoners: [ UserModel ], // участники турнира
    moderators: [ UserModel ], // пользователи имеющие полный доступ ко всем инструментам турнира
    game: String // один из 'LOL', 'PUBG'
  }
```
Не требует авторизации.
Возвращает полное представление турнира.

### Активные турниры
**GET /public/tournaments**<br/>
Ответ:<br/>
```javascript
  [ TournamentModel ]
```
Список активных турниров (isStarted: true)

### Фильтр турниров по игре
**GET /public/tournaments/game/:game**<br/>
Запрос (query):<br/>
```javascript
  {
    isForecastingActive: Boolean,
    isStarted: Boolean,
    isFinalized: Boolean,
  }
```
Ответ:<br/>
```javascript
  [ TournamentModel ]
```
Используется для поиска подходящего турнира на странице деталей игры.

## Пользователи
### Получение информации о себе
**GET /api/user/me**<br/>
Ответ (UserModel)<br/>
Требует авторизации, заголовка x-access-token

### Редактирование пользователем информации о себе
**PUT /api/user/me**<br/>
Запрос:<br/>
```javascript
    name?: string,
    contact?: string,
    imageUrl?: string,
    twitchAccount?: string,
    about?: string,
    gameSpecificFields?: {
        LOL: {
            displayName: string,
            regionId: regionId,
        },
        PUBG: {
            displayName: string
        }
    },
```
Требует авторизации

## Турниры
### Создание турнира
**POST /api/tournaments/**<br/>
Запрос:<br/>
```javascript
{
    name: string,
    description?: string,
    imageUrl?: string,
    startAt: Date,
    dateDetails?: string, // комментарий к дате начала
    rewards: [ {
        id: String,
        position: String, // один из 'summoner', 'viewer'
        place: Number // место на котором получат награду
    } ],
    price: number, // стоимость участия, если 0 - то бесплатно.
    rulesTitle: String, // человеческое описание правил начисления балов
    rules: String, // JS код валидатора правил
    moderators: [ userId ],
    game: String, // один из 'LOL', 'PUBG'
```

### Редактирование турнира
**PUT /api/tournaments/:id**<br/>
Запрос:<br/>
```javascript
{
    isForecastingActive: Boolean, // можно установить в true, только после isStarted: true
    isStarted: Boolean, // если true, то большинство полей нередактируемы
    isFinalized: Boolean, // если true, будут расчитаны и выданы награды - после редактировать запрещено
    name: string,
    description?: string,
    imageUrl?: string, // нельзя редактировать после isStarted
    startAt: Date, // нельзя редактировать после isStarted
    dateDetails?: string, // нельзя редактировать после isStarted
    rewards: [ { // нельзя редактировать после isStarted
        id: String,
        position: String, // один из 'summoner', 'viewer'
        place: Number // место на котором получат награду
    } ],
    price: number, // нельзя редактировать после isStarted
    rulesTitle: String, // нельзя редактировать после isStarted
    rules: String, // нельзя редактировать после isStarted
    moderators: [ userId ],
    game: String, // один из 'LOL', 'PUBG' // нельзя редактировать после isStarted
}
```

### Получение списка турниров юзера
**GET /api/tournaments/user/:id**

### Предложить себя в качестве участника (applicants) турнира
**POST /api/tournaments/:id/apply**<br/>

### Принять участие в турнире в качестве зрителя выбравшего свою фентези-команду
**POST /api/tournaments/:id/setup**<br/>
Запрос:<br/>
```javascript
{
    summoners: [ userId ], // массив призывателей, которых выбрал зритель в качестве своей фентези-команды
}
```

### Финализация турнира
**POST /api/tournaments/:id/finalize**<br/>
Можно вызвать и простым редактированием isFinalized: true (алиас)

## Награды
### Открыть награду
**POST /api/rewards/:id**<br/>
Ответ (RewardModel):<br/>
```javascript
    {
        owner: UserModel,
        key: String, // возвращается ТОЛЬКО если isClaimed: true 
        isClaimed: Boolean, // была ли активация
        description: String,
        image: String, // обложка
    }
```
Переводит isClaimed в true и возвращает открытый key

### Получение списка наград пользователя
**GET /api/rewards/me**<br/>
Ответ:<br/>
```javascript
    [ RewardModel ]
```

## Служебные
### Обновление данных о пользователе
**PUT /api/admin/user/:id**<br/>
Запрос (UserModel)<br/>

### Добавить пользователя
**POST /api/admin/user**<br/>
Запрос (UserModel)<br/>

### Удалить пользователя
**DELETE /api/admin/user/:id**<br/>

### Обновление награды
**PUT /api/admin/reward/:id**<br/>
Запрос (RewardModel)<br/>

### Добавить награду
**POST /api/admin/reward**<br/>
Запрос (RewardModel)<br/>

### Удалить награду
**DELETE /api/admin/reward/:id**<br/>
