const Auth = require("./Auth");

const signup = (root, args, context) => Auth.signup(args, context);
const login = (root, args, context) => Auth.login(args, context);
const post = (_root, args, context) => {
  const { userId } = context;

  const link = context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: {
        connect: { id: userId },
      },
    },
  });

  context.pubsub.publish("NEW_LINK", link);

  return link;
};
const vote = async (root, args, context) => {
  const { userId } = context;
  const { linkId } = args;

  if (!userId) {
    throw new Error("Login before you vote.");
  }

  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  const newVote = await context.prisma.vote.create({
    data: {
      connect: { user: { id: userId } },
      connect: { link: { id: linkId } },
    },
  });


  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
};

const deletePost = (root, args, context) => {
  const { linkId } = args;
  return context.prisma.link.delete({ where: { id: linkId } });
};

module.exports = {
  signup,
  login,
  post,
  vote,
  deletePost,
};
