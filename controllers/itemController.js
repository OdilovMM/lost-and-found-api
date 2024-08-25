const Item = require("../models/foundItem");
const { StatusCodes } = require("http-status-codes");
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
    region: req.body.region,
    city: req.body.city,
    street: req.body.street,
    orientation: req.body.orientation,
    category: req.body.category,
    foundDate: req.body.foundDate,
    contactNumber: req.body.contactNumber,
  });
  res.status(StatusCodes.CREATED).json({ msg: "Yangi topilma qo'shildi", newItem });
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
    limit = 12,
    sort,
    fields,
  } = req.query;

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
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  result = result.skip(skip).limit(Number(limit));
  const items = await result;
  const total = await Item.countDocuments(queryObject);
  const totalPages = Math.ceil(total / limitNum);

  res.status(StatusCodes.OK).json({
    items,
    meta: {
      pagination: {
        page: pageNum,
        pageSize: limitNum,
        pageCount: totalPages,
        total,
      },
      category: [
        "Hammasi",
        "Elektronikalar",
        "Kiyimlar",
        "Zargarlik-buyumlari",
        "Shaxsiy",
        "Hujatlar",
        "Kalitlar",
        "Sumkalar",
        "Sport",
        "Uy anjomlari",
        "Boshqalar",
      ],
      region: [
        "Hammasi",
        "Toshkent",
        "Andijon",
        "Buxoro",
        "Jizzax",
        "Qarshi",
        "Nukus",
        "Namangan",
        "Samarkand",
        "Sirdaryo",
        "Surxondaryo",
        "Fargʻona",
        "Xorazm",
      ],
      city: [
        "Hammasi",
        "Toshkent",
        "Andijon",
        "Buxoro",
        "Jizzax",
        "Qarshi",
        "Nukus",
        "Namangan",
        "Samarkand",
        "Sirdaryo",
        "Surxondaryo",
        "Fargʻona",
        "Xorazm",
      ],
    },
  });
};

const updateFoundItem = async (req, res) => {
  const { itemId } = req.params;
  const { status } = req.body;

  const item = await Item.findOne({ _id: itemId });
  if (!item) {
    throw new NotFoundError("Hech narsa toplimadi");
  }
  // isAllowedTo(req.user, item.userId);
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
