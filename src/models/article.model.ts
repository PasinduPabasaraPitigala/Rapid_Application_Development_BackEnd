import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import * as SchemaType from "../types/SchemaTypes";

const ArticleSchema = new mongoose.Schema<SchemaType.IArticle>({
    title: {type: String, required: true},
    description: {type: String, required: true},
    publishedDate: {type: Date, required: true, default: Date.now()},
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'}
})

const ArticleModel = mongoose.model('Article', ArticleSchema);
export default ArticleModel;