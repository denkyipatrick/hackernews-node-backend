const { ApolloServer, PubSub } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const Query = require("./resolvers/Query");
const Link = require("./resolvers/Link");
const User = require("./resolvers/User");
const Mutation = require("./resolvers/Mutation");
const Subscription = require("./resolvers/Subscription");
const { decodeAuthHeader } = require("./util");

const prisma = new PrismaClient();
const pubsub = new PubSub();

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Link,
  User,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: ({ req }) => ({
    prisma,
    pubsub,
    userId:
      req && req.headers.authorization
        ? decodeAuthHeader(req.headers.authorization)
        : null,
  }),
});

server.listen().then(({ url }) => console.log(`Server running on ${url}`));
