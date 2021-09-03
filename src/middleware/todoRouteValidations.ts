import { body, param, ValidationChain } from "express-validator";

const validateRequiredId = param("id")
  .not()
  .isEmpty()
  .withMessage('The request parameter "id" is required')
  .trim()
  .escape()
  .isAlphanumeric()
  .withMessage('The request parameter "id" is invalid')
  .isMongoId()
  .withMessage('The request parameter "id" is invalid');

const valdiateRequiredTextBody = body("textBody")
  .not()
  .isEmpty()
  .withMessage('The request body property "textBody" is required')
  .trim()
  .escape()
  .isLength({ min: 1, max: 255 })
  .withMessage(
    'The request body property "textBody" should be between 1 - 255 characters'
  );

const validateOptionalTextBody = body("textBody")
  .if(body("textBody").exists())
  .trim()
  .escape()
  .isLength({ min: 1, max: 255 })
  .withMessage(
    'The request body property "textBody" should be between 1 - 255 characters'
  );

const postValidations: ValidationChain[] = [valdiateRequiredTextBody];

const getValidations: ValidationChain[] = [validateRequiredId];

const putValidations: ValidationChain[] = [
  validateRequiredId,
  validateOptionalTextBody,
];

const deleteValidations: ValidationChain[] = [validateRequiredId];

export { postValidations, getValidations, putValidations, deleteValidations };
