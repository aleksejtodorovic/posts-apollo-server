const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/checkAuth');

module.exports = {
    Mutation: {
        createComment: async (parent, { postId, body }, context) => {
            const { username } = checkAuth(context);

            if (body.trim() === '') {
                throw new UserInputError('Empty comment', { errors: { body: 'Body must not be empty ' } });
            }

            const post = await Post.findById(postId);

            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                });

                await post.save();

                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        },
        deleteComment: async (parent, { postId, commentId }, context) => {
            const user = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                const commentIndex = post.comments.findIndex(comment => comment.id === commentId);

                if (commentIndex > -1) {
                    if (post.comments[commentIndex].username === user.username) {
                        post.comments.splice(commentIndex, 1);
                        await post.save();
                        return post;
                    } else {
                        throw new AuthenticationError('Action not allowed');
                    }
                } else {
                    throw new UserInputError('Comment not found');
                }
            } else {
                throw new UserInputError('Post not found');
            }
        }
    }
}