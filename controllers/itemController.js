const { CustomAPIError, NotFoundError, BadRequestError } = require("../errors");
const Item = require("../models/foundItem");
const { StatusCodes } = require("http-status-codes");
const isAllowedTo = require("../utils/isAllowedTo");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

const postItem = async (req, res) => {
  if (!req.files || !req.files.photo) {
    throw new BadRequestError("Iltimos, Rasm yuklang");
  }

  const photo = req.files.photo;
  const uploadDir = path.join(__dirname, "../public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const photoPath = path.join(
    uploadDir,
    `user-${req.user.userId}-${Date.now()}.jpeg`
  );

  await photo.mv(photoPath);

  const newItem = await Item.create({
    userId: req.user.userId,
    photo: `/uploads/${path.basename(photoPath)}`,
    name: req.body.name,
    location: req.body.location,
    region: req.body.region,
    city: req.body.city,
    street: req.body.street,
    orientation: req.body.orientation,
    address: req.body.address,
    category: req.body.category,
    foundDate: req.body.foundDate,
    contactNumber: req.body.contactNumber,
    firstQuestion: req.body.firstQuestion,
    secondQuestion: req.body.secondQuestion,
  });
  res.status(StatusCodes.CREATED).json({ msg: "A new Item added", newItem });
};

const getAllItems = async (req, res) => {
  const {
    name,
    category,
    city,
    region,
    street,
    foundDate,
    page = 1,
    limit = 10,
    sort,
    fields,
  } = req.query;

  const queryObject = {};

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (category) {
    queryObject.category = category;
  }

  if (city) {
    queryObject.city = city;
  }

  if (region) {
    queryObject.region = region;
  }

  if (street) {
    queryObject.street = { $regex: street, $options: "i" }; 
  }

  if (foundDate) {
    queryObject.foundDate = new Date(foundDate); 
  }

  let result = Item.find(queryObject);

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
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(Number(limit));
  const items = await result;
  res.status(StatusCodes.OK).json({ items, count: items.length });
};

const updateFoundItem = async (req, res) => {
  const { itemId } = req.params;
  const { status } = req.body;

  const item = await Item.findOne({ _id: itemId });
  if (!item) {
    throw new NotFoundError("No item found with that ID");
  }
  isAllowedTo(req.user, item.userId);
  item.status = status;
  await item.save();
  res.status(StatusCodes.OK).json({ msg: "Davo holati yangilandi!", item });
};

const getSingleItem = async (req, res) => {
  const { itemId } = req.params;
  const item = await Item.findOne({ _id: itemId });
  if (!item) {
    throw new NotFoundError("No item found with that ID");
  }
  res.status(StatusCodes.OK).json({ item });
};

module.exports = {
  postItem,
  getAllItems,
  updateFoundItem,
  getSingleItem,
};
