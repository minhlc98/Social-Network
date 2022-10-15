import { timeLog } from "./common.lib.js";

const REACTION = {
  FIX_DATA: 'FIX_DATA',
  RETRY: 'RETRY',
  FINISH: 'FINISH',
  TERMINATE: 'TERMINATE',
  CONTACT_ADMIN: 'CONTACT_ADMIN',
  LOGIN: 'LOGIN',
};

const toFullPlainObject = function ({ obj, includeProperties = [], excludeProperties = [], ignoreValues = ['', undefined, null] }) {
  let view = { ...obj };

  for (const prop of includeProperties) {
    if (!ignoreValues.includes(obj[prop])) {
      view[prop] = obj[prop];
    }
  }

  for (const prop of excludeProperties) {
    delete view[prop];
  }

  return view;
}

function ServerView(error) {
  if (error && typeof error === 'object') {
    const view = toFullPlainObject({ obj: error, includeProperties: ['code', 'message', 'stack', 'reactions'] });
    return view;
  }

  return error;
}

function ClientView(error) {
  if (error && typeof error === 'object') {
    const view = toFullPlainObject({ obj: error, includeProperties: ['code', 'message', 'reactions'] });
    return view;
  }

  return error;
}

function logError(error) {
  const view = ServerView(error);
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ERROR] [${timeLog()}] ${JSON.stringify(view, null, 2)}`);
  } else {
    console.log(`[ERROR] [${timeLog()}] ${JSON.stringify(view)}`);
  }
}

class ERR extends Error {
  constructor(props) {
    super();
    if (props) Object.assign(this, props);
    this.code = this.code || ERR.CODE;
    this.reactions = this.reactions || [REACTION.TERMINATE];
  }

  static get CODE() {
    return 'ERR';
  }

  static log(error) {
    if (!error.code) {
      error.code = this.CODE;
    }

    return logError(error);
  }
}

class ERR_INVALID_DATA extends ERR {
  constructor({ code, message, ...additionalProperties }) {
    super({ code, message, ...additionalProperties });
    this.code = code || ERR_INVALID_DATA.CODE;
    this.reactions = this.reactions || [REACTION.FIX_DATA];
  }

  static get CODE() {
    return 'ERR_INVALID_DATA';
  }
}

class ERR_ENTRY_NOT_FOUND extends ERR {
  constructor({ code, message, ...additionalProperties }) {
    super({ code, message, ...additionalProperties });
    this.code = code || ERR_ENTRY_NOT_FOUND.CODE;
    this.reactions = this.reactions || [REACTION.FIX_DATA];
  }

  static get CODE() {
    return 'ERR_ENTRY_NOT_FOUND';
  }
}

class ERR_SERVER_FAILED extends ERR {
  constructor(error) {
    super(error);
    this.code = ERR_SERVER_FAILED.CODE;
    this.message = error.message || 'Server Failed';
    this.reactions = [REACTION.CONTACT_ADMIN];
  }

  static get CODE() {
    return 'ERR_SERVER_FAILED';
  }
}

class ERR_UNAUTHORIZE extends ERR {
  constructor(error) {
    super(error);
    this.code = ERR_UNAUTHORIZE.CODE;
    this.reactions = [REACTION.LOGIN];
  }

  static get CODE() {
    return 'ERR_UNAUTHORIZE';
  }
}

class ERR_CONNECT_MONGO_FAILED extends ERR {
  constructor(error) {
    super(error);
    this.code = ERR_CONNECT_MONGO_FAILED.CODE;
    this.reactions = [REACTION.FIX_DATA];
  }

  static get CODE() {
    return 'ERR_CONNECT_MONGO_FAILED';
  }
}

export {
  REACTION,
  logError,
  ServerView,
  ClientView,
  ERR,
  ERR_INVALID_DATA,
  ERR_ENTRY_NOT_FOUND,
  ERR_SERVER_FAILED,
  ERR_UNAUTHORIZE,
  ERR_CONNECT_MONGO_FAILED,
};