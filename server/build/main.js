require('source-map-support/register');
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../common/constants.js":
/*!******************************!*\
  !*** ../common/constants.js ***!
  \******************************/
/*! exports provided: REGIONS, RULES */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REGIONS", function() { return REGIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RULES", function() { return RULES; });
const REGIONS = ['BR', 'EUNE', 'EUW', 'JP', 'KR', 'LAN', 'LAS', 'NA', 'OCE', 'TR', 'RU', 'PBE'];
const RULES = [{
  name: 'kills',
  range: [0, 10]
}, {
  name: 'deaths',
  range: [0, 10]
}, {
  name: 'assists',
  range: [0, 10]
}];

/***/ }),

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! cookie-parser */ "cookie-parser");
/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(cookie_parser__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! socket.io */ "socket.io");
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(socket_io__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! morgan */ "morgan");
/* harmony import */ var morgan__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(morgan__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! body-parser */ "body-parser");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _controllers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./controllers */ "./controllers/index.js");
/* harmony import */ var _controllers_authenticationController__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./controllers/authenticationController */ "./controllers/authenticationController/index.js");
/* harmony import */ var _controllers_public__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./controllers/public */ "./controllers/public/index.js");
/* harmony import */ var _middlewares__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./middlewares */ "./middlewares/index.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./config */ "./config.js");













const app = express__WEBPACK_IMPORTED_MODULE_3___default()();
let server = http__WEBPACK_IMPORTED_MODULE_0___default.a.Server(app);
server.timeout = 999999;
let io = socket_io__WEBPACK_IMPORTED_MODULE_5___default()(server);
mongoose__WEBPACK_IMPORTED_MODULE_2___default.a.Promise = Promise;
mongoose__WEBPACK_IMPORTED_MODULE_2___default.a.connect(_config__WEBPACK_IMPORTED_MODULE_12__["default"].database);
app.set('superSecret', _config__WEBPACK_IMPORTED_MODULE_12__["default"].secret);
const port = process.env.PORT || 3001;
if (false) {}

if (true) {
  app.use(morgan__WEBPACK_IMPORTED_MODULE_6___default()('dev'));
}

app.use(body_parser__WEBPACK_IMPORTED_MODULE_7___default.a.json());
app.use(body_parser__WEBPACK_IMPORTED_MODULE_7___default.a.urlencoded({
  extended: false
}));
app.use(cookie_parser__WEBPACK_IMPORTED_MODULE_4___default()());
app.use(express__WEBPACK_IMPORTED_MODULE_3___default.a.static(path__WEBPACK_IMPORTED_MODULE_1___default.a.join(__dirname, '..', 'client', 'build')));
app.use('/authentication', Object(_controllers_authenticationController__WEBPACK_IMPORTED_MODULE_9__["default"])(app));
app.use('/public/users', Object(_controllers_public__WEBPACK_IMPORTED_MODULE_10__["PublicUsersController"])());
app.use('/public/rating', Object(_controllers_public__WEBPACK_IMPORTED_MODULE_10__["PublicRatingController"])());
app.use('/public/tournaments', Object(_controllers_public__WEBPACK_IMPORTED_MODULE_10__["PublicTournamentController"])());
app.use('/api', Object(_middlewares__WEBPACK_IMPORTED_MODULE_11__["AuthVerifyMiddleware"])(app));
app.use('/api/users', Object(_controllers__WEBPACK_IMPORTED_MODULE_8__["UsersController"])());
app.use('/api/tournaments', Object(_controllers__WEBPACK_IMPORTED_MODULE_8__["TournamentController"])(io));
app.use('/api/rewards', Object(_controllers__WEBPACK_IMPORTED_MODULE_8__["RewardController"])());
app.use('/api/admin', _middlewares__WEBPACK_IMPORTED_MODULE_11__["AdminVerifyMiddleware"], Object(_controllers__WEBPACK_IMPORTED_MODULE_8__["AdminController"])(io)); // express will serve up index.html if it doesn't recognize the route

app.get('/*', (req, res) => {
  res.sendFile(path__WEBPACK_IMPORTED_MODULE_1___default.a.join(__dirname, '..', 'client', 'build', 'index.html'));
});
server.listen(port, () => console.log(`Listening on port ${port}`));
/* WEBPACK VAR INJECTION */}.call(this, ""))

/***/ }),

/***/ "./config.js":
/*!*******************!*\
  !*** ./config.js ***!
  \*******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dotenv */ "dotenv");
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_0__);

dotenv__WEBPACK_IMPORTED_MODULE_0___default.a.config();
/* harmony default export */ __webpack_exports__["default"] = ({
  secret: process.env.SECRET || 'sdfmn43lkfvmsd',
  database: process.env.MONGODB_URI || 'mongodb://admin:admin@ds121248.mlab.com:21248/react-app',
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET
});

/***/ }),

/***/ "./controllers/adminController/index.js":
/*!**********************************************!*\
  !*** ./controllers/adminController/index.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _reward_get__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reward/get */ "./controllers/adminController/reward/get.js");
/* harmony import */ var _reward_getUserRewards__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./reward/getUserRewards */ "./controllers/adminController/reward/getUserRewards.js");
/* harmony import */ var _reward_create__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reward/create */ "./controllers/adminController/reward/create.js");
/* harmony import */ var _reward_update__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./reward/update */ "./controllers/adminController/reward/update.js");
/* harmony import */ var _reward_delete__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./reward/delete */ "./controllers/adminController/reward/delete.js");
/* harmony import */ var _user_get__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./user/get */ "./controllers/adminController/user/get.js");
/* harmony import */ var _user_getUserByName__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./user/getUserByName */ "./controllers/adminController/user/getUserByName.js");
/* harmony import */ var _user_getUserById__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./user/getUserById */ "./controllers/adminController/user/getUserById.js");
/* harmony import */ var _user_create__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./user/create */ "./controllers/adminController/user/create.js");
/* harmony import */ var _user_delete__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./user/delete */ "./controllers/adminController/user/delete.js");
/* harmony import */ var _user_update__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./user/update */ "./controllers/adminController/user/update.js");












let router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

const AdminController = () => {
  router.get('/reward', _reward_get__WEBPACK_IMPORTED_MODULE_1__["default"]);
  router.get('/reward/user/:userId', _reward_getUserRewards__WEBPACK_IMPORTED_MODULE_2__["validator"], _reward_getUserRewards__WEBPACK_IMPORTED_MODULE_2__["handler"]);
  router.post('/reward', _reward_create__WEBPACK_IMPORTED_MODULE_3__["validator"], _reward_create__WEBPACK_IMPORTED_MODULE_3__["handler"]);
  router.patch('/reward/:id', _reward_update__WEBPACK_IMPORTED_MODULE_4__["validator"], _reward_update__WEBPACK_IMPORTED_MODULE_4__["handler"]);
  router.delete('/reward/:id', _reward_delete__WEBPACK_IMPORTED_MODULE_5__["validator"], _reward_delete__WEBPACK_IMPORTED_MODULE_5__["handler"]);
  router.post('/user', _user_create__WEBPACK_IMPORTED_MODULE_9__["validator"], _user_create__WEBPACK_IMPORTED_MODULE_9__["handler"]);
  router.get('/user', _user_get__WEBPACK_IMPORTED_MODULE_6__["default"]);
  router.get('/user/:id', _user_getUserById__WEBPACK_IMPORTED_MODULE_8__["validator"], _user_getUserById__WEBPACK_IMPORTED_MODULE_8__["handler"]);
  router.get('/user/name/:username', _user_getUserByName__WEBPACK_IMPORTED_MODULE_7__["default"]);
  router.delete('/user/:id', _user_delete__WEBPACK_IMPORTED_MODULE_10__["validator"], _user_delete__WEBPACK_IMPORTED_MODULE_10__["handler"]);
  router.patch('/user/:id', _user_update__WEBPACK_IMPORTED_MODULE_11__["validator"], _user_update__WEBPACK_IMPORTED_MODULE_11__["handler"]);
  return router;
};

/* harmony default export */ __webpack_exports__["default"] = (AdminController);

/***/ }),

/***/ "./controllers/adminController/reward/create.js":
/*!******************************************************!*\
  !*** ./controllers/adminController/reward/create.js ***!
  \******************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/pick */ "lodash/pick");
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_pick__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/defaults */ "lodash/defaults");
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_defaults__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");
/* harmony import */ var _models_reward__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../models/reward */ "./models/reward.js");





const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_2__["check"])('key').isString().not().isEmpty().withMessage('Enter key')];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["withValidationHandler"])(async (req, res) => {
  try {
    const reward = await _models_reward__WEBPACK_IMPORTED_MODULE_4__["default"].create(lodash_defaults__WEBPACK_IMPORTED_MODULE_1___default()(lodash_pick__WEBPACK_IMPORTED_MODULE_0___default()(req.body, ['key', 'description', 'image']), {
      key: '',
      isClaimed: false,
      description: '',
      image: ''
    }));
    res.status(200).json({
      reward
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});


/***/ }),

/***/ "./controllers/adminController/reward/delete.js":
/*!******************************************************!*\
  !*** ./controllers/adminController/reward/delete.js ***!
  \******************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var _models_reward__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../models/reward */ "./models/reward.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_3__);




const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_3__["param"])('id').custom(value => Object(_validators__WEBPACK_IMPORTED_MODULE_2__["isEntityExists"])(value, _models_reward__WEBPACK_IMPORTED_MODULE_0__["default"]))];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["withValidationHandler"])(async (req, res) => {
  try {
    await _models_reward__WEBPACK_IMPORTED_MODULE_0__["default"].remove({
      _id: req.params.id
    });
    res.json({});
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});


/***/ }),

/***/ "./controllers/adminController/reward/get.js":
/*!***************************************************!*\
  !*** ./controllers/adminController/reward/get.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models_reward__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../models/reward */ "./models/reward.js");

/* harmony default export */ __webpack_exports__["default"] = (async (req, res) => {
  const rewards = await _models_reward__WEBPACK_IMPORTED_MODULE_0__["default"].find();
  res.json({
    rewards
  });
});

/***/ }),

/***/ "./controllers/adminController/reward/getUserRewards.js":
/*!**************************************************************!*\
  !*** ./controllers/adminController/reward/getUserRewards.js ***!
  \**************************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var _models_reward__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../models/reward */ "./models/reward.js");
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../models/user */ "./models/user.js");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");





const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_2__["param"])('userId').custom(value => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isEntityExists"])(value, _models_user__WEBPACK_IMPORTED_MODULE_1__["default"]))];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_4__["withValidationHandler"])(async (req, res) => {
  try {
    const rewards = await _models_reward__WEBPACK_IMPORTED_MODULE_0__["default"].find({
      userId: req.params.userId
    });
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});


