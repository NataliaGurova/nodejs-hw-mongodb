// import HttpError from "./HttpError.js";

import { isValidObjectId } from "mongoose";
import createHttpError from 'http-errors';


export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(createHttpError(404, "Invalid contact ID format!"));
  }

  next();
};