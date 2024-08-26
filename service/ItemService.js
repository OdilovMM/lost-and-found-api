const Item = require("../models/foundItem");
const path = require("path");
const fs = require("fs");
const AppError = require("../utils/appError");

class ItemService {
  constructor() {
    this.itemModel = Item;
  }

  async createItem(data, files, userId) {
    if (!files || !files.photo) {
      throw new AppError("Iltimos, Rasm yuklang", 403);
    }

    const photo = files.photo;
    const uploadDir = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const photoPath = path.join(uploadDir, `user-${userId}-${Date.now()}.jpeg`);

    await photo.mv(photoPath);

    const newItem = await this.itemModel.create({
      userId: userId,
      photo: `/uploads/${path.basename(photoPath)}`,
      ...data,
    });
    console.log(newItem);

    return newItem;
  }

  async getAllItems(query) {
    const {
      name,
      category,
      city,
      region,
      street,
      foundDate,
      page = 1,
      limit = 12,
      sort,
      fields,
    } = query;

    const queryObject = {};

    if (name) {
      queryObject.name = { $regex: name, $options: "i" };
    }
    if (category && category !== "Hammasi") {
      queryObject.category = category;
    }

    if (city && city !== "Hammasi") {
      queryObject.city = city;
    }

    if (region && region !== "Hammasi") {
      queryObject.region = region;
    }

    if (street && street !== "Hammasi") {
      queryObject.street = { $regex: street, $options: "i" };
    }

    if (foundDate) {
      queryObject.foundDate = new Date(foundDate);
    }

    let result = this.itemModel.find(queryObject);

    if (sort) {
      const sortList = sort.split(",").join(" ");
      result = result.sort(sortList);
    } else {
      result = result.sort("createdAt");
    }

    if (fields) {
      const fieldList = fields.split(",").join(" ");
      result = result.select(fieldList);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    result = result.skip(skip).limit(Number(limit));

    const items = await result;
    const total = await this.itemModel.countDocuments(queryObject);
    const totalPages = Math.ceil(total / limitNum);

    return { items, total, totalPages, pageNum, limitNum };
  }

  async updateItemStatus(itemId, status) {
    const item = await this.itemModel.findOne({ _id: itemId });
    if (!item) {
      throw new AppError("Hech narsa toplimadi", 404);
    }

    item.status = status;
    await item.save();

    return item;
  }

  async getItemById(itemId) {
    const item = await this.itemModel.findOne({ _id: itemId });
    if (!item) {
      throw new AppError("No item found with that ID", 404);
    }
    return item;
  }
}

module.exports = new ItemService();
