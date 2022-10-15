import { 
  logError,
  ClientView,
  REACTION,
  ERR_ENTRY_NOT_FOUND, 
  ERR_UNAUTHORIZE, 
  ERR_SERVER_FAILED
} from "../libs/errors.lib.js";

const handlers = [
  {
    match: (error) => error.code === ERR_UNAUTHORIZE.CODE,
    do: (error, req, res, ErrorView) => res.status(401).send(ErrorView(error))
  },
  {
    match: (error) => error.code === ERR_ENTRY_NOT_FOUND.CODE,
    do: (error, req, res, ErrorView) => res.status(404).send(ErrorView(error))
  },
  {
    match: (error) => Array.isArray(error.reactions) && error.reactions.includes(REACTION.FIX_DATA),
    do: (error, req, res, ErrorView) => res.status(400).send(ErrorView(error))
  },
  {
    match: (error) => true,
    do: (error, req, res, ErrorView) => { 
      logError(error);
      return res.status(500).send(ErrorView(new ERR_SERVER_FAILED(error)));
    }
  }
];

export default function (error, req, res, next) {
  if (!error) return next();

  for (const handler of handlers) {
    if (handler.match(error)) {
      return handler.do(error, req, res, ClientView);
    }
  }
}