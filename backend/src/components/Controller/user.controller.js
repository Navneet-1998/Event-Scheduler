const { Event } = require("../Model/user.model");
const httpStatus = require("http-status");

const createEvent = async (req, res) => {
    try {
        const user = await Event.create(req.body);
        console.log(user);

        return res.status(httpStatus.CREATED).json({
            success: true,
            name: user.name,
            date: user.date,
            event: user.event,
            startingTime: user.startingTime,
            endingTime: user.endingTime
        });
    } catch (error) {
        console.error('Error creating event:', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

const allEvent = async (req, res) => {
    try {
        const events = await Event.find();

        return res.status(httpStatus.OK).json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        
        const result = await Event.deleteOne({ _id: id });
    
        if (result.deletedCount === 1) {
            console.log("Successfully deleted one event.");
            return res.status(httpStatus.OK).json({ message: "Event deleted successfully." });
        } else {
            console.log("No event matched the query. Deleted 0 event.");
            return res.status(httpStatus.NOT_FOUND).json({ error: "Event not found." });
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        console.log(updates, id, req.body, req.params)

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            {
                $set: {
                    name: updates.name,
                    event: updates.event,
                    date: updates.date,
                    startingTime: updates.startingTime,
                    endingTime: updates.endingTime,
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedEvent) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "Event not found" });
        }

        return res.status(httpStatus.OK).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};

module.exports = { createEvent, allEvent, updateEvent, deleteEvent };
