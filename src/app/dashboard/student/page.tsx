import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const StudentPage = async () => {
  const { userId } = await auth();

  // Fetch exams for the logged-in student
  const exams = await prisma.exam.findMany({
    where: {
      joinedStudents: { some: { id: userId! } },
    },
  });

  // Transform exam data into calendar events
  const events = exams.map((exam) => ({
    id: exam.id,
    title: `Exam: ${exam.title}`,
    start: exam.startTime,
    end: exam.endTime,
    extendedProps: {
      roomId: exam.roomId,
      lessonId: exam.lessonId,
    },
  }));

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Exams Schedule</h1>
          {events.length > 0 ? (
            <BigCalendarContainer events={events} />
          ) : (
            <p>No exams scheduled.</p>
          )}
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
