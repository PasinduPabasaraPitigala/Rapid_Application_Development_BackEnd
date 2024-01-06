// Create Article
import express from "express";
import ArticleModel from "../models/article.model";
import {ObjectId} from "mongodb";
import CustomResponse from "../dtos/custom.response";
import UserModel from "../models/user.model";
import * as Middleware from "../middlewares";

export const createArticle = async (req: express.Request, res: any) => {

    try {

        let req_body = req.body;

        let user_id = res.tokenData.user._id;

        console.log(req_body)

        let articleModel = new ArticleModel({
            title: req_body.title,
            description: req_body.description,
            user: new ObjectId(user_id)
        });

        await articleModel.save().then(r => {
            res.status(200).send(
                new CustomResponse(200, "Article created successfully.")
            )
        }).catch(e => {
            console.log(e)
            res.status(100).send(
                new CustomResponse(100, "Something went wrongs")
            )
        });

    } catch (error) {
        res.status(100).send("Error");
    }
}

// Get All Articles
export const getAllArticles = async (req: express.Request, res: express.Response) => {
    try {

        let req_query: any = req.query;
        let size: number = req_query.size;
        let page: number = req_query.page;

        let articles = await ArticleModel.find().limit(size).skip(size * (page - 1));

        let documentCount = await ArticleModel.countDocuments();
        let pageCount = Math.ceil(documentCount/size);

        res.status(200).send(
            new CustomResponse(200, "Articles are found successfully", articles, pageCount)
        )

    } catch (error) {
        res.status(100).send("Error");
    }
}

// Get Articles By Username
export const getArticleByUsername = async (req: express.Request, res: express.Response) =>{
    try {

        let req_query: any = req.query;
        let size: number = req_query.size;
        let page: number = req_query.page;

        let username: string = req.params.username;

        let user:any = await UserModel.findOne({username: username});

        if(!user) {
            res.status(404).send(
                new CustomResponse(404, "User not found")
            )
        } else {
            let articles = await ArticleModel.find({user: user._id}).limit(size).skip(size * (page - 1))

            let documentCount = await ArticleModel.countDocuments({user: user._id});
            let pageCount = Math.ceil(documentCount/size);

            res.status(200).send(
                new CustomResponse(200, "Articles are found successfully", articles, pageCount)
            )
        }

    } catch (error) {
        res.status(100).send("Error");
    }
}

// Get My Articles
export const getMyArticles = async (req: express.Request, res: any) => {
    try {

        let req_query: any = req.query;
        let size: number = req_query.size;
        let page: number = req_query.page;

        let user_id = res.tokenData.user._id;

        let articles = await ArticleModel.find({user:user_id}).limit(size).skip(size * (page - 1))

        let documentCount = await ArticleModel.countDocuments({user: user_id});
        let pageCount = Math.ceil(documentCount/size);

        res.status(200).send(
            new CustomResponse(200, "Articles are found successfully", articles, pageCount)
        )

    } catch (error) {
        res.status(100).send("Error");
    }
}

// Update Article
export const updateArticle = async (req: express.Request, res: any) => {
    try {

        let req_body: any = req.body

        let user_id = res.tokenData.user._id;

        let article = await ArticleModel.find({_id: req_body.id ,user: user_id})

        console.log('test');

        if(article) {

            await ArticleModel.findOneAndUpdate({_id: req_body.id}, {
                title: req_body.title,
                description: req_body.description
            })
                .then(r => {
                    res.status(200).send(
                        new CustomResponse(100, "Article updated successfully.")
                    )
                }).catch(error => {
                    console.log(error)
                    res.status(100).send(
                        new CustomResponse(100, "Something went wrong.")
                    )
                })

        } else {
            res.stat(401).send(
                new CustomResponse(401, "Access denied")
            )
        }


    } catch (error) {
        res.status(100).send("Error");
    }
}

// Delete Article
export const deleteArticle = async (req: express.Request, res: any) => {
    try {
        let user_id = res.tokenData.user._id;

        let article_id: string = req.params.id;

        let article = await ArticleModel.find({_id: article_id ,user: user_id})

        if(article) {

            await ArticleModel.deleteOne({_id: article_id}).then(r => {
                res.status(200).send(
                    new CustomResponse(200, "Article is deleted successfully.")
                )
            }).catch(e => {
                res.status(100).send(
                    new CustomResponse(100, "Something went wrong.")
                )
            })

        } else {
            res.stat(401).send(
                new CustomResponse(401, "Access denied")
            )
        }

    } catch (error) {
        res.status(100).send("Error");
    }
}