/***/ }),

/***/ "./controllers/adminController/reward/update.js":
/*!******************************************************!*\
  !*** ./controllers/adminController/reward/update.js ***!
  \******************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var _models_reward__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../models/reward */ "./models/reward.js");
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/pick */ "lodash/pick");
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_pick__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");





const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_2__["body"])().custom(value => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isRequestHasCorrectFields"])(value, _models_reward__WEBPACK_IMPORTED_MODULE_0__["default"]))];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_4__["withValidationHandler"])(async (req, res) => {
  try {
    const reward = await _models_reward__WEBPACK_IMPORTED_MODULE_0__["default"].findOneAndUpdate({
      _id: req.params.id
    }, lodash_pick__WEBPACK_IMPORTED_MODULE_1___default()(req.body, ['key', 'userId', 'isClaimed', 'description', 'image']), {
      new: true
    });
    res.status(200).json(reward);
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});


/***/ }),

/***/ "./controllers/adminController/user/create.js":
/*!****************************************************!*\
  !*** ./controllers/adminController/user/create.js ***!
  \****************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/pick */ "lodash/pick");
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_pick__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/defaults */ "lodash/defaults");
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_defaults__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../common/constants */ "../common/constants.js");
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../models/user */ "./models/user.js");







const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_2__["check"])('username').isString().not().isEmpty().withMessage("Username field shouldn't be empty").isLength({
  min: 1,
  max: 20
}).withMessage("username should contain more than 1 char and less than 20").custom(value => Object(_validators__WEBPACK_IMPORTED_MODULE_4__["isPropertyValueUnique"])({
  username: value
}, _models_user__WEBPACK_IMPORTED_MODULE_6__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_2__["check"])('email').isString().not().isEmpty().withMessage("Email field shouldn't be empty").isEmail().withMessage("Invalid email format").isLength({
  min: 5,
  max: 30
}).withMessage("Email should contain more than 5 chars and less than 30").custom(value => Object(_validators__WEBPACK_IMPORTED_MODULE_4__["isPropertyValueUnique"])({
  email: value
}, _models_user__WEBPACK_IMPORTED_MODULE_6__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_2__["check"])('summonerName').custom(value => Object(_validators__WEBPACK_IMPORTED_MODULE_4__["isPropertyValueUnique"])({
  summonerName: value
}, _models_user__WEBPACK_IMPORTED_MODULE_6__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_2__["check"])('regionId').isIn(_common_constants__WEBPACK_IMPORTED_MODULE_5__["REGIONS"]).withMessage("Invalid region"), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_2__["check"])('role').isIn(['user', 'admin', 'streamer']).withMessage("Invalid user role"), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_2__["check"])('preferredPosition').isIn(['adc', 'mid', 'top', 'jungle', 'supp']).withMessage("Invalid preffered position")];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["withValidationHandler"])(async (req, res) => {
  try {
    const user = await _models_user__WEBPACK_IMPORTED_MODULE_6__["default"].create(lodash_defaults__WEBPACK_IMPORTED_MODULE_1___default()(lodash_pick__WEBPACK_IMPORTED_MODULE_0___default()(req.body, ['username', 'email', 'imageUrl', 'about', 'role', 'summonerName', 'regionId', 'preferredPosition']), {
      imageUrl: '',
      about: '',
      role: '',
      summonerName: '',
      regionId: '',
      preferredPosition: ''
    }));
    res.status(200).json({
      user
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});


/***/ }),

/***/ "./controllers/adminController/user/delete.js":
/*!****************************************************!*\
  !*** ./controllers/adminController/user/delete.js ***!
  \****************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../models/user */ "./models/user.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_3__);




const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_3__["check"])('id').custom(value => Object(_validators__WEBPACK_IMPORTED_MODULE_1__["isEntityExists"])(value, _models_user__WEBPACK_IMPORTED_MODULE_0__["default"]))];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["withValidationHandler"])(async (req, res) => {
  try {
    await _models_user__WEBPACK_IMPORTED_MODULE_0__["default"].remove({
      _id: req.params.id
    });
    res.json({});
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});


/***/ }),

/***/ "./controllers/adminController/user/get.js":
/*!*************************************************!*\
  !*** ./controllers/adminController/user/get.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../models/user */ "./models/user.js");

/* harmony default export */ __webpack_exports__["default"] = (async (req, res) => {
  const users = await _models_user__WEBPACK_IMPORTED_MODULE_0__["default"].find().select('-password');
  res.json({
    users
  });
});

/***/ }),

/***/ "./controllers/adminController/user/getUserById.js":
/*!*********************************************************!*\
  !*** ./controllers/adminController/user/getUserById.js ***!
  \*********************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../models/user */ "./models/user.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_3__);




const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_3__["param"])('id').custom(value => Object(_validators__WEBPACK_IMPORTED_MODULE_1__["isEntityExists"])(value, _models_user__WEBPACK_IMPORTED_MODULE_0__["default"]))];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["withValidationHandler"])(async (req, res) => {
  const {
    id
  } = req.params;
  const user = await _models_user__WEBPACK_IMPORTED_MODULE_0__["default"].findById(id).select('-password');
  res.json(user);
});


/***/ }),

/***/ "./controllers/adminController/user/getUserByName.js":
/*!***********************************************************!*\
  !*** ./controllers/adminController/user/getUserByName.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../models/user */ "./models/user.js");

/* harmony default export */ __webpack_exports__["default"] = (async (req, res) => {
  const {
    username
  } = req.params;
  const regexp = new RegExp('^' + username);

  if (username === '') {
    res.json({
      users: []
    });
    return;
  }

  const users = await _models_user__WEBPACK_IMPORTED_MODULE_0__["default"].find({
    username: {
      $regex: regexp,
      $options: 'i'
    }
  }).select('-password');
  res.json({
    users
  });
});

/***/ }),

/***/ "./controllers/adminController/user/update.js":
/*!****************************************************!*\
  !*** ./controllers/adminController/user/update.js ***!
  \****************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../models/user */ "./models/user.js");




const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["body"])().custom(value => Object(_validators__WEBPACK_IMPORTED_MODULE_1__["isRequestHasCorrectFields"])(value, _models_user__WEBPACK_IMPORTED_MODULE_3__["default"]))];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["withValidationHandler"])(async (req, res) => {
  try {
    const user = await _models_user__WEBPACK_IMPORTED_MODULE_3__["default"].findOneAndUpdate({
      _id: req.params.id
    }, req.body, {
      new: true
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});


/***/ }),

/***/ "./controllers/authenticationController/constants.js":
/*!***********************************************************!*\
  !*** ./controllers/authenticationController/constants.js ***!
  \***********************************************************/
/*! exports provided: ONE_DAY */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ONE_DAY", function() { return ONE_DAY; });
const ONE_DAY = 60 * 60 * 24;

/***/ }),

/***/ "./controllers/authenticationController/index.js":
/*!*******************************************************!*\
  !*** ./controllers/authenticationController/index.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _oauth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./oauth */ "./controllers/authenticationController/oauth.js");


let router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

const AuthenticationController = app => {
  router.post('/oauth', Object(_oauth__WEBPACK_IMPORTED_MODULE_1__["default"])(app));
  return router;
};

/* harmony default export */ __webpack_exports__["default"] = (AuthenticationController);

/***/ }),

/***/ "./controllers/authenticationController/oauth.js":
/*!*******************************************************!*\
  !*** ./controllers/authenticationController/oauth.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/user */ "./models/user.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./controllers/authenticationController/constants.js");



/* harmony default export */ __webpack_exports__["default"] = (app => async (req, res) => {
  const {
    email,
    name,
    photo,
    summonerName = '',
    contact = ''
  } = req.body;
  const checkUser = await _models_user__WEBPACK_IMPORTED_MODULE_1__["default"].findOne({
    email
  });

  if (!checkUser) {
    await _models_user__WEBPACK_IMPORTED_MODULE_1__["default"].create({
      username: name,
      imageUrl: photo,
      email,
      summonerName,
      contact
    });
  }

  const user = await _models_user__WEBPACK_IMPORTED_MODULE_1__["default"].findOne({
    email
  });
  const {
    _id,
    username,
    isAdmin
  } = user;
  res.json({
    success: true,
    message: 'Enjoy your token!',
    user,
    token: jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default.a.sign({
      _id,
      username,
      isAdmin
    }, app.get('superSecret'), {
      expiresIn: _constants__WEBPACK_IMPORTED_MODULE_2__["ONE_DAY"]
    })
  });
});

/***/ }),

/***/ "./controllers/helpers/calc-summoners-points.js":
/*!******************************************************!*\
  !*** ./controllers/helpers/calc-summoners-points.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* harmony default export */ __webpack_exports__["default"] = ((summoners, matches = [], rules = {}) => {
  if (matches.length === 0) {
    return summoners.map(summoner => _objectSpread({}, summoner, {
      points: 0
    }));
  }

  if (summoners.includes(undefined)) {
    return;
  }

  const points = summoners.reduce((points, item) => _objectSpread({}, points, {
    [item._id]: 0
  }), {});

  for (const match of matches) {
    if (match.playersResults.length === 0) {
      continue;
    }

    for (const result of match.playersResults) {
      const summonerPoints = Object.entries(result.results).reduce((points, [key, value]) => {
        points += rules[key] * value;
        return points;
      }, 0);
      points[result.userId] += summonerPoints;
    }
  }

  const summonersWithPoints = summoners.map(summoner => ({
    summoner: String(summoner),
    points: points[summoner._id]
  })).sort((prev, next) => next.points - prev.points);
  return summonersWithPoints;
});

/***/ }),

/***/ "./controllers/helpers/calc-viewer-points.js":
/*!***************************************************!*\
  !*** ./controllers/helpers/calc-viewer-points.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* harmony default export */ __webpack_exports__["default"] = ((viewer, summonersResults = []) => {
  const summonersResultsMap = summonersResults.reduce((map, result) => _objectSpread({}, map, {
    [result.summoner]: result.points
  }), {});
  return viewer.summoners.reduce((result, summoner) => result += summonersResultsMap[summoner], 0);
  ;
});

/***/ }),

/***/ "./controllers/helpers/calc-viewers-points.js":
/*!****************************************************!*\
  !*** ./controllers/helpers/calc-viewers-points.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* harmony default export */ __webpack_exports__["default"] = ((viewers, summonersResults = []) => {
  const summonersResultsMap = summonersResults.reduce((map, result) => _objectSpread({}, map, {
    [result.summoner]: result.points
  }), {});
  const viewersResults = viewers.reduce((results, viewer) => {
    const result = viewer.summoners.reduce((result, summoner) => result += summonersResultsMap[summoner], 0);
    results.push({
      viewerId: viewer.userId,
      points: result
    });
    return results;
  }, []).sort((prev, next) => next.points - prev.points);
  return viewersResults;
});

