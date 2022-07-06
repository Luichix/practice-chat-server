const { createServer } = require('http')
const { ApolloServer } = require('apollo-server-express')
const app = require('./app')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const { typeDefs } = require('./schema/typeDefs')
const { resolvers, pubsub } = require('./schema/resolvers')
const config = require('./utils/config')
const logger = require('./utils/logger')

const startApolloServer = async () => {
  const httpServer = createServer(app)

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    context: { pubsub },
  })

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  })

  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  server.applyMiddleware({ app, path: '/graphql', cors: true })
  await new Promise((resolve) =>
    httpServer.listen({ port: config.PORT }, resolve)
  )
  logger.info(`🚀 Server running on port ${config.PORT}`)
  return { server, app }
}

startApolloServer()
