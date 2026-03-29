const { validateContactInput } = require("../validation/contactValidation");

function createContactController({ contactService }) {
  return async function postContact(req, res, next) {
    try {
      const payload = validateContactInput(req.body || {});
      const result = await contactService.create({
        payload,
        photoFile: req.file || null
      });

      return res.status(201).json({ success: true, id: result.id });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { createContactController };