/***/ }),

/***/ "./controllers/helpers/getModelFields.js":
/*!***********************************************!*\
  !*** ./controllers/helpers/getModelFields.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (model => {
  let fields = [];
  model.schema.eachPath(path => fields.push(path));
  return fields;
});

/***/ }),

/***/ "./controllers/helpers/index.js":
/*!**************************************!*\
  !*** ./controllers/helpers/index.js ***!
  \**************************************/
/*! exports provided: calcSummonersPoints, calcViewerPoints, calcViewersPoints, withValidationHandler, getModelFields */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _withValidationHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./withValidationHandler */ "./controllers/helpers/withValidationHandler.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withValidationHandler", function() { return _withValidationHandler__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _calc_summoners_points__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./calc-summoners-points */ "./controllers/helpers/calc-summoners-points.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "calcSummonersPoints", function() { return _calc_summoners_points__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _calc_viewer_points__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./calc-viewer-points */ "./controllers/helpers/calc-viewer-points.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "calcViewerPoints", function() { return _calc_viewer_points__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _calc_viewers_points__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./calc-viewers-points */ "./controllers/helpers/calc-viewers-points.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "calcViewersPoints", function() { return _calc_viewers_points__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _getModelFields__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getModelFields */ "./controllers/helpers/getModelFields.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getModelFields", function() { return _getModelFields__WEBPACK_IMPORTED_MODULE_4__["default"]; });








/***/ }),

/***/ "./controllers/helpers/withValidationHandler.js":
/*!******************************************************!*\
  !*** ./controllers/helpers/withValidationHandler.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ __webpack_exports__["default"] = (handler => (req, res) => {
  const errors = Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["validationResult"])(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  return handler(req, res);
});

/***/ }),

/***/ "./controllers/index.js":
/*!******************************!*\
  !*** ./controllers/index.js ***!
  \******************************/
/*! exports provided: AuthenticationController, TournamentController, RewardController, AdminController, UsersController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _authenticationController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./authenticationController */ "./controllers/authenticationController/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AuthenticationController", function() { return _authenticationController__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _tournamentController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tournamentController */ "./controllers/tournamentController/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TournamentController", function() { return _tournamentController__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _rewardController__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rewardController */ "./controllers/rewardController/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RewardController", function() { return _rewardController__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _adminController_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./adminController/index */ "./controllers/adminController/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AdminController", function() { return _adminController_index__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _usersController_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./usersController/index */ "./controllers/usersController/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UsersController", function() { return _usersController_index__WEBPACK_IMPORTED_MODULE_4__["default"]; });







/***/ }),

/***/ "./controllers/public/index.js":
/*!*************************************!*\
  !*** ./controllers/public/index.js ***!
  \*************************************/
/*! exports provided: PublicUsersController, PublicTournamentController, PublicRatingController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _usersController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./usersController */ "./controllers/public/usersController.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PublicUsersController", function() { return _usersController__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _tournamentController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tournamentController */ "./controllers/public/tournamentController/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PublicTournamentController", function() { return _tournamentController__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _ratingController__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ratingController */ "./controllers/public/ratingController/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PublicRatingController", function() { return _ratingController__WEBPACK_IMPORTED_MODULE_2__["default"]; });






/***/ }),

/***/ "./controllers/public/ratingController/getApplicantsRating.js":
/*!********************************************************************!*\
  !*** ./controllers/public/ratingController/getApplicantsRating.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_find__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/find */ "lodash/find");
/* harmony import */ var lodash_find__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_find__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/pick */ "lodash/pick");
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_pick__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/* harmony default export */ __webpack_exports__["default"] = ((tournaments, users) => {
  const userIds = users.map(user => user._id);
  const tournamentsList = userIds.reduce((list, user) => {
    const userTournaments = tournaments.filter(item => lodash_find__WEBPACK_IMPORTED_MODULE_0___default()(item.summoners, user));
    const normalizedTournaments = userTournaments.map(tournament => lodash_pick__WEBPACK_IMPORTED_MODULE_1___default()(tournament, ['rules', 'summoners', 'viewers', 'matches']));
    list[user] = normalizedTournaments;
    return list;
  }, {});
  const resultsMap = userIds.reduce((results, userId) => _objectSpread({}, results, {
    [userId]: 0
  }), {});

  for (const user of userIds) {
    tournamentsList[user].forEach(tournament => {
      const {
        summoners,
        matches,
        rules
      } = tournament;
      const summonersResults = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["calcSummonersPoints"])(summoners, matches, rules);

      for (const _ref of summonersResults) {
        const {
          summoner,
          points
        } = _ref;
        resultsMap[summoner] += points;
      }
    });
  }

  const applicantsRating = Object.entries(resultsMap).map(([summonerId, points]) => {
    const {
      _id,
      summonerName,
      username,
      imageUrl
    } = users.find(item => String(item._id) === String(summonerId));
    return {
      _id,
      username,
      summonerName,
      imageUrl,
      points
    };
  }).sort((prev, next) => next.points - prev.points);
  return applicantsRating;
});

/***/ }),

/***/ "./controllers/public/ratingController/getRating.js":
/*!**********************************************************!*\
  !*** ./controllers/public/ratingController/getRating.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../models/user */ "./models/user.js");
/* harmony import */ var _getApplicantsRating__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getApplicantsRating */ "./controllers/public/ratingController/getApplicantsRating.js");
/* harmony import */ var _getStreamersRating__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getStreamersRating */ "./controllers/public/ratingController/getStreamersRating.js");
/* harmony import */ var _getViewersRating__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getViewersRating */ "./controllers/public/ratingController/getViewersRating.js");





/* harmony default export */ __webpack_exports__["default"] = (async (req, res) => {
  const tournaments = await _models_tournament__WEBPACK_IMPORTED_MODULE_0__["default"].find({
    isFinalized: true
  }).populate('applicants').populate('matches').populate('creator', '_id username summonerName').lean();
  const users = await _models_user__WEBPACK_IMPORTED_MODULE_1__["default"].find();
  const rating = {
    streamersRating: Object(_getStreamersRating__WEBPACK_IMPORTED_MODULE_3__["default"])(tournaments, users),
    viewersRating: Object(_getViewersRating__WEBPACK_IMPORTED_MODULE_4__["default"])(tournaments, users),
    applicantsRating: Object(_getApplicantsRating__WEBPACK_IMPORTED_MODULE_2__["default"])(tournaments, users)
  };
  res.json(rating);
});

/***/ }),

/***/ "./controllers/public/ratingController/getStreamersRating.js":
/*!*******************************************************************!*\
  !*** ./controllers/public/ratingController/getStreamersRating.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ((tournaments, users) => {
  const streamers = users.filter(user => user.canProvideTournaments);
  const streamersIds = streamers.map(streamer => streamer._id);
  const tournamentsList = streamersIds.reduce((list, streamer) => {
    const streamerTournaments = tournaments.filter(item => {
      return String(item.creator._id) === String(streamer);
    });
    list[streamer] = streamerTournaments;
    return list;
  }, {});
  const rating = streamersIds.reduce((rating, streamer) => {
    const {
      _id,
      summonerName,
      username,
      imageUrl
    } = streamers.find(item => String(item._id) === String(streamer));
    const totalViewers = tournamentsList[streamer].reduce((viewersCounter, tournament) => {
      viewersCounter += tournament.viewers.length;
      return viewersCounter;
    }, 0);
    rating.push({
      _id,
      imageUrl,
      username,
      summonerName,
      points: totalViewers
    });
    return rating;
  }, []).sort((prev, next) => next.points - prev.points);
  return rating;
});

/***/ }),

/***/ "./controllers/public/ratingController/getViewersRating.js":
/*!*****************************************************************!*\
  !*** ./controllers/public/ratingController/getViewersRating.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_find__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/find */ "lodash/find");
/* harmony import */ var lodash_find__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_find__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/pick */ "lodash/pick");
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_pick__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");



/* harmony default export */ __webpack_exports__["default"] = ((tournaments, users) => {
  const userIds = users.map(user => user._id);
  const tournamentsList = userIds.reduce((list, user) => {
    const userTournaments = tournaments.filter(item => lodash_find__WEBPACK_IMPORTED_MODULE_0___default()(item.viewers, {
      userId: String(user)
    }));
    const normalizedTournaments = userTournaments.map(tournament => lodash_pick__WEBPACK_IMPORTED_MODULE_1___default()(tournament, ['rules', 'summoners', 'viewers', 'matches']));
    list[user] = normalizedTournaments;
    return list;
  }, {});
  const rating = userIds.map(user => {
    const {
      _id,
      summonerName,
      username,
      imageUrl
    } = users.find(item => String(item._id) === String(user));
    const rating = tournamentsList[user].reduce((points, tournament) => {
      const {
        summoners,
        matches,
        viewers,
        rules
      } = tournament;
      const viewer = viewers.find(item => String(item.userId) === String(user));
      const summonersPoints = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["calcSummonersPoints"])(summoners, matches, rules);
      const viewersPoints = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["calcViewerPoints"])(viewer, summonersPoints);
      points.points += viewersPoints;
      return points;
    }, {
      _id,
      summonerName,
      imageUrl,
      username,
      points: 0
    });
    return rating;
  }).sort((prev, next) => next.points - prev.points);
  return rating;
});

/***/ }),

/***/ "./controllers/public/ratingController/index.js":
/*!******************************************************!*\
  !*** ./controllers/public/ratingController/index.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _getRating__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getRating */ "./controllers/public/ratingController/getRating.js");


let router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

const PublicRatingController = () => {
  router.get('/', _getRating__WEBPACK_IMPORTED_MODULE_1__["default"]);
  return router;
};

/* harmony default export */ __webpack_exports__["default"] = (PublicRatingController);

/***/ }),

/***/ "./controllers/public/tournamentController/get.js":
/*!********************************************************!*\
  !*** ./controllers/public/tournamentController/get.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../models/tournament */ "./models/tournament.js");

/* harmony default export */ __webpack_exports__["default"] = (async (req, res) => {
  const tournaments = await _models_tournament__WEBPACK_IMPORTED_MODULE_0__["default"].find({}).populate('winner').populate('creatorId').populate('summoners').populate('applicants').populate('matches').exec();
  res.json({
    tournaments
  });
});

/***/ }),

/***/ "./controllers/public/tournamentController/getById.js":
/*!************************************************************!*\
  !*** ./controllers/public/tournamentController/getById.js ***!
  \************************************************************/
/*! exports provided: handler, validator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../models/tournament */ "./models/tournament.js");



const withValidationHandler = handler => (req, res) => {
  const errors = Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["validationResult"])(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  return handler(req, res);
};

