const { CustomAPIError, NotFoundError, BadRequestError } = require("../errors");
const Item = require("../models/foundItem");
const { StatusCodes } = require("http-status-codes");

const postItem = async (req, res) => {

  const newItem = await Item.create({
    userId: req.user.userId,
    pictureURL: req.body.pictureURL,
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

module.exports = {
  postItem,
};
