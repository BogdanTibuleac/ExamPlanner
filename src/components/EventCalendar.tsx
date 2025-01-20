"use client"

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMPORARY
const events = [
    {
      id: 1,
      title: "Winter exam session",
      time: "09:00 AM - 2:00 PM",
      description: "Final Planning",
    },
    {
      id: 2,
      title: "Winter retakes exam session",
      time: "",
      description: "19.02.2025 - 25.02.2025",
    },
    { 
      id: 3,
      title: "Information regarding scholarships in semester I, academic year 2024-2025",
      time: "",
      description: "Complaints will be submitted at the following https://forms.office.com/e/0FikDHgjT4 between November 1, 2024, 9:00 AM - November 1, 2024, 2:00 PM",
    },
    
  ];


  const EventCalendar = () => {
    const [value, onChange] = useState<Value>(new Date());
  
    return (
      <div className="bg-white p-4 rounded-md">
        <Calendar onChange={onChange} value={value} />
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold my-4">Events</h1>
          <Image src="/moreDark.png" alt="" width={20} height={20} />
        </div>
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div
              className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
              key={event.id}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600">{event.title}</h1>
                <span className="text-gray-300 text-xs">{event.time}</span>
              </div>
              <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default EventCalendar