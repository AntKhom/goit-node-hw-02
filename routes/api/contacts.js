const express = require('express');
const Joi = require('joi');

const router = express.Router();

const contacts = require("../../models/contacts");

// const { HttpError } = require("../../helpers");

const addScheme = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);
    if (!result) {
      // throw HttpError(404, "Not Found");
      res.status(404).json({"message": "Not found"});
    }
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
})

router.post('/', async (req, res, next) => { 
  try {
    console.log(req.body);
    const { error } = addScheme.validate(req.body);
    if (error) {
      // throw HttpError(400, "missing required name field");
      res.status(400).json({"message": "missing required name field"});
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch(error) {
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
try {
  const { contactId } = req.params;
  console.log(contactId);
  const result = await contacts.removeContact(contactId);
  if (!result) {
    // throw HttpError(404, "Not Found");
    res.status(404).json({"message": "Not found"});
  }
    res.status(200).json({"message": "contact deleted"});
  }  catch (err) {
    next(err);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    console.log(req.body);
    const { error } = addScheme.validate(req.body);
    if (error) {
      // throw HttpError(400, "missing required name field");
      res.status(400).json({"message": "missing required name field"});
    }
    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      // throw HttpError(404, "Not Found");
      res.status(404).json({"message": "Not Found"});
    }
    res.json(result);
  } catch(error) {
    next(error);
  }
})

module.exports = router
