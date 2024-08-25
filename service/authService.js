const User = require("../models/userModel");
const AppError = require("../utils/appError");

class AuthService {
  constructor() {
    this.userModel = User;
  }
  async registerData(data) {
    const { name, email, mobile, password } = data;
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new AppError("Bu email bilan foydalanuvchi ro'yxatdan o'tgan", 400);
    }
    const newUser = await this.userModel.create({
      name,
      email,
      mobile,
      password,
    });
    return newUser;
  }

  async loginData(data) {
    const { email, password } = data;
    if (!email || !password) {
      throw new AppError("Barcha ma'lumotlarni kiriting");
    }
    const user = await this.userModel.findOne({ email }).select("+password");
   
    if (!user) {
      throw new AppError("Bunday foydalanuvchi mavjud emas", 403);
    }
    if (user.status === "blocked") {
      throw new AppError("Sizni hisobingiz bloklangan", 400);
    }
    if (user.status === "deleted") {
      throw new AppError("Sizning akkauntingiz o'chirilgan", 400);
    }

    const isMatchPassword = await user.comparePassword(password);

    if (!isMatchPassword) {
      throw new AppError("Ma'lumotlar noto'g'ri kritildi");
    }
    return user;
  }
}

module.exports = new AuthService();