const handler = withValidationHandler(async (req, res) => {
  const {
    id
  } = req.params;

  try {
    const tournament = await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].findById(id).populate('winner').populate('creatorId').populate('matches').populate('creator', '_id username summonerName').exec();
    res.json(tournament);
  } catch (error) {
    res.json({
      error
    });
  }
});
const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["check"])('id').isMongoId()];

/***/ }),

/***/ "./controllers/public/tournamentController/index.js":
/*!**********************************************************!*\
  !*** ./controllers/public/tournamentController/index.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _get__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get */ "./controllers/public/tournamentController/get.js");
/* harmony import */ var _getById__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getById */ "./controllers/public/tournamentController/getById.js");
/* harmony import */ var _rewards_get__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rewards/get */ "./controllers/public/tournamentController/rewards/get.js");




let router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

const PublicTournamentController = () => {
  router.get('/', _get__WEBPACK_IMPORTED_MODULE_1__["default"]);
  router.get('/:id', _getById__WEBPACK_IMPORTED_MODULE_2__["validator"], _getById__WEBPACK_IMPORTED_MODULE_2__["handler"]);
  router.get('/:id/rewards', _rewards_get__WEBPACK_IMPORTED_MODULE_3__["validator"], _rewards_get__WEBPACK_IMPORTED_MODULE_3__["handler"]);
  return router;
};

/* harmony default export */ __webpack_exports__["default"] = (PublicTournamentController);

/***/ }),

/***/ "./controllers/public/tournamentController/rewards/get.js":
/*!****************************************************************!*\
  !*** ./controllers/public/tournamentController/rewards/get.js ***!
  \****************************************************************/
/*! exports provided: handler, validator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony import */ var lodash_isEmpty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/isEmpty */ "lodash/isEmpty");
/* harmony import */ var lodash_isEmpty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_isEmpty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _models_reward__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../models/reward */ "./models/reward.js");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../helpers */ "./controllers/helpers/index.js");






const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_3__["param"])('id').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_4__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_3__["body"])().custom(async (tournamentId, {
  req
}) => {
  const {
    id
  } = req.params;
  const tournamentRewards = await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].findById(id).select('rewards');

  if (lodash_isEmpty__WEBPACK_IMPORTED_MODULE_0___default()(tournamentRewards)) {
    return true;
  }

  return true;
})];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_5__["withValidationHandler"])(async (req, res) => {
  const {
    id
  } = req.params;
  const tournamentRewards = await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].findById(id).select('rewards').lean();

  if (lodash_isEmpty__WEBPACK_IMPORTED_MODULE_0___default()(tournamentRewards)) {
    res.send({
      rewards: []
    });
    return;
  }

  const rewardsIds = Object.keys(tournamentRewards.rewards);
  const rewards = await _models_reward__WEBPACK_IMPORTED_MODULE_2__["default"].find({
    _id: {
      $in: rewardsIds
    }
  }).select('-key -isClaimed -userId');
  res.send(rewards);
});


/***/ }),

/***/ "./controllers/public/usersController.js":
/*!***********************************************!*\
  !*** ./controllers/public/usersController.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/user */ "./models/user.js");


let router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

const PublicUsersController = () => {
  router.get('/', async (req, res) => {
    const users = await _models_user__WEBPACK_IMPORTED_MODULE_1__["default"].find().select('-isAdmin');
    res.json({
      users
    });
  });
  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const user = await _models_user__WEBPACK_IMPORTED_MODULE_1__["default"].findOne({
      _id: id
    });
    res.json({
      user
    });
  });
  return router;
};

/* harmony default export */ __webpack_exports__["default"] = (PublicUsersController);

/***/ }),

/***/ "./controllers/rewardController/getUserRewards.js":
/*!********************************************************!*\
  !*** ./controllers/rewardController/getUserRewards.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models_reward__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../models/reward */ "./models/reward.js");

/* harmony default export */ __webpack_exports__["default"] = (async (req, res) => {
  const {
    _id
  } = req.decoded;
  const isClaimedFilter = req.query.isClaimed;
  let rewards;

  if (isClaimedFilter) {
    rewards = await _models_reward__WEBPACK_IMPORTED_MODULE_0__["default"].find({
      userId: _id,
      isClaimed: isClaimedFilter
    });
  } else {
    rewards = await _models_reward__WEBPACK_IMPORTED_MODULE_0__["default"].find({
      userId: _id
    });
  }

  res.json({
    rewards
  });
});

/***/ }),

/***/ "./controllers/rewardController/index.js":
/*!***********************************************!*\
  !*** ./controllers/rewardController/index.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _getUserRewards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getUserRewards */ "./controllers/rewardController/getUserRewards.js");


let router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

const RewardController = () => {
  router.get('/reward', _getUserRewards__WEBPACK_IMPORTED_MODULE_1__["default"]);
  return router;
};

/* harmony default export */ __webpack_exports__["default"] = (RewardController);

/***/ }),

/***/ "./controllers/tournamentController/applicantStatus.js":
/*!*************************************************************!*\
  !*** ./controllers/tournamentController/applicantStatus.js ***!
  \*************************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers */ "./controllers/helpers/index.js");




const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["check"])().custom((value, {
  req
}) => Object(_validators__WEBPACK_IMPORTED_MODULE_2__["isUserHasToken"])(value, req)), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('id').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_2__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"]))];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["withValidationHandler"])(async (req, res) => {
  const {
    id
  } = req.params;
  const {
    userId,
    newStatus
  } = req.body;

  try {
    const newTournament = await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].update({
      _id: id
    }, {
      $set: {
        [`applicants.$[element].status`]: newStatus
      }
    }, {
      arrayFilters: [{
        'element.user': userId
      }]
    }).exec();

    if (newStatus === 'ACCEPTED') {
      await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].update({
        _id: id
      }, {
        $push: {
          summoners: userId
        }
      }).exec();
    }

    res.send(newTournament);
  } catch (error) {
    console.log(error);
    res.status(400).send({});
  }
});


/***/ }),

/***/ "./controllers/tournamentController/attend.js":
/*!****************************************************!*\
  !*** ./controllers/tournamentController/attend.js ***!
  \****************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_find__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/find */ "lodash/find");
/* harmony import */ var lodash_find__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_find__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers */ "./controllers/helpers/index.js");





const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('id').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_2__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('id').custom(id => _models_tournament__WEBPACK_IMPORTED_MODULE_2__["default"].findById(id).exec().then(({
  isReady
}) => !isReady || Promise.reject("Can't attend ready tournament"))), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["check"])('userId').custom(async (_, {
  req
}) => {
  const {
    _id: userId
  } = req.decoded;
  const {
    id
  } = req.params;
  const {
    applicants,
    summoners
  } = await _models_tournament__WEBPACK_IMPORTED_MODULE_2__["default"].findById(id).exec();
  const isAlreadyApplicantOrSummoner = summoners.includes(userId) || lodash_find__WEBPACK_IMPORTED_MODULE_1___default()(applicants, {
    user: userId
  });

  if (isAlreadyApplicantOrSummoner) {
    throw new Error('User already an applicant or summoner');
  }

  return true;
})];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_4__["withValidationHandler"])(async (req, res) => {
  const {
    id
  } = req.params;
  const {
    _id: userId
  } = req.decoded;
  const modifiedTournament = await _models_tournament__WEBPACK_IMPORTED_MODULE_2__["default"].findByIdAndUpdate(id, {
    $push: {
      applicants: {
        user: userId
      }
    }
  });
  await modifiedTournament.save();
  res.json({});
});

/***/ }),

/***/ "./controllers/tournamentController/create.js":
/*!****************************************************!*\
  !*** ./controllers/tournamentController/create.js ***!
  \****************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/pick */ "lodash/pick");
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_pick__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/defaults */ "lodash/defaults");
/* harmony import */ var lodash_defaults__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_defaults__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/tournament */ "./models/tournament.js");




const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_2__["check"])('name').isString().not().isEmpty().withMessage('Enter name'), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_2__["check"])('price').not().isEmpty().withMessage('Enter entry price'), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_2__["check"])('startAt').not().isEmpty().withMessage('Choose start date')];

const withValidationHandler = handler => (req, res) => {
  const errors = Object(express_validator_check__WEBPACK_IMPORTED_MODULE_2__["validationResult"])(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  return handler(req, res);
};

const handler = withValidationHandler(async (req, res) => {
  try {
    const newTournament = await _models_tournament__WEBPACK_IMPORTED_MODULE_3__["default"].create(lodash_defaults__WEBPACK_IMPORTED_MODULE_1___default()(lodash_pick__WEBPACK_IMPORTED_MODULE_0___default()(req.body, ['name', 'description', 'startAt', 'price', 'url', 'imageUrl']), {
      isReady: false,
      url: '',
      description: '',
      imageUrl: '',
      summoners: [],
      rewards: [],
      createdAt: Date.now(),
      creator: req.decoded._id
    }));
    res.status(200).json({
      newTournament
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});


/***/ }),

/***/ "./controllers/tournamentController/edit.js":
/*!**************************************************!*\
  !*** ./controllers/tournamentController/edit.js ***!
  \**************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/pick */ "lodash/pick");
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_pick__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_pickBy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/pickBy */ "lodash/pickBy");
/* harmony import */ var lodash_pickBy__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_pickBy__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_negate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/negate */ "lodash/negate");
/* harmony import */ var lodash_negate__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_negate__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash_difference__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/difference */ "lodash/difference");
/* harmony import */ var lodash_difference__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_difference__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash_isUndefined__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash/isUndefined */ "lodash/isUndefined");
/* harmony import */ var lodash_isUndefined__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_isUndefined__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../common/constants */ "../common/constants.js");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var express_validator_filter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! express-validator/filter */ "express-validator/filter");
/* harmony import */ var express_validator_filter__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(express_validator_filter__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../helpers */ "./controllers/helpers/index.js");











