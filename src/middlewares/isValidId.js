// import HttpError from "./HttpError.js";

import { isValidObjectId } from "mongoose";
import createHttpError from 'http-errors';

// export const isValidId =
//   (idName = 'id') =>
//   (req, res, next) => {
//   const id = req.params[idName];
//   if (!isValidObjectId(id)) {
//     next(createHttpError(404, "Invalid ccontact ID format!"));
//   }

//   next();
// };

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(createHttpError(404, "Invalid contact ID format!"));
  }

  next();
};

