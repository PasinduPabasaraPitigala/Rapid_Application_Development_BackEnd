// get all user
import express from "express";
import UserModel from "../models/user.model";
import CustomResponse from "../dtos/custom.response";
import * as SchemaTypes from "../types/SchemaTypes";
import jwt, {Secret} from "jsonwebtoken";
import process from "process";
import bcrypt from "bcryptjs";

export const getAllUser = async (req: express.Request, res: express.Response) => {

    try {
        let users = await UserModel.find();
        res.status(200).send(
            new CustomResponse(200, "Users are found successfully", users)
        );
    } catch (error) {
        res.status(100).send("Error")
    }
}

// create new user
export const createNewUser = async (req: express.Request, res: express.Response) => {
    console.log(req.body);
    try {
        const req_body: any = req.body;

        await bcrypt.hash(req_body.password, 8, async function (err, hash) {
            if (err) {
                res.status(100).send(
                    new CustomResponse(100, "Something went wrong.")
                )
            }
            const userModel = new UserModel({
                username: req_body.username,
                fname: req_body.fname,
                lname: req_body.lname,
                email: req_body.email,
                password: hash
            })
            let user: SchemaTypes.Iuser | null = await userModel.save();

            if (user) {
                user.password = "";
                res.status(200).send(
                    new CustomResponse(200, "User created successfully", user)
                )
            } else {
                res.status(100).send(
                    new CustomResponse(100, "Something went wrong.")
                )
            }
        })

    } catch (error) {
        res.status(100).send("Error")
    }

}

// auth
export const authUser = async (req: express.Request, res: express.Response) => {
    try {

        let request_body = req.body
        // email, password

        let user: SchemaTypes.Iuser | null = await UserModel.findOne({email: request_body.email});
        if(user) {

            let isMatch = await bcrypt.compare(request_body.password, user.password)

            if(isMatch) {

                // token gen
                user.password = "";

                const expiresIn = '1w';

                jwt.sign({user}, process.env.SECRET as Secret, {expiresIn}, (err: any, token: any) => {

                    if(err) {
                        res.status(100).send(
                            new CustomResponse(100, "Someting went wrong")
                        );
                    } else {

                        let res_body = {
                            user: user,
                            accessToken: token
                        }

                        res.status(200).send(
                            new CustomResponse(200, "Access", res_body)
                        );
                    }

                })
            } else {
                res.status(401).send(
                    new CustomResponse(401, "Invalid credentials")
                );
            }
        } else {
            res.status(404).send(
                new CustomResponse(404, "User not found")
            );
        }

    } catch (error) {
        res.status(100).send("Error");
    }
}