const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/checkAuth');


module.exports = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (ex) {
                throw new Error(ex);
            }
        },
        getPost: async (parent, { id }) => {
            try {
                const post = await Post.findById(id);

                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (ex) {
                throw new Error(ex);
            }
        }
    },
    Mutation: {
        createPost: async (parent, { body }, context) => {
            const user = checkAuth(context);

            if (body.trim() === '') {
                throw new UserInputError('Post body must not be empty');
            }

            const newPost = await new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            }).save();

            context.pubsub.publish('NEW_POST', { newPost });
            return newPost;
        },
        deletePost: async (parent, { id }, context) => {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(id);

                if (post) {
                    if (post.username === user.username) {
                        post.delete();

                        return post;
                    } else {
                        throw new AuthenticationError('Action not allowed');
                    }
                } else {
                    throw new UserInputError('Post not found');
                }
            } catch (ex) {
                throw new Error(ex);
            }
        },
        likePost: async (parent, { id }, context) => {
            const { username } = checkAuth(context);

            const post = await Post.findById(id);

            if (post) {
                const likeIndex = post.likes.findIndex(like => like.username === username);

                if (likeIndex > -1) {
                    // post already liked
                    post.likes.splice(likeIndex, 1);
                } else {
                    // like it 
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    });
                }

                await post.save();

                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        }
    },
    Subscription: {
        newPost: {
            subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }
}