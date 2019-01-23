import express from "express";
let router = express.Router();

let list = [];

const HomeController = io => {
  io.on('connection', socket => {
    socket.emit('broadcastItems', {list: list})
  });

  io.on('items', socket => {
    socket.emit('broadcastItems', {list: list})
  });

  router.post('/items', (req, res) => {
    let item = req.body.item;
    list.push(item);
    io.emit('broadcastItems', {list: list});
    res.json({success: true});
  });

  return router;
}

export default HomeController;