const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_6__["check"])().custom((value, {
  req
}) => Object(_validators__WEBPACK_IMPORTED_MODULE_9__["isUserHasToken"])(value, req)), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_6__["param"])('id').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_9__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_8__["default"])).custom(async (tournamentId, {
  req
}) => {
  const {
    _id
  } = req.decoded;
  const {
    creator,
    isReady
  } = await _models_tournament__WEBPACK_IMPORTED_MODULE_8__["default"].findById(tournamentId);

  if (String(creator) !== String(_id)) {
    throw new Error('You are not allowed to edit this tournament');
  }

  if (isReady) {
    const fieldsToExclude = ['name', 'description', 'url', 'imageUrl', 'summoners', 'rules'];
    const extraField = lodash_difference__WEBPACK_IMPORTED_MODULE_3___default()(Object.keys(req.body), fieldsToExclude);
    if (!extraField.length) throw new Error(`You can\'t edit next fields in ready tournament: ${extraField.join(', ')}`);
  }

  return true;
}), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_6__["body"])().custom(body => Object(_validators__WEBPACK_IMPORTED_MODULE_9__["isRequestHasCorrectFields"])(body, _models_tournament__WEBPACK_IMPORTED_MODULE_8__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_6__["body"])().custom(({
  summoners
}) => {
  if (!summoners) {
    return true;
  }

  if (summoners.length > 10) {
    throw new Error('You can\'t add more than 10 summoners');
  }

  return true;
}), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_6__["body"])().custom(({
  rules
}) => {
  if (!rules) {
    return true;
  }

  const RULES_NAMES = _common_constants__WEBPACK_IMPORTED_MODULE_5__["RULES"].map(rule => rule.name);
  const rulesDiff = lodash_difference__WEBPACK_IMPORTED_MODULE_3___default()(Object.keys(rules), RULES_NAMES);

  if (rulesDiff.length > 0) {
    throw new Error(`Rules object can\'t contain fields: ${rulesDiff.join(' ')}`);
  }

  return true;
}), Object(express_validator_filter__WEBPACK_IMPORTED_MODULE_7__["sanitizeBody"])().customSanitizer(values => lodash_pickBy__WEBPACK_IMPORTED_MODULE_1___default()(values, lodash_negate__WEBPACK_IMPORTED_MODULE_2___default()(lodash_isUndefined__WEBPACK_IMPORTED_MODULE_4___default.a)))];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_10__["withValidationHandler"])(async (req, res) => {
  const {
    id
  } = req.params;
  _models_tournament__WEBPACK_IMPORTED_MODULE_8__["default"].findByIdAndUpdate(id, {
    $set: lodash_pick__WEBPACK_IMPORTED_MODULE_0___default()(req.body, ['name', 'description', 'url', 'price', 'rules', 'summoners'])
  }, {
    new: true
  }).exec().then(res.json).catch(error => res.json({
    error
  }));
});


/***/ }),

/***/ "./controllers/tournamentController/finalize.js":
/*!******************************************************!*\
  !*** ./controllers/tournamentController/finalize.js ***!
  \******************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/user */ "./models/user.js");
/* harmony import */ var _models_reward__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/reward */ "./models/reward.js");
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers */ "./controllers/helpers/index.js");






const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('id').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_4__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_3__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('id').custom(async id => {
  const {
    isFinalized
  } = await _models_tournament__WEBPACK_IMPORTED_MODULE_3__["default"].findById(id);
  if (isFinalized) throw new Error('Tournament is already finalized');
  return true;
})];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_5__["withValidationHandler"])(async (req, res) => {
  const {
    id
  } = req.params;
  const tournament = await _models_tournament__WEBPACK_IMPORTED_MODULE_3__["default"].findById(id).populate('matches').lean();
  const {
    rules,
    matches,
    summoners,
    rewards,
    viewers
  } = tournament;
  const viewersIds = tournament.viewers.map(item => String(item.userId));
  const users = await _models_user__WEBPACK_IMPORTED_MODULE_1__["default"].find({
    _id: {
      $in: [...viewersIds, ...summoners]
    }
  }).select('_id summonerName');
  const summonersResults = Object(_helpers__WEBPACK_IMPORTED_MODULE_5__["calcSummonersPoints"])(summoners, matches, rules);
  const viewersResults = Object(_helpers__WEBPACK_IMPORTED_MODULE_5__["calcViewersPoints"])(viewers, summonersResults);
  const topSummonersResults = summonersResults.slice(0, 3);
  const topViewersResults = viewersResults.slice(0, 3);
  const placesMap = {
    'first': 1,
    'second': 2,
    'third': 3
  };
  const normalizedRewards = Object.entries(rewards);
  const tournamentWinners = [];

  for (const [rewardId, roleAndPlace] of normalizedRewards) {
    const [role, placeId] = roleAndPlace.split('_');
    const place = placesMap[placeId];
    const winnerId = role === 'summoner' ? topSummonersResults[place - 1].summoner : topViewersResults[place - 1].viewerId;
    await _models_reward__WEBPACK_IMPORTED_MODULE_2__["default"].findByIdAndUpdate(rewardId, {
      $set: {
        userId: winnerId
      }
    });
    tournamentWinners.push({
      id: winnerId,
      position: role,
      place
    });
  }

  await _models_tournament__WEBPACK_IMPORTED_MODULE_3__["default"].findByIdAndUpdate(id, {
    $set: {
      winners: tournamentWinners,
      isFinalized: true
    }
  });
  const finalizedTournament = await _models_tournament__WEBPACK_IMPORTED_MODULE_3__["default"].findById(id).populate('creatorId').populate('applicants').populate('matches').populate('creator', '_id username summonerName').exec();
  res.send(finalizedTournament);
});

/***/ }),

/***/ "./controllers/tournamentController/forecastStatus.js":
/*!************************************************************!*\
  !*** ./controllers/tournamentController/forecastStatus.js ***!
  \************************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers */ "./controllers/helpers/index.js");




const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('id').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_2__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('id').custom(async id => {
  const {
    isForecastingActive
  } = await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].findById(id).exec();
  if (isForecastingActive) throw new Error('Forecasting is already avalilable');
  return true;
})];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["withValidationHandler"])(async (req, res) => {
  const {
    id
  } = req.params;
  await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].update({
    _id: id
  }, {
    $set: {
      isForecastingActive: true
    }
  }, {
    new: true
  }).exec();
  const modifiedTournament = await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].findById(id).populate('winner').populate('creatorId').populate('applicants').populate('matches').populate('creator', '_id username summonerName').exec();
  res.json(modifiedTournament);
});

/***/ }),

/***/ "./controllers/tournamentController/get.js":
/*!*************************************************!*\
  !*** ./controllers/tournamentController/get.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _models_match__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/match */ "./models/match.js");


/* harmony default export */ __webpack_exports__["default"] = (async (req, res) => {
  const tournaments = await _models_tournament__WEBPACK_IMPORTED_MODULE_0__["default"].find({}).populate('winner').populate('creatorId').populate('summoners').populate('applicants').populate('matches').exec();
  res.json({
    tournaments
  });
});

/***/ }),

/***/ "./controllers/tournamentController/getById.js":
/*!*****************************************************!*\
  !*** ./controllers/tournamentController/getById.js ***!
  \*****************************************************/
/*! exports provided: handler, validator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/tournament */ "./models/tournament.js");



const withValidationHandler = handler => (req, res) => {
  const errors = Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["validationResult"])(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  return handler(req, res);
};

const handler = withValidationHandler(async (req, res) => {
  const {
    id
  } = req.params;

  try {
    const tournament = await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].findById(id).populate('winner').populate('creatorId').populate('applicants').populate('matches').populate('creator', '_id username summonerName').exec();
    res.json(tournament);
  } catch (error) {
    res.json({
      error
    });
  }
});
const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["check"])('id').isMongoId()];

/***/ }),

/***/ "./controllers/tournamentController/index.js":
/*!***************************************************!*\
  !*** ./controllers/tournamentController/index.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _get__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get */ "./controllers/tournamentController/get.js");
/* harmony import */ var _create__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./create */ "./controllers/tournamentController/create.js");
/* harmony import */ var _attend__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./attend */ "./controllers/tournamentController/attend.js");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./view */ "./controllers/tournamentController/view.js");
/* harmony import */ var _rewards_edit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rewards/edit */ "./controllers/tournamentController/rewards/edit.js");
/* harmony import */ var _rewards_get__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./rewards/get */ "./controllers/tournamentController/rewards/get.js");
/* harmony import */ var _getById__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getById */ "./controllers/tournamentController/getById.js");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./edit */ "./controllers/tournamentController/edit.js");
/* harmony import */ var _forecastStatus__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./forecastStatus */ "./controllers/tournamentController/forecastStatus.js");
/* harmony import */ var _start__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./start */ "./controllers/tournamentController/start.js");
/* harmony import */ var _finalize__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./finalize */ "./controllers/tournamentController/finalize.js");
/* harmony import */ var _applicantStatus__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./applicantStatus */ "./controllers/tournamentController/applicantStatus.js");
/* harmony import */ var _match__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./match */ "./controllers/tournamentController/match/index.js");














let router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

const TournamentController = io => {
  router.get('/', _get__WEBPACK_IMPORTED_MODULE_1__["default"]);
  router.post('/', _create__WEBPACK_IMPORTED_MODULE_2__["validator"], _create__WEBPACK_IMPORTED_MODULE_2__["handler"]);
  router.get('/:id', _getById__WEBPACK_IMPORTED_MODULE_7__["validator"], _getById__WEBPACK_IMPORTED_MODULE_7__["handler"]);
  router.get('/:id/rewards', _rewards_get__WEBPACK_IMPORTED_MODULE_6__["validator"], _rewards_get__WEBPACK_IMPORTED_MODULE_6__["handler"]);
  router.patch('/:id', _edit__WEBPACK_IMPORTED_MODULE_8__["validator"], _edit__WEBPACK_IMPORTED_MODULE_8__["handler"]);
  router.patch('/:id/attend', _attend__WEBPACK_IMPORTED_MODULE_3__["validator"], _attend__WEBPACK_IMPORTED_MODULE_3__["handler"]);
  router.patch('/:id/applicantStatus', _applicantStatus__WEBPACK_IMPORTED_MODULE_12__["validator"], _applicantStatus__WEBPACK_IMPORTED_MODULE_12__["handler"]);
  router.patch('/:id/forecastStatus', _forecastStatus__WEBPACK_IMPORTED_MODULE_9__["validator"], _forecastStatus__WEBPACK_IMPORTED_MODULE_9__["handler"]);
  router.patch('/:id/view', _view__WEBPACK_IMPORTED_MODULE_4__["validator"], _view__WEBPACK_IMPORTED_MODULE_4__["handler"]);
  router.patch('/:id/start', _start__WEBPACK_IMPORTED_MODULE_10__["validator"], _start__WEBPACK_IMPORTED_MODULE_10__["handler"]);
  router.patch('/:id/finalize', _finalize__WEBPACK_IMPORTED_MODULE_11__["validator"], _finalize__WEBPACK_IMPORTED_MODULE_11__["handler"]);
  router.patch('/:id/rewards', _rewards_edit__WEBPACK_IMPORTED_MODULE_5__["validator"], _rewards_edit__WEBPACK_IMPORTED_MODULE_5__["handler"]);
  router.use('/:tournamentId/matches', Object(_match__WEBPACK_IMPORTED_MODULE_13__["default"])());
  return router;
};

/* harmony default export */ __webpack_exports__["default"] = (TournamentController);

/***/ }),

/***/ "./controllers/tournamentController/match/create.js":
/*!**********************************************************!*\
  !*** ./controllers/tournamentController/match/create.js ***!
  \**********************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _models_match__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/match */ "./models/match.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");





const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('tournamentId').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["body"])().not().isEmpty(), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["body"])().custom(values => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isRequestHasCorrectFields"])(values, _models_match__WEBPACK_IMPORTED_MODULE_2__["default"]))];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_4__["withValidationHandler"])(async (req, res) => {
  const {
    tournamentId
  } = req.params;
  const matchInfo = req.body;
  const newMatch = await _models_match__WEBPACK_IMPORTED_MODULE_2__["default"].create(matchInfo);
  await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].findByIdAndUpdate(tournamentId, {
    $push: {
      matches: newMatch._id
    }
  }).exec();
  res.json(newMatch);
});

/***/ }),

/***/ "./controllers/tournamentController/match/createResults.js":
/*!*****************************************************************!*\
  !*** ./controllers/tournamentController/match/createResults.js ***!
  \*****************************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_uniqBy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/uniqBy */ "lodash/uniqBy");
/* harmony import */ var lodash_uniqBy__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_uniqBy__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _models_match__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../models/match */ "./models/match.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers */ "./controllers/tournamentController/match/helpers.js");







const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('tournamentId').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_4__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_2__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('matchId').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_4__["isEntityExists"])(id, _models_match__WEBPACK_IMPORTED_MODULE_3__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('matchId').custom(async (_, {
  req
}) => {
  const {
    tournamentId,
    matchId
  } = req.params;
  const {
    matches
  } = await _models_tournament__WEBPACK_IMPORTED_MODULE_2__["default"].findById(tournamentId).exec();
  if (!matches.includes(matchId)) throw new Error("Match don't exist on this tournament");
}), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["body"])().not().isEmpty()];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_5__["withValidationHandler"])(async (req, res) => {
  const {
    matchId
  } = req.params;
  const rawResults = req.body;
  const results = Object(_helpers__WEBPACK_IMPORTED_MODULE_6__["normaliseResults"])(rawResults);
  const newMatch = await _models_match__WEBPACK_IMPORTED_MODULE_3__["default"].findByIdAndUpdate(matchId, {
    $push: {
      results: {
        $each: lodash_uniqBy__WEBPACK_IMPORTED_MODULE_1___default()(results, 'userId')
      }
    }
  }, {
    new: true
  });
  res.json(newMatch);
});

/***/ }),

/***/ "./controllers/tournamentController/match/delete.js":
/*!**********************************************************!*\
  !*** ./controllers/tournamentController/match/delete.js ***!
  \**********************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _models_match__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/match */ "./models/match.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");





const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('tournamentId').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('matchId').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isEntityExists"])(id, _models_match__WEBPACK_IMPORTED_MODULE_2__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])().custom(async (_, {
  req
}) => {
  const {
    tournamentId,
    matchId
  } = req.params;
  const {
    matches
  } = await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].findById(tournamentId).populate('matches').exec();
  if (!matches.find(match => String(match._id) === String(matchId))) throw new Error("Match don't exist on this tournament");
})];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_4__["withValidationHandler"])(async (req, res) => {
  const {
    matchId
  } = req.params;
  await _models_match__WEBPACK_IMPORTED_MODULE_2__["default"].remove({
    _id: matchId
  });
  res.json({});
});

/***/ }),

/***/ "./controllers/tournamentController/match/edit.js":
/*!********************************************************!*\
  !*** ./controllers/tournamentController/match/edit.js ***!
  \********************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_omit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/omit */ "lodash/omit");
/* harmony import */ var lodash_omit__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_omit__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _models_match__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../models/match */ "./models/match.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");






const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('tournamentId').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_4__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_2__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('matchId').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_4__["isEntityExists"])(id, _models_match__WEBPACK_IMPORTED_MODULE_3__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])().custom(async (_, {
  req
}) => {
  const {
    tournamentId,
    matchId
  } = req.params;
  const {
    matches
  } = await _models_tournament__WEBPACK_IMPORTED_MODULE_2__["default"].findById(tournamentId).exec();
  if (!matches.includes(matchId)) throw new Error("Match don't exist on this tournament");
}), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["body"])().not().isEmpty(), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["body"])().custom(values => Object(_validators__WEBPACK_IMPORTED_MODULE_4__["isRequestHasCorrectFields"])(values, _models_match__WEBPACK_IMPORTED_MODULE_3__["default"]))];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_5__["withValidationHandler"])(async (req, res) => {
  const {
    matchId
  } = req.params;
  const matchUpdate = req.body;
  const newMatch = await _models_match__WEBPACK_IMPORTED_MODULE_3__["default"].findByIdAndUpdate(matchId, {
    $set: lodash_omit__WEBPACK_IMPORTED_MODULE_1___default()(matchUpdate, ['_id'])
  });
  res.json(newMatch);
});

/***/ }),

/***/ "./controllers/tournamentController/match/editResults.js":
/*!***************************************************************!*\
  !*** ./controllers/tournamentController/match/editResults.js ***!
  \***************************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _models_match__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/match */ "./models/match.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");





const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('tournamentId').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('matchId').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isEntityExists"])(id, _models_match__WEBPACK_IMPORTED_MODULE_2__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["body"])().not().isEmpty()];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_4__["withValidationHandler"])(async (req, res) => {
  const {
    matchId
  } = req.params;
  const results = req.body;
  const newMatch = await _models_match__WEBPACK_IMPORTED_MODULE_2__["default"].findByIdAndUpdate(matchId, {
    $set: {
      playersResults: results
    }
  }, {
    new: true,
    upsert: false
  }).exec();
  res.json(newMatch);
});

/***/ }),

/***/ "./controllers/tournamentController/match/end.js":
/*!*******************************************************!*\
  !*** ./controllers/tournamentController/match/end.js ***!
  \*******************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_match__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../models/match */ "./models/match.js");
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");





const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('matchId').custom(matchId => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isEntityExists"])(matchId, _models_match__WEBPACK_IMPORTED_MODULE_1__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('matchId').custom(async matchId => {
  const {
    endAt
  } = await _models_match__WEBPACK_IMPORTED_MODULE_1__["default"].findById(matchId).exec();
  if (endAt) throw new Error('Match is already ended');
  return true;
})];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_4__["withValidationHandler"])(async (req, res) => {
  const {
    tournamentId,
    matchId
  } = req.params;
  await _models_match__WEBPACK_IMPORTED_MODULE_1__["default"].update({
    _id: matchId
  }, {
    $set: {
      isActive: false,
      endAt: Date.now()
    }
  }).exec();
  const modifiedTournament = await _models_tournament__WEBPACK_IMPORTED_MODULE_2__["default"].findById(tournamentId).populate('creatorId').populate('applicants').populate('matches').populate('creator', '_id username summonerName').exec();
  res.json(modifiedTournament);
});

/***/ }),

/***/ "./controllers/tournamentController/match/get.js":
/*!*******************************************************!*\
  !*** ./controllers/tournamentController/match/get.js ***!
  \*******************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _models_match__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../models/match */ "./models/match.js");





const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_1__["param"])('tournamentId').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_2__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_3__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_1__["param"])('matchId').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_2__["isEntityExists"])(id < _models_match__WEBPACK_IMPORTED_MODULE_4__["default"]))];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["withValidationHandler"])(async (req, res) => {
  const {
    matchId
  } = req.params;
  const wantedMatch = await _models_match__WEBPACK_IMPORTED_MODULE_4__["default"].findById(matchId).exec();
  res.json(wantedMatch);
});

/***/ }),

/***/ "./controllers/tournamentController/match/helpers.js":
/*!***********************************************************!*\
  !*** ./controllers/tournamentController/match/helpers.js ***!
  \***********************************************************/
/*! exports provided: normaliseResults */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normaliseResults", function() { return normaliseResults; });
const normaliseResults = rawResults => Object.entries(rawResults).map(([userId, results]) => ({
  userId,
  results: Object.entries(results).map(([ruleId, value]) => {
    ruleId, value;
  })
}));

/***/ }),

/***/ "./controllers/tournamentController/match/index.js":
/*!*********************************************************!*\
  !*** ./controllers/tournamentController/match/index.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _create__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./create */ "./controllers/tournamentController/match/create.js");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./controllers/tournamentController/match/edit.js");
/* harmony import */ var _delete__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./delete */ "./controllers/tournamentController/match/delete.js");
/* harmony import */ var _editResults__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editResults */ "./controllers/tournamentController/match/editResults.js");
/* harmony import */ var _get__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./get */ "./controllers/tournamentController/match/get.js");
/* harmony import */ var _createResults__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./createResults */ "./controllers/tournamentController/match/createResults.js");
/* harmony import */ var _start__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./start */ "./controllers/tournamentController/match/start.js");
/* harmony import */ var _end__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./end */ "./controllers/tournamentController/match/end.js");









const router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router({
  mergeParams: true
});

const MatchController = () => {
  router.post('/', _create__WEBPACK_IMPORTED_MODULE_1__["validator"], _create__WEBPACK_IMPORTED_MODULE_1__["handler"]);
  router.get('/:matchId', _get__WEBPACK_IMPORTED_MODULE_5__["validator"], _get__WEBPACK_IMPORTED_MODULE_5__["handler"]);
  router.patch('/:matchId/start', _start__WEBPACK_IMPORTED_MODULE_7__["validator"], _start__WEBPACK_IMPORTED_MODULE_7__["handler"]);
  router.patch('/:matchId/end', _end__WEBPACK_IMPORTED_MODULE_8__["validator"], _end__WEBPACK_IMPORTED_MODULE_8__["handler"]);
  router.patch('/:matchId', _edit__WEBPACK_IMPORTED_MODULE_2__["validator"], _edit__WEBPACK_IMPORTED_MODULE_2__["handler"]);
  router.delete('/:matchId', _delete__WEBPACK_IMPORTED_MODULE_3__["validator"], _delete__WEBPACK_IMPORTED_MODULE_3__["handler"]);
  router.post('/:matchId/results', _createResults__WEBPACK_IMPORTED_MODULE_6__["validator"], _createResults__WEBPACK_IMPORTED_MODULE_6__["handler"]);
  router.put('/:matchId/results', _editResults__WEBPACK_IMPORTED_MODULE_4__["validator"], _editResults__WEBPACK_IMPORTED_MODULE_4__["handler"]);
  return router;
};

/* harmony default export */ __webpack_exports__["default"] = (MatchController);

/***/ }),

/***/ "./controllers/tournamentController/match/start.js":
/*!*********************************************************!*\
  !*** ./controllers/tournamentController/match/start.js ***!
  \*********************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_match__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../models/match */ "./models/match.js");
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");





const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('matchId').custom(matchId => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isEntityExists"])(matchId, _models_match__WEBPACK_IMPORTED_MODULE_1__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('matchId').custom(async matchId => {
  const {
    isActive
  } = await _models_match__WEBPACK_IMPORTED_MODULE_1__["default"].findById(matchId).exec();
  if (isActive) throw new Error('Match is already started');
  return true;
})];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_4__["withValidationHandler"])(async (req, res) => {
  const {
    tournamentId,
    matchId
  } = req.params;
  await _models_match__WEBPACK_IMPORTED_MODULE_1__["default"].update({
    _id: matchId
  }, {
    $set: {
      isActive: true,
      startedAt: Date.now()
    }
  }).exec();
  const modifiedTournament = await _models_tournament__WEBPACK_IMPORTED_MODULE_2__["default"].findById(tournamentId).populate('creatorId').populate('applicants').populate('matches').populate('creator', '_id username summonerName').exec();
  res.json(modifiedTournament);
});

/***/ }),

/***/ "./controllers/tournamentController/rewards/edit.js":
/*!**********************************************************!*\
  !*** ./controllers/tournamentController/rewards/edit.js ***!
  \**********************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/pick */ "lodash/pick");
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_pick__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_pickBy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/pickBy */ "lodash/pickBy");
/* harmony import */ var lodash_pickBy__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_pickBy__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_negate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/negate */ "lodash/negate");
/* harmony import */ var lodash_negate__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_negate__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash_difference__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/difference */ "lodash/difference");
/* harmony import */ var lodash_difference__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_difference__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash_isUndefined__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash/isUndefined */ "lodash/isUndefined");
/* harmony import */ var lodash_isUndefined__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_isUndefined__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var express_validator_filter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! express-validator/filter */ "express-validator/filter");
/* harmony import */ var express_validator_filter__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(express_validator_filter__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");










const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_5__["check"])().custom((value, {
  req
}) => Object(_validators__WEBPACK_IMPORTED_MODULE_8__["isUserHasToken"])(value, req)), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_5__["param"])('id').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_8__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_7__["default"])).custom(async (tournamentId, {
  req
}) => {
  const {
    _id
  } = req.decoded;
  const {
    creator,
    isReady
  } = await _models_tournament__WEBPACK_IMPORTED_MODULE_7__["default"].findById(tournamentId);

  if (String(creator) !== String(_id)) {
    throw new Error('You are not allowed to edit this tournament');
  }

  if (isReady) {
    throw new Error('You can\'t edit rewards after tournament has started');
  }

  return true;
})];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_9__["withValidationHandler"])(async (req, res) => {
  const {
    id
  } = req.params;
  const {
    rewards
  } = req.body;
  await _models_tournament__WEBPACK_IMPORTED_MODULE_7__["default"].update({
    _id: id
  }, {
    $set: {
      rewards
    }
  }, {
    new: true
  }).exec();
  const modifiedTournament = await _models_tournament__WEBPACK_IMPORTED_MODULE_7__["default"].findById(id).populate('creatorId').populate('applicants').populate('matches').populate('creator', '_id username summonerName').exec();
  res.json(modifiedTournament);
});


/***/ }),

/***/ "./controllers/tournamentController/rewards/get.js":
/*!*********************************************************!*\
  !*** ./controllers/tournamentController/rewards/get.js ***!
  \*********************************************************/
/*! exports provided: handler, validator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony import */ var lodash_isEmpty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/isEmpty */ "lodash/isEmpty");
/* harmony import */ var lodash_isEmpty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_isEmpty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _models_reward__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../models/reward */ "./models/reward.js");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../helpers */ "./controllers/helpers/index.js");






const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_3__["check"])().custom((value, {
  req
}) => Object(_validators__WEBPACK_IMPORTED_MODULE_4__["isUserHasToken"])(value, req)), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_3__["param"])('id').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_4__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_3__["body"])().custom(async (tournamentId, {
  req
}) => {
  const {
    id
  } = req.params;
  const tournamentRewards = await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].findById(id).select('rewards');

  if (lodash_isEmpty__WEBPACK_IMPORTED_MODULE_0___default()(tournamentRewards)) {
    return true;
  }

  return true;
})];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_5__["withValidationHandler"])(async (req, res) => {
  const {
    id
  } = req.params;
  const tournamentRewards = await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].findById(id).select('rewards').lean();

  if (lodash_isEmpty__WEBPACK_IMPORTED_MODULE_0___default()(tournamentRewards)) {
    res.send({
      rewards: []
    });
    return;
  }

  const rewardsIds = Object.keys(tournamentRewards.rewards);
  const rewards = await _models_reward__WEBPACK_IMPORTED_MODULE_2__["default"].find({
    _id: {
      $in: rewardsIds
    }
  }).select('-key -isClaimed -userId');
  res.send(rewards);
});


/***/ }),

/***/ "./controllers/tournamentController/start.js":
/*!***************************************************!*\
  !*** ./controllers/tournamentController/start.js ***!
  \***************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers */ "./controllers/helpers/index.js");




const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('id').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_2__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('id').custom(async id => {
  const {
    isStarted
  } = await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].findById(id).exec();
  if (isStarted) throw new Error('Tournamnet is already started');
  return true;
})];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["withValidationHandler"])(async (req, res) => {
  const {
    id
  } = req.params;
  await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].update({
    _id: id
  }, {
    $set: {
      isStarted: true,
      isForecastingActive: false
    }
  }, {
    new: true
  }).exec();
  const modifiedTournament = await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].findById(id).populate('winner').populate('creatorId').populate('applicants').populate('matches').populate('creator', '_id username summonerName').exec();
  res.json(modifiedTournament);
});

/***/ }),

/***/ "./controllers/tournamentController/view.js":
/*!**************************************************!*\
  !*** ./controllers/tournamentController/view.js ***!
  \**************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_tournament__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/tournament */ "./models/tournament.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers */ "./controllers/helpers/index.js");
 // import Tournament from '../../models/tournament';
// import User from '../../models/user';




const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('id').custom(id => Object(_validators__WEBPACK_IMPORTED_MODULE_2__["isEntityExists"])(id, _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"])), Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["check"])('id').custom(async (_, {
  req
}) => {
  const {
    _id: userId
  } = req.decoded;
  const {
    summoners
  } = req.body;
  const {
    id
  } = req.params;

  try {// const tournament = await Tournament.find({ _id: id });
    // const isAlreadyViewer = tournament.viewers.find(viewer => viewer.userId === userId);
    // if (isAlreadyViewer) {
    //   throw new Error('User already is a viewer');
    // }
    // if(!summoners){
    //   throw new Error("You can't apply as an viewer without choosing summoners");
    // }
    // if(summoners.length > 5){
    //   throw new Error("You can't choose more than 5 summoners");
    // }
  } catch (error) {
    console.log(error);
  }

  return true;
})];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["withValidationHandler"])(async (req, res) => {
  const {
    id
  } = req.params;
  const {
    _id: userId
  } = req.decoded;
  const {
    summoners
  } = req.body;
  await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].update({
    _id: id
  }, {
    $push: {
      viewers: {
        userId,
        summoners
      }
    }
  });
  const modifiedTournament = await _models_tournament__WEBPACK_IMPORTED_MODULE_1__["default"].findById(id).populate('winner').populate('creatorId').populate('applicants').populate('matches').populate('creator', '_id username summonerName').exec();
  res.json(modifiedTournament);
});

/***/ }),

/***/ "./controllers/usersController/get.js":
/*!********************************************!*\
  !*** ./controllers/usersController/get.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../models/user */ "./models/user.js");

/* harmony default export */ __webpack_exports__["default"] = (async (req, res) => {
  const users = await _models_user__WEBPACK_IMPORTED_MODULE_0__["default"].find();
  res.json(users);
});

/***/ }),

/***/ "./controllers/usersController/getUserById.js":
/*!****************************************************!*\
  !*** ./controllers/usersController/getUserById.js ***!
  \****************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/user */ "./models/user.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers */ "./controllers/helpers/index.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../validators */ "./controllers/validators.js");




const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["param"])('id').custom((value, req) => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isEntityExists"])(value, _models_user__WEBPACK_IMPORTED_MODULE_1__["default"]))];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["withValidationHandler"])(async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await _models_user__WEBPACK_IMPORTED_MODULE_1__["default"].findOne({
      _id: userId
    }).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});


/***/ }),

/***/ "./controllers/usersController/getUserProfile.js":
/*!*******************************************************!*\
  !*** ./controllers/usersController/getUserProfile.js ***!
  \*******************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/user */ "./models/user.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers */ "./controllers/helpers/index.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../validators */ "./controllers/validators.js");




const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["check"])().custom((value, {
  req
}) => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isUserHasToken"])(value, req))];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["withValidationHandler"])(async (req, res) => {
  const {
    _id
  } = req.decoded;

  try {
    const user = await _models_user__WEBPACK_IMPORTED_MODULE_1__["default"].findOne({
      _id
    }).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});


/***/ }),

/***/ "./controllers/usersController/index.js":
/*!**********************************************!*\
  !*** ./controllers/usersController/index.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _get__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get */ "./controllers/usersController/get.js");
/* harmony import */ var _getUserProfile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getUserProfile */ "./controllers/usersController/getUserProfile.js");
/* harmony import */ var _updateUserProfile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./updateUserProfile */ "./controllers/usersController/updateUserProfile.js");
/* harmony import */ var _getUserById__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getUserById */ "./controllers/usersController/getUserById.js");





let router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

const UsersController = () => {
  router.get('/me', _getUserProfile__WEBPACK_IMPORTED_MODULE_2__["validator"], _getUserProfile__WEBPACK_IMPORTED_MODULE_2__["handler"]);
  router.patch('/me', _updateUserProfile__WEBPACK_IMPORTED_MODULE_3__["validator"], _updateUserProfile__WEBPACK_IMPORTED_MODULE_3__["handler"]);
  router.get('/', _get__WEBPACK_IMPORTED_MODULE_1__["default"]);
  router.get('/:id', _getUserById__WEBPACK_IMPORTED_MODULE_4__["validator"], _getUserById__WEBPACK_IMPORTED_MODULE_4__["handler"]);
  return router;
};

/* harmony default export */ __webpack_exports__["default"] = (UsersController);

/***/ }),

/***/ "./controllers/usersController/updateUserProfile.js":
/*!**********************************************************!*\
  !*** ./controllers/usersController/updateUserProfile.js ***!
  \**********************************************************/
/*! exports provided: validator, handler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validator", function() { return validator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handler", function() { return handler; });
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express-validator/check */ "express-validator/check");
/* harmony import */ var express_validator_check__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express_validator_check__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/pick */ "lodash/pick");
/* harmony import */ var lodash_pick__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_pick__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/user */ "./models/user.js");
/* harmony import */ var _validators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../validators */ "./controllers/validators.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers */ "./controllers/helpers/index.js");





const validator = [Object(express_validator_check__WEBPACK_IMPORTED_MODULE_0__["body"])().custom((value, {
  req
}) => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isUserHasToken"])(value, req)).custom(value => Object(_validators__WEBPACK_IMPORTED_MODULE_3__["isRequestHasCorrectFields"])(value, _models_user__WEBPACK_IMPORTED_MODULE_2__["default"]))];
const handler = Object(_helpers__WEBPACK_IMPORTED_MODULE_4__["withValidationHandler"])(async (req, res) => {
  const {
    _id
  } = req.decoded;

  try {
    const user = await _models_user__WEBPACK_IMPORTED_MODULE_2__["default"].findOneAndUpdate({
      _id
    }, lodash_pick__WEBPACK_IMPORTED_MODULE_1___default()(req.body, ['username', 'imageUrl', 'about', 'twitchAccount', 'summonerName', 'regionId', 'preferredPosition', 'contact']), {
      new: true
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error
    });
  }
});


/***/ }),

/***/ "./controllers/validators.js":
/*!***********************************!*\
  !*** ./controllers/validators.js ***!
  \***********************************/
/*! exports provided: isPropertyValueUnique, isEntityExists, isRequestHasCorrectFields, isUserHasToken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPropertyValueUnique", function() { return isPropertyValueUnique; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isEntityExists", function() { return isEntityExists; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isRequestHasCorrectFields", function() { return isRequestHasCorrectFields; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isUserHasToken", function() { return isUserHasToken; });
/* harmony import */ var _helpers_getModelFields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/getModelFields */ "./controllers/helpers/getModelFields.js");
/* harmony import */ var lodash_difference__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/difference */ "lodash/difference");
/* harmony import */ var lodash_difference__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_difference__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_isEmpty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/isEmpty */ "lodash/isEmpty");
/* harmony import */ var lodash_isEmpty__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_isEmpty__WEBPACK_IMPORTED_MODULE_2__);



const isPropertyValueUnique = async (property, model) => {
  const key = Object.keys(property)[0];
  const value = Object.values(property)[0];

  if (!value) {
    return true;
  }

  const entity = await model.findOne(property);

  if (entity) {
    throw new Error(`Entity with key: ${key} and value: ${value} is already exist`);
  }

  return true;
};
const isEntityExists = async (_id, model) => {
  let isRequestSucces = false;

  try {
    const entity = await model.findById(_id);
    isRequestSucces = true;
  } catch (erorr) {}

  if (!isRequestSucces) {
    throw new Error(`Entity with _id: ${_id} doesn't exist`);
  }

  return true;
};
const isRequestHasCorrectFields = (requestFields, model) => {
  const modelFields = Object(_helpers_getModelFields__WEBPACK_IMPORTED_MODULE_0__["default"])(model);
  const diff = lodash_difference__WEBPACK_IMPORTED_MODULE_1___default()(Object.keys(requestFields), modelFields);

  if (diff.length) {
    throw new Error(`${model.modelName} shouldn't contain ${diff.join(', ')} fields`);
  }

  return true;
};
const isUserHasToken = (value, req) => {
  if (req.decoded) {
    return true;
  }

  throw new Error(`You are not authorized`);
};

/***/ }),

/***/ "./middlewares/adminVerifyMiddleware.js":
/*!**********************************************!*\
  !*** ./middlewares/adminVerifyMiddleware.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/user */ "./models/user.js");


const AdminVerifyMiddleware = (req, res, next) => {
  const isAdmin = req.decoded.isAdmin;

  if (!isAdmin) {
    res.send({
      error: 'You are not admin'
    });
    return;
  }

  next();
};

/* harmony default export */ __webpack_exports__["default"] = (AdminVerifyMiddleware);

/***/ }),

/***/ "./middlewares/authVerifyMiddleware.js":
/*!*********************************************!*\
  !*** ./middlewares/authVerifyMiddleware.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);


let router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();

const AuthVerifyMiddleware = app => {
  router.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
      jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default.a.verify(token, app.get('superSecret'), (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'No token provided.'
      });
    }
  });
  return router;
};

/* harmony default export */ __webpack_exports__["default"] = (AuthVerifyMiddleware);

/***/ }),

/***/ "./middlewares/index.js":
/*!******************************!*\
  !*** ./middlewares/index.js ***!
  \******************************/
/*! exports provided: AuthVerifyMiddleware, AdminVerifyMiddleware */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _authVerifyMiddleware__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./authVerifyMiddleware */ "./middlewares/authVerifyMiddleware.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AuthVerifyMiddleware", function() { return _authVerifyMiddleware__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _adminVerifyMiddleware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./adminVerifyMiddleware */ "./middlewares/adminVerifyMiddleware.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AdminVerifyMiddleware", function() { return _adminVerifyMiddleware__WEBPACK_IMPORTED_MODULE_1__["default"]; });





/***/ }),

/***/ "./models/match.js":
/*!*************************!*\
  !*** ./models/match.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);

const Schema = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema;

const refTo = schemaName => ({
  type: Schema.Types.ObjectId,
  ref: schemaName
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('Match', new Schema({
  tournamentId: refTo('Tournament'),
  name: String,
  playersResults: [{
    _id: false,
    userId: refTo('User'),
    results: {
      type: Map,
      of: Number
    }
  }],
  isActive: {
    type: Boolean,
    default: false
  },
  startedAt: Date,
  endAt: Date,
  updatedAt: Date
}, {
  toObject: {
    virtuals: true
  }
})));

/***/ }),

/***/ "./models/reward.js":
/*!**************************!*\
  !*** ./models/reward.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);

const Schema = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema;

const refTo = schemaName => ({
  type: Schema.Types.ObjectId,
  ref: schemaName,
  default: null
});

/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('Reward', new Schema({
  userId: refTo('User'),
  key: {
    type: String,
    unique: true
  },
  isClaimed: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  },
  image: {
    type: String
  }
})));

/***/ }),

/***/ "./models/tournament.js":
/*!******************************!*\
  !*** ./models/tournament.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_isEmpty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/isEmpty */ "lodash/isEmpty");
/* harmony import */ var lodash_isEmpty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_isEmpty__WEBPACK_IMPORTED_MODULE_1__);


const Schema = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema;

const refTo = schemaName => ({
  type: Schema.Types.ObjectId,
  ref: schemaName
});

const schema = new Schema({
  name: String,
  description: String,
  url: String,
  imageUrl: String,
  createdAt: Date,
  startAt: Date,
  price: {
    type: Number,
    min: 0
  },
  rewards: {
    type: Map,
    of: String,
    default: {}
  },
  rules: {
    type: Map,
    of: Number,
    default: {}
  },
  isForecastingActive: {
    type: Boolean,
    default: false
  },
  isStarted: {
    type: Boolean,
    default: false
  },
  isFinalized: {
    type: Boolean,
    default: false
  },
  winners: [{
    _id: false,
    id: refTo('User'),
    position: {
      type: String,
      enum: ['summoner', 'viewer']
    },
    place: Number
  }],
  creator: refTo('User'),
  summoners: [refTo('User')],
  applicants: [{
    user: refTo('User'),
    status: {
      type: String,
      enum: ['PENDING', 'REJECTED', 'ACCEPTED'],
      default: 'PENDING'
    }
  }],
  viewers: [{
    userId: String,
    summoners: [String]
  }]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});
schema.virtual('matches', {
  ref: 'Match',
  localField: '_id',
  foreignField: 'tournamentId'
});
schema.virtual('isEmpty').get(function () {
  if (lodash_isEmpty__WEBPACK_IMPORTED_MODULE_1___default()(this.rules) || lodash_isEmpty__WEBPACK_IMPORTED_MODULE_1___default()(this.rewards) || this.matches.length === 0) {
    return true;
  }

  return false;
});
schema.virtual('isApplicationsAvailable').get(function () {
  if (!this.isEmpty && !this.isForecastingActive && !this.isStarted) {
    return true;
  }

  return false;
});
/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('Tournament', schema));

/***/ }),

/***/ "./models/user.js":
/*!************************!*\
  !*** ./models/user.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/constants */ "../common/constants.js");


const Schema = mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema;
/* harmony default export */ __webpack_exports__["default"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('User', new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    partialFilterExpression: {
      email: {
        $type: 'string'
      }
    }
  },
  imageUrl: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: ''
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  canProvideTournaments: {
    type: Boolean,
    default: false
  },
  twitchAccount: {
    type: String,
    default: ''
  },
  summonerName: {
    type: String,
    default: ''
  },
  contact: {
    type: String,
    default: ''
  },
  regionId: {
    type: String,
    enum: ['', ..._common_constants__WEBPACK_IMPORTED_MODULE_1__["REGIONS"]],
    default: ''
  },
  preferredPosition: {
    type: String,
    enum: ['', 'adc', 'mid', 'top', 'jungle', 'support'],
    default: ''
  }
}, {
  toObject: {
    virtuals: true
  }
})));

/***/ }),

/***/ 0:
/*!**********************!*\
  !*** multi ./app.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./app.js */"./app.js");


/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-validator/check":
/*!******************************************!*\
  !*** external "express-validator/check" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-validator/check");

/***/ }),

/***/ "express-validator/filter":
/*!*******************************************!*\
  !*** external "express-validator/filter" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-validator/filter");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "lodash/defaults":
/*!**********************************!*\
  !*** external "lodash/defaults" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash/defaults");

/***/ }),

/***/ "lodash/difference":
/*!************************************!*\
  !*** external "lodash/difference" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash/difference");

/***/ }),

/***/ "lodash/find":
/*!******************************!*\
  !*** external "lodash/find" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash/find");

/***/ }),

/***/ "lodash/isEmpty":
/*!*********************************!*\
  !*** external "lodash/isEmpty" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash/isEmpty");

/***/ }),

/***/ "lodash/isUndefined":
/*!*************************************!*\
  !*** external "lodash/isUndefined" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash/isUndefined");

/***/ }),

/***/ "lodash/negate":
/*!********************************!*\
  !*** external "lodash/negate" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash/negate");

/***/ }),

/***/ "lodash/omit":
/*!******************************!*\
  !*** external "lodash/omit" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash/omit");

/***/ }),

/***/ "lodash/pick":
/*!******************************!*\
  !*** external "lodash/pick" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash/pick");

/***/ }),

/***/ "lodash/pickBy":
/*!********************************!*\
  !*** external "lodash/pickBy" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash/pickBy");

/***/ }),

/***/ "lodash/uniqBy":
/*!********************************!*\
  !*** external "lodash/uniqBy" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash/uniqBy");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })

/******/ });
//# sourceMappingURL=main.map