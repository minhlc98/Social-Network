'use strict';

export default function(app) {
  app.route("/chat")
    .get((req, res) => res.json({ success: true }));
}