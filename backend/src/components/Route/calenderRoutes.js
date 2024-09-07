const express = require("express");
const router = express.Router();
const userController = require("../Controller/user.controller.js");

// Route to create a new event
router.post(
    "/new_event",
    userController.createEvent
);

// Route to get all events
router.get(
    "/events",
    userController.allEvent
);

// Route to delete an event by ID
router.delete(
    "/delete_event/:id",
    userController.deleteEvent
);

// Route to update an event by ID
router.put(
    "/update_event/:id",
    userController.updateEvent
);

module.exports = router;

// Example JSON data for user creation
/*
{
    "first_name": "Navneet",
    "last_name": "Dass",
    "email": "navneet@gmail.com",
    "password": "navneet1234",
    "repeat_password": "navneet1234"
}
*/


// //{
//     "frist_name" : "navneet",
//     "last_name" : "dass",
//     "email" : "navneet@gmail.com",
//     "password" : "navneet1234",
//      "repeat_passward" : "navneet1234"
//   }