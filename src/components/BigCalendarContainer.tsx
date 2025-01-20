import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalendar";

const BigCalendarContainer = async ({
  type,
  id,
  events,
}: {
  type?: "teacherId" | "classId"; // Made type optional
  id?: string | number; // Made id optional
  events?: {
    id: number;
    title: string;
    start: Date;
    end: Date;
    extendedProps: Record<string, any>;
  }[]; // Added events prop
}) => {
  // If events are provided, skip fetching from the database
  if (events) {
    return (
      <div className="h-full">
        <BigCalendar events={events} />
      </div>
    );
  }

  // Otherwise, fetch data based on type and id
  const dataRes = await prisma.exam.findMany({
    where: {
      ...(type === "teacherId"
        ? { lesson: { teacherId: id as string } }
        : { lesson: { classId: id as number } }),
    },
  });

  const fetchedEvents = dataRes.map((exam) => ({
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
    <div className="h-full">
      <BigCalendar events={fetchedEvents} />
    </div>
  );
};

export default BigCalendarContainer;
