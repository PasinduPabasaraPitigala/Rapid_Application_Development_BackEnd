import express from "express";
import jwt, {Secret} from "jsonwebtoken";
import process from "process";
import ArticleModel from "../models/article.model";
import {ObjectId} from "mongodb";
import CustomResponse from "../dtos/custom.response";
import UserModel from "../models/user.model";
import * as Middleware from "../middlewares";
import * as ArticleController from "../controllers/article.controller";

const router = express.Router();

router.post('/', Middleware.verifyToken, ArticleController.createArticle);

router.get('/', ArticleController.getAllArticles)

router.get('/:username', ArticleController.getArticleByUsername)

router.get('/get/my', Middleware.verifyToken, ArticleController.getMyArticles)

router.put('/', Middleware.verifyToken, ArticleController.updateArticle)

router.delete('/:id', Middleware.verifyToken, ArticleController.deleteArticle)

export default router;