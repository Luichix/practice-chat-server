const { prisma } = require('../prisma/client')
const { PubSub } = require('graphql-subscriptions')
const { GraphQLDate } = require('graphql-scalars')

const pubsub = new PubSub()

const SUBSCRIPTION_EVENTS = {
  MESSAGE_ADDED: 'MESSAGE_ADDED',
}

const resolvers = {
  Query: {
    allMessages: () =>
      prisma.message.findMany({
        include: {
          user: true,
        },
      }),
  },
  Mutation: {
    addMessage: async (parent, { text, uid }) => {
      const user = await prisma.user.findUnique({ where: { uid } })

      const content = await prisma.message.create({
        data: {
          text: text,
          user: {
            connect: {
              uid: uid,
            },
          },
        },
      })
      const message = { ...content, user }
      pubsub.publish(SUBSCRIPTION_EVENTS.MESSAGE_ADDED, {
        messageAdded: message,
      })
      return message
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.MESSAGE_ADDED),
    },
  },
  Date: GraphQLDate,
}

module.exports = { resolvers, pubsub }
