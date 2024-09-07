import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { config } from "../App";

function CalendarComponent() {
    const { enqueueSnackbar } = useSnackbar();

    const initialUserState = {
        name: '',
        date: '',
        event: '',
        startingTime: '',
        endingTime: ''
    };

    const [data, setData] = useState(initialUserState);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [submit, setSubmit] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editedId, setEditedId] = useState(undefined);
    const today = new Date().toISOString().split('T')[0];

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${config.endpoint}/events`);
            if (response.status === 200) {
                setEvents(response.data.data);
                console.log('Fetched Events:', response.data.data);
            }
        } catch (error) {
            enqueueSnackbar('Failed to fetch events.', { variant: 'error' });
        }
    };

    const dataUpload = async () => {
        if(validateInput()){
            try {
                const response = await axios.post(`${config.endpoint}/new_event`, data);
                if (response.status === 200) {
                    enqueueSnackbar('Data submitted successfully!', { variant: 'success' });
                    fetchEvents(); 
                }
            } catch (error) {
                enqueueSnackbar('Failed to submit data.', { variant: 'error' });
            } 
            setData(initialUserState);
            setSubmit(!submit)
        }
    };

    const handleConflicts = () => {
        if (events.length > 0) {
            const conflict = events.some(
                (event) => event.date === data.date && (
                    (data.startingTime >= event.startingTime && data.startingTime < event.endingTime) ||
                    (data.endingTime > event.startingTime && data.endingTime <= event.endingTime) ||
                    (data.startingTime <= event.startingTime && data.endingTime >= event.endingTime)
                )
            );
            if (conflict) {
                enqueueSnackbar('Conflict detected with another event!', { variant: 'warning' });
                return true;
            }
        }
        return false;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setData((prevState) => ({
            ...prevState,
            date: date.toLocaleDateString()
        }));
    };

    const handleEdit = (event) => {
        setEdit(true);
        setEditedId(event);
        setData({
            name: event.name,
            event: event.event,
            date: event.date,
            startingTime: event.startingTime,
            endingTime: event.endingTime
        });
    };

    const handleUpdateData = async (item) => {
        if(!handleConflicts()){
            try {
                const formData = {
                    name: data.name || item.name,
                    event: data.event || item.event,
                    date: data.date || item.date,
                    startingTime: data.startingTime || item.startingTime,
                    endingTime: data.endingTime || item.endingTime,
                };
        
                // Removed the unnecessary `multipart/form-data` header
                const response = await axios.put(`${config.endpoint}/update_event/${item._id}`, formData);
        
                if (response.status === 200) {
                    enqueueSnackbar('Data updated successfully!', { variant: 'success' });
                    setEdit(false);
                    setData(initialUserState); // Reset form data
                    setSubmit(!submit); // Trigger update
                }
            } catch (error) {
                enqueueSnackbar('Failed to update data.', { variant: 'error' });
            }
        }
    
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${config.endpoint}/delete_event/${id}`);
            if (response.status === 200) {
                enqueueSnackbar(response.data.message, { variant: 'success' });
                setSubmit(!submit)
            }
        } catch (error) {
            enqueueSnackbar('Failed to delete event.', { variant: 'error' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!handleConflicts()) {
            dataUpload();
        }    
    }
        
        const validateInput = () => {
            if (data.name === "") {
              enqueueSnackbar("name is a required field", { variant: "warning" });
              return false;
            } else if (data.name.length < 3) {
              enqueueSnackbar("name must be at least 3 characters", {
                variant: "warning",
              });
              return false;
            } else if (data.event === "") {
              enqueueSnackbar("event is a required field", { variant: "warning" });
              return false;
            } else if (data.event.length < 6) {
              enqueueSnackbar("event must be at least 6 characters", {
                variant: "warning",
              });
              return false;
            }else if(data.date.length === 0 ){
              enqueueSnackbar("Date is not selected", {
                variant: "warning",
              });
              return false;
            }else if(data.startingTime.length === 0 || data.endingTime.length === 0 ){
                enqueueSnackbar("Please filled the timing", {
                  variant: "warning",
                });
                return false;
            }
            return true
    };






    useEffect(() => {
        fetchEvents(); 
    },[submit]);

    return (
        <>
        <h1 className='container d-flex justify-content-center mt-5' style={{color: "white"}}>Event Scheduler</h1>
        <div className='container d-flex justify-content-center'>
        <div className='d-flex justify-content-center my-5' style={{background: "#282c34", width:"35%" }}>
                <Calendar onChange={handleDateChange} value={selectedDate} minDate={new Date()} />
            </div>

            <div className='d-flex justify-content-center my-5 flex-column w-50 '>
                <h2 style={{ color: "white", margin: "20px 0px", width:"110%" }} className='text-center'>Schedule Your Events</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3 d-flex justify-content-center'>
                        <label className='form-label mx-3 align-self-center' style={{ color: 'white' }}>Name</label>
                        <input
                            type='text'
                            name='name'
                            className='form-control w-50'
                            value={data.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='mb-3 d-flex justify-content-center'>
                        <label className='form-label mx-3 align-self-center' style={{ color: 'white' }}>Event</label>
                        <input
                            type='text'
                            name='event'
                            className='form-control w-50'
                            value={data.event}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='mb-3 d-flex justify-content-center'>
                        <label className='form-label mx-3 align-self-center' style={{ color: 'white' }}>Timing</label>
                        <input
                            type='time'
                            name='startingTime'
                            className='form-control w-25 mx-1'
                            value={data.startingTime}
                            onChange={handleInputChange}
                        />
                        <input
                            type='time'
                            name='endingTime'
                            className='form-control w-25'
                            value={data.endingTime}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type='submit' className='btn btn-primary'>
                        Submit
                    </button>
                </form>
</div>
        </div>
            
              <div className='d-flex justify-content-center flex-column'>
              <h2 style={{ marginTop: "50px", color: "white" }}>All Events</h2>
                <table style={{ backgroundColor: "white", width: "70%" }} className='align-self-center my-2'>
                    <thead>
                        <tr>
                            <th>SNO</th>
                            <th>Name</th>
                            <th>Event</th>
                            <th>Date</th>
                            <th>Starts(24 hr)</th>
                            <th>Ends(24 hr)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length > 0  && events.map((item, index) => (
                            <tr key={index}>
                                {edit && editedId === item._id ? (
                                    <>
                                        <td>{index + 1}</td>
                                        <td>
                                            <input
                                                type='text'
                                                name='name'
                                                style={{ width: "100%" }}
                                                value={data.name}
                                                onChange={handleInputChange}
                                                placeholder={item.name}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='text'
                                                name='event'
                                                style={{ width: "100%" }}
                                                value={data.event}
                                                placeholder={item.event}
                                                onChange={handleInputChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='date'
                                                name='date'
                                                style={{ width: "100%" }}
                                                value={data.date}
                                                placeholder={item.date}
                                                min={today}
                                                onChange={handleInputChange}

                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='time'
                                                name='startingTime'
                                                style={{ width: "100%" }}
                                                value={data.startingTime}
                                                onChange={handleInputChange}
                                                placeholder={item.startingTime}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type='time'
                                                name='endingTime'
                                                style={{ width: "100%" }}
                                                value={data.endingTime}
                                                onChange={handleInputChange}
                                                placeholder={item.endingTime}
                                            />
                                        </td>
                                        <td className='flex-column'>
                                            <button className='btn btn-primary btn-sm mx-1' onClick={() => handleUpdateData(item)}>Ok</button>
                                            <button className='btn btn-primary btn-sm mx-1' onClick={() => setEdit(false)}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.event}</td>
                                        <td>{item.date}</td>
                                        <td>{item.startingTime}</td>
                                        <td>{item.endingTime}</td>
                                        <td className='flex-column'>
                                            <button className='btn btn-primary btn-sm mx-1' onClick={() => handleEdit(item._id)}>Edit</button>
                                            <button className='btn btn-primary btn-sm mx-1' onClick={() => handleDelete(item._id)}>Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
        </>
    );
}
export default CalendarComponent;

