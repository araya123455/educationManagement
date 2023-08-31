module.exports = {
  loginBodyValidatorMiddleware: (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ status: 400, message: "failed on loginBodyValidator" });
    next();
  },
};
