'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var authorSchema = mongoose.Schema({
    firstName: 'string',
    lastName: 'string',
    userName: {
        type: 'string',
        unique: true
    }
});

var commentSchema = mongoose.Schema({
    content: 'string'
});

var blogPostSchema = mongoose.Schema({
    title: 'string',
    content: 'string',
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    comments: [commentSchema]
});

blogPostSchema.pre('find', function (next) {
    this.populate('author');
    next();
});

blogPostSchema.pre('findOne', function (next) {
    this.populate('author');
    next();
});

blogPostSchema.virtual('authorName').get(function () {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.serialize = function () {
    return {
        id: this._id,
        author: this.authorName,
        content: this.content,
        title: this.title,
        comments: this.comments
    };
};

const Author = mongoose.model('Author', authorSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {
    Author,
    BlogPost
};



// "use strict";

// const mongoose = require("mongoose");
// mongoose.Promise = global.Promise;


// var authorSchema = mongoose.Schema({
//     firstName: 'string',
//     lastName: 'string',
//     userName: {
//         type: 'string',
//         unique: true
//     }
// });

// var commentSchema = mongoose.Schema({ content: 'string' });

// var postSchema = mongoose.Schema({
//     title: 'string',
//     content: 'string',
//     author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
//     comments: [commentSchema]
// });

// postSchema.pre('find', function (next) {
//     this.populate('author');
//     next();
// });

// postSchema.pre('findOne', function (next) {
//     this.populate('author');
//     next();
// });

// postSchema.virtual("authorName").get(function () {
//     return `${this.author.firstName} ${this.author.lastName}`.trim();
// });

// postSchema.methods.serialize = function () {
//     return {
//         id: this._id,
//         author: this.authorName,
//         title: this.title,
//         content: this.content,
//         comments: this.comments
//     };
// };

// var Author = mongoose.model('Author', authorSchema);
// const BlogPost = mongoose.model('BlogPost', postSchema);



// module.exports = {BlogPost, Author};