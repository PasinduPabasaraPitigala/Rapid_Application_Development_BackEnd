import mongoose, {Document} from "mongoose";
import {ObjectId} from "mongodb";

export interface IArticle extends mongoose.Document {
    title: string,
    description: string,
    publishedDate: Date,
    user: ObjectId
}

export interface Iuser extends Document {
    username: string,
    fname: string,
    lname: string,
    email: string,
    password: string,
}
