const StreamerVerifyMiddleware = (req, res, next) => {
  const isStreamer = req.decoded.isStreamer;

  if (!isStreamer) {
    res.send({ error: 'You are not Streamer' });
    return;
  }

  next();
}

export default StreamerVerifyMiddleware;