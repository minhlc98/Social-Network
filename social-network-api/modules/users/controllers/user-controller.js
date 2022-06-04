'use strict';

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
const UserModel = mongoose.model("User");
const UserControllers = {};

UserControllers.register = async (req, res, next) => {
  try {
    const data = req.body;
    const existed_user = await UserModel.findOne({ 
      $or: [
        { username: data.username },
        { email: data.email }
      ] 
    }).lean(true);

    if (existed_user) {
      if (existed_user.username === data.username) {
        return res.json({ success: false, code: "ERR_INVALID_DATA", message: "Tên đăng nhập đã tồn tại." });
      }

      if (existed_user.email === data.email) {
        return res.json({ success: false, code: "ERR_INVALID_DATA", message: "Email đã tồn tại" });
      }
    }

    const hashed_password = await bcrypt.hash(data.password, 10);
    const code = uuidv4().split("-")[0];
    const created_user = await UserModel.findOneAndUpdate(
      { username: data.username },
      {
        $set: {
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.username,
          password: hashed_password,
          email: data.email,
          phone: data.phone,
          activate_code: code,
          gender: data.gender
        }
      },
      { new: true, lean: true, upsert: true, setDefaultsOnInsert: true }
    );

    delete created_user.password;
    
    return res.json({ success: true, created_user });
  } catch (e) {
    return next(e);
  }
};

UserControllers.login = async (req, res, next) => {
  try {
    if (req.session.user) {
      return res.json({ success: true, user: req.session.user });
    }
  
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username }).lean(true);
    if (!user) {
      return res.json({ success: false, code: "ERR_USER_NOT_FOUND", message: "Tên đăng nhập hoặc mật khẩu không đúng." });
    }
  
    const is_matched_password = await bcrypt.compare(password, user.password);
    if (!is_matched_password) {
      return res.json({ success: false, code: "ERR_USER_NOT_FOUND", message: "Tên đăng nhập hoặc mật khẩu không đúng." });
    }
  
    delete user.password;
  
    req.session.user = user;
  
    return res.json({ success: true, user });
  } catch (e) {
    return next(e);
  }
};

UserControllers.logout = async (req, res, next) => {
  if (req.session.user) {
    req.session.destroy();
  }
  return res.json({ success: true });
};

export default UserControllers;