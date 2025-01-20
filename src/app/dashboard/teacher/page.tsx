import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const TeacherPage = async () => {
  const { userId } = await auth();

  // Fetch all exams for the teacher from the database
  const exams = await prisma.exam.findMany({
    where: {
      lesson: {
        teacherId: userId!,  // Use teacher's userId to get the exams
      },
    },
  });

  // Transform exam data into the correct format for the calendar
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
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule</h1>
          {/* Pass events to the BigCalendarContainer */}
          <BigCalendarContainer events={events} />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;
