const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()
const messages = []

const SUBSCRIPTION_EVENTS = {
  MESSAGE_ADDED: 'MESSAGE_ADDED',
}

const resolvers = {
  Query: {
    allMessages: () => messages,
  },
  Mutation: {
    addMessage: (parent, { text, createdAt, uid }) => {
      const user = {
        uid: uid,
        name: 'Client One',
        avatar: 'https://i.pravatar.cc/300',
      }
      const _id = messages.length + 1
      const message = { _id, text, createdAt, user }
      messages.unshift(message)
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
}

module.exports = { resolvers, pubsub }
