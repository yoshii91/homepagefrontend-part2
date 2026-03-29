const express = require("express");
const { createContactController } = require("../controllers/contactController");

function createContactRouter({ upload, contactService }) {
  const router = express.Router();
  const postContact = createContactController({ contactService });

  router.post("/contact", upload.single("photo"), postContact);

  return router;
}

module.exports = { createContactRouter };
