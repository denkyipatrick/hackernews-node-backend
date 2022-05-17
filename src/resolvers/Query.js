const user = (root, args, context) => context.prisma.user.findMany();
const feed = async (_root, args, context) => {
  const { filter, orderBy, skip, take } = args;

  const where = filter
    ? {
        OR: [
          { url: { contains: filter } },
          { description: { contains: filter } },
        ],
      }
    : {};

  const links = await context.prisma.link.findMany({
    where,
    skip,
    take,
    orderBy,
  });

  const count = await context.prisma.link.count({ where });

  return { count, links };
};

module.exports = {
  feed,
  user,
};
