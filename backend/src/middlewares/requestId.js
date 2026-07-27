import { v4 as uuid } from "uuid";

const requestId = (req, res, next) => {
  req.requestId = uuid();

  res.setHeader("X-Request-ID", req.requestId);

  next();
};

export default requestId;