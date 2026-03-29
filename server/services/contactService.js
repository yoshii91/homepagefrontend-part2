const { generateReceiptId } = require("../utils/id");

class ContactService {
  constructor({ contactRepository, imageStorage }) {
    this.contactRepository = contactRepository;
    this.imageStorage = imageStorage;
  }

  async create({ payload, photoFile }) {
    const photo = await this.imageStorage.save(photoFile);

    const record = {
      id: generateReceiptId(),
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      address: payload.address,
      service: payload.service,
      detail: payload.detail,
      photo,
      createdAt: new Date().toISOString()
    };

    await this.contactRepository.save(record);
    return { id: record.id };
  }
}

module.exports = { ContactService };
