const Item = require("../models/foundItem");
const User = require("../models/userModel");

const AppError = require("../utils/appError");

class UserService {
  constructor() {
    this.itemModel = Item;
    this.userModel = User;
  }

  async getAuthorItems(userId) {
    const my_posts = await this.userModel
      .findById(userId)
      .populate("items")
      .select("-__v -status -role -mobile -email -name");
    const my_posts_length = await this.userModel
      .findById(userId)
      .populate("items")
      .countDocuments();
    return { my_posts, my_posts_length };
  }

  async updateAuthorItemStatus(itemId, userId, status) {
    const item = await this.itemModel.findById(itemId);

    if (!item) {
      throw new AppError("Item not found");
    }
    if (item.userId.toString() !== userId.toString()) {
      throw new AppError("Mumkin emas! Taqiqlangan", 400);
    }

    item.status = status;
    await item.save();

    return item;
  }
}

module.exports = new UserService();
