const { StatusCodes } = require("http-status-codes");
const UserService = require("../service/UserService");
const bunyan = require("bunyan");
const log = bunyan.createLogger({ name: "UserController" });

exports.getAllMyItems = async (req, res, next) => {
  const userId = req.user.id;
  console.log("req.user:::", req.user);
  try {
    const { my_posts, my_posts_length } =
      await UserService.getAuthorItems(userId);
    console.log("my_posts::", my_posts);
    res.status(StatusCodes.OK).json({
      my_posts,
      my_posts_length,
    });
  } catch (error) {
    log.error(error);
    next(error);
  }
};

exports.updateMyPostStatus = async (req, res, next) => {
  const { itemId } = req.params;
  const { status } = req.body;


  try {
    await UserService.updateAuthorItemStatus(itemId, req.user.id, status);
    res.status(StatusCodes.OK).json({ msg: "Status yangilandi" });
  } catch (error) {
    log.error(error);
    next(error);
  }
};
