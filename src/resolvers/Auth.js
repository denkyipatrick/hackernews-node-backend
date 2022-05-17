const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { APP_SECRET } = require("../util");

// authJs resolvers
const signup = async (args, context) => {
  console.log(args);
  const { name, email } = args;
  let password = await bcryptjs.hash(args.password, 10);

  const user = await context.prisma.user.create({
    data: { name, email, password },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

const login = async (args, context) => {
  const { email, password } = args;
  const user = await context.prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("user could not be located.");
  }

  const valid = await bcryptjs.compare(password, user.password);
  if (!valid) {
    throw new Error("Password is incorrect.");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

module.exports = {
  signup,
  login,
};
