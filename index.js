const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const { MONGO_DB } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

const PORT = process.env.port || 5000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, pubsub })
});

mongoose.connect(MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        return server.listen({ port: PORT });
    })
    .then(res => {
        console.log(`Server listen at ${res.url}`);
    })
    .catch(ex => {
        console.error(ex);
    });