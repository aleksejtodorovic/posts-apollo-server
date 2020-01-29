const gql = require('graphql-tag');

const typeDefs = gql`
    type Comment {
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }

    type Like {
        id: ID!
        createdAt: String!
        username: String!
    }
    
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }

    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    input LoginInput {
        username: String!
        password: String!
    }

    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }

    type Query {
        getPosts: [Post]!
        getPost(id: ID!): Post!
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(loginInput: LoginInput): User!
        createPost(body: String!): Post!
        deletePost(id: ID!): Post!
        likePost(id: ID!): Post!
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
    }

    type Subscription {
        newPost: Post!
    }
`;

module.exports = typeDefs;