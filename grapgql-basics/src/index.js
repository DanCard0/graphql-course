import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        me: User!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
`;

// Resolvers
const resolvers = {
    Query: {
        greeting(parent, args, ctx, info) {
            if (args.name && args.position) {
                return `Hello, ${args.name}! you are my favourite ${args.position}`;
            } else {
                return 'Hello!'
            }
        },
        me() {
            return {
                id: '123456',
                name: 'Daniel',
                email: 'asdasd',
                age: 28
            }
        }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('The server is up!');
});