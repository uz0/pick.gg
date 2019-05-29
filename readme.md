# pick.gg

- [ES2015 with Babel (Server/Client)](https://babeljs.io/learn-es2015/)
- [ReactJS](https://reactjs.org/)
- [React-router-V4](https://reacttraining.com/react-router/)
- [ExpressJS](http://expressjs.com/es/)
- [Mongoose](http://mongoosejs.com/)
- [JWT-Authentication](https://jwt.io/)
- [Socket.IO](https://socket.io/)
- [Webpack](https://webpack.js.org/) -> *Internally with HMR*

*create-react-app has been used to create the client app*

*client files are located under **./client** folder*

*server files are located under **./server** folder*


Setup
-----

#### Clone the repo and run:

### `npm i`

#### To serve the app in dev mode run:

### `npm start`

*It will run the client app on [http://localhost:3000](http://localhost:3000) (with HMR) and the server on [http://localhost:3001](http://localhost:3001)*

### Environment variables
For establishing database connection you have to create .env file in the project root directory and add required variables.
You can write to our team in [https://discordapp.com/channels/494396859587231744/531545521244864514](Discord) and we will give you required credentials.


Debugging with VSCode
---------------------

Also if you're using **VSCode**, you can debug both, Server and Client app in development

- First press F5 to start VSCode debugger on the Server, you can add breakpoints on VSCode.
- Then open the ./client folder in a new instance of VSCode.
- Run `npm start` here and then press F5, it will run the debugger for the client app on VSCode and open an instance of the browser.
- Now you´re ready to debug your app.