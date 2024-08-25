const Item = require("../models/foundItem");
const { StatusCodes } = require("http-status-codes");
const ItemService = require("../service/ItemService");
const bunyan = require("bunyan");
const log = bunyan.createLogger({ name: "ItemController" });

exports.postItem = async (req, res, next) => {
  console.log('req.user:::',req.user.id)
  try {
    const newItem = await ItemService.createItem(
      req.body,
      req.files,
      req.user.id
    );

    res
      .status(StatusCodes.CREATED)
      .json({ msg: "Yangi topilma qo'shildi", newItem });
  } catch (error) {
    log.error(error);
    next(error);
  }
};

exports.getAllItems = async (req, res, next) => {
  try {
    const { items, total, totalPages, pageNum, limitNum } =
      await ItemService.getAllItems(req.query);

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
  } catch (error) {
    log.error(error);
    next(error);
  }
};

exports.updateFoundItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body;
    const item = await ItemService.updateItemStatus(itemId, status);
    res.status(StatusCodes.OK).json({ msg: "Davo holati yangilandi!", item });
  } catch (error) {
    next(error);
  }
};

exports.getSingleItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await ItemService.getItemById(itemId);
    res.status(StatusCodes.OK).json({ item });
  } catch (error) {
    log.error(error);
    next(error);
  }
};
