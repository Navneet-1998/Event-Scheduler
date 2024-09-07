import React from "react";
import "./App.css";
import { SnackbarProvider } from "notistack";
import CalendarComponent from "./components/calender";

export const config = {
  endpoint: `https://event-scheduler-backend-of0t.onrender.com/calendar`,
};

function App() {
  return (
    <SnackbarProvider>
    <div className="App">
        <CalendarComponent/>
    </div>
    </SnackbarProvider>
  );
}

export default App;
