'use strict';
import _ from "lodash";

export default (io) => {
  io.use((socket, next) => {
    const user = _.get(socket, 'request.session.user');

    if (!user) {
      return next(new Error("unauthorized"))
    }

    socket.user_id = user._id.toString();
    return next();
  });

  io.on("connection", (socket) => {
    socket.join(socket.user_id);

    socket.on("private-message", ({ content, to }) => {
      socket.to(to).to(socket.user_id).emit("private-message", {
        content,
        from: socket.user_id,
        to,
      });
    })
  });
}