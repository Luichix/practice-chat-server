const { prisma } = require('../prisma/client')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()
const messages = []

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
    addMessage: (parent, { text, createdAt, uid }) => {
      const user = {
        uid: uid,
        name: 'Client One',
        avatar: 'https://i.pravatar.cc/300',
      }
      const id = messages.length + 1
      const message = { id, text, createdAt, user }
      messages.unshift(message)
      pubsub.publish(SUBSCRIPTION_EVENTS.MESSAGE_ADDED, {
        messageAdded: message,
      })
      return message
    },
    sendMessage: async (parent, { text, uid }) => {
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

      return message
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.MESSAGE_ADDED),
    },
  },
}

module.exports = { resolvers, pubsub }
