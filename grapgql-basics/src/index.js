import { GraphQLServer } from 'graphql-yoga';

const users = [{
    id: '1',
    name: 'Daniel',
    email: 'asdasd',
    age: 28
},{
    id: '2',
    name: 'Pato',
    email: 'asdasd2'
},{
    id: '3',
    name: 'Andrés',
    email: 'asdasd3'
}];

const posts = [{
    id: '901',
    title: 'My first post',
    body: 'Basics of graphQL',
    published: true,
    author: '1'
},{
    id: '902',
    title: 'My second post',
    body: 'Nothing here....',
    published: false,
    author: '1'
},{
    id: '903',
    title: 'My third post',
    body: '',
    published: false,
    author: '2'
}];

const comments = [{
    id: '701',
    text: 'My first comment',
    author: '1',
    post: '901'
},{
    id: '702',
    text: 'My second comment',
    author: '1',
    post: '902'
},{
    id: '703',
    text: 'My third comment',
    author: '2',
    post: '903'
}];

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        post: Post!
    }
    
    type Mutation {
        createUser(name: String!, email: String!, age: Int)
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
    
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            });
        },
        comments(parent, args, ctx, info) {
            return comments;
        },
        me() {
            return {
                id: '123456',
                name: 'Daniel',
                email: 'asdasd',
                age: 28
            }
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }

            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return isTitleMatch || isBodyMatch;
            });
        },
        post() {
            return {
                id: '882',
                title: 'My first post',
                body: '',
                published: false
            }
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id;
            });
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            });
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post
            });
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            });
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id;
            });
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