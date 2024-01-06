import dotenv from 'dotenv';
dotenv.config();

// const express = require('express');
import express from 'express';
import bodyParser from "body-parser";
import mongoose, {Schema} from "mongoose";
import {ObjectId} from "mongodb";
import * as process from "process";
import jwt, {Secret} from 'jsonwebtoken';

import UserModel from "./models/user.model";
import ArticleModel from "./models/article.model";
import * as SchemaTypes from "./types/SchemaTypes";

import CustomResponse from "./dtos/custom.response";

import UserRoutes from "./routes/user.routes";
import ArticleRoutes from "./routes/article.routes";

// invoke the express
const app = express();

// @ts-ignore
app.use(bodyParser.json());

interface User {
    username: string,
    fname: string,
    lname: string,
    email: string,
    password: string
}

mongoose.connect(process.env.MONGO_URL as string)
const db = mongoose.connection

db.on('error', (error) => {
    console.log("DB Connection Error: ", error)
})

db.on('open', () => {
    console.log("DB Connected Successfully")
})

// ----------------- user -------------------

app.use('/user', UserRoutes)

// ----------------- article -------------------

app.use('/article', ArticleRoutes)

// start the server
app.listen(8081, () => {
    console.log("Server started on port 8081")
})