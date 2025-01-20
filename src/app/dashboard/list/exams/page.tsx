import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import JoinExamButton from "@/components/JoinExamButton";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type ExamList = Exam & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
  room: { name: string; capacity: number } | null;
  joinedStudents: { id: string }[];
};
const ExamListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const authPromise = auth(); // auth() returns a Promise<Auth>
  const { userId, sessionClaims } = await authPromise;
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  if (!currentUserId) {
    return <div>You need to be logged in to view exams.</div>;
  }

  const columns = [
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Class",
    accessor: "class",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  {
    header: "Time",
    accessor: "time",
    className: "hidden md:table-cell",
  },
  {
    header: "Room",
    accessor: "room",
  },
  {
    header: "Capacity",
    accessor: "capacity",
  },
  ...(role === "admin" || role === "teacher"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];
  // Fetch exams data
  const exams = await prisma.exam.findMany({
    include: {
      lesson: {
        select: {
          subject: { select: { name: true } },
          teacher: { select: { name: true, surname: true } },
          class: { select: { name: true } },
        },
      },
      room: { select: { name: true, capacity: true } },
      joinedStudents: true, // Include joined students to check the status
    },
    where: role === "teacher" ? { lesson: { teacherId: currentUserId! } } : {},  // Filter by teacherId if role is teacher
  });

  const getStudentJoinStatus = (examId: number) => {
    const exam = exams.find((exam) => exam.id === examId);
    if (!exam) return false;
    return exam.joinedStudents.some((student) => student.id === currentUserId);
  };

  const examsWithJoinStatus = exams.map((exam) => {
    const isJoined = getStudentJoinStatus(exam.id);
    return {
      ...exam,
      isJoined, // Add the isJoined flag to the exam data
      status: isJoined ? "Joined" : "Not Joined", // Add the status for students
      capacity: exam.room?.capacity ?? "N/A", // Add fallback for undefined capacity

    };
  });

  // RenderRow function with capacity column
  const renderRow = (item: ExamList & { isJoined: boolean; status: string }) => {
    const isFullCapacity = item.room && item.joinedStudents.length >= item.room.capacity;
  
    return (
      <tr
        key={item.id}
        className={`border-b border-gray-200 text-sm hover:bg-lamaPurpleLight ${
          item.isJoined
            ? "bg-green-100" // Green for joined exams
            : isFullCapacity
            ? "bg-orange-100" // Purple for full capacity
            : "even:bg-slate-50" // Default for others
        }`}
      >
        <td className="flex items-center gap-4 p-4">
          {item.lesson.subject.name}
          {item.isJoined && (
            <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded">
              Joined
            </span>
          )}
        </td>
        <td>{item.lesson.class.name}</td>
        <td className="hidden md:table-cell">
          {item.lesson.teacher.name + " " + item.lesson.teacher.surname}
        </td>
        <td className="hidden md:table-cell">
          {new Intl.DateTimeFormat("en-US", { dateStyle: "short" }).format(item.startTime)}
        </td>
        <td className="hidden md:table-cell">
          {`${new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
          }).format(item.startTime)} - ${new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }).format(item.endTime)}`}
        </td>
        <td>{item.room ? item.room.name : "No room assigned"}</td>
        <td>
          {item.room
            ? `${item.joinedStudents.length}/${item.room.capacity}`
            : "No room assigned"}
        </td>
        <td>
          <div className="flex items-center gap-2">
            {(role === "admin" || role === "teacher") && (
              <>
                <FormContainer table="exam" type="update" data={item} />
                <FormContainer table="exam" type="delete" id={item.id} />
              </>
            )}
            {role === "student" && currentUserId && (
              <JoinExamButton studentId={currentUserId} examId={item.id} isJoined={item.isJoined} />
            )}
          </div>
        </td>
      </tr>
    );
  };
  


  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.ExamWhereInput = {};
  query.lesson = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lesson.classId = parseInt(value);
            break;
          case "teacherId":
            query.lesson.teacherId = value;
            break;
          case "search":
              // Apply search filter to subject, class, and teacher's name
              query.OR = [
                  {
                      lesson: {
                          subject: {
                              name: { contains: value, mode: "insensitive" },
                          },
                      },
                  },
                  {
                      lesson: {
                          class: {
                              name: { contains: value, mode: "insensitive" },
                          },
                      },
                  },
                  {
                      lesson: {
                          teacher: {
                              OR: [
                                  { name: { contains: value, mode: "insensitive" } },
                                  { surname: { contains: value, mode: "insensitive" } },
                              ],
                          },
                      },
                  },
              ];
              break;
          
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.lesson.teacherId = currentUserId!;  // Ensure the teacher only sees their own exams
      break;
    case "student":
      break;
    case "parent":
      query.lesson.class = {
        students: {
          some: {
            parentId: currentUserId!,
          },
        },
      };
      break;
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
          },
        },
        room: { select: { name: true, capacity: true } },
        joinedStudents: true, // Ensure joined students are included
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        lesson: {
          teacher: {
            name: "asc", // Sort by teacher's name in ascending order
          },
        },
      },
    }),
    prisma.exam.count({ where: query }),
  ]);
  

  const tableData = role === "student" ? examsWithJoinStatus : data;
  const paginatedExamsWithJoinStatus = role === "student" ? examsWithJoinStatus.slice((p - 1) * ITEM_PER_PAGE, p * ITEM_PER_PAGE) : data;


  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button >
            {(role === "admin" || role === "teacher") && (
              <FormContainer table="exam" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={paginatedExamsWithJoinStatus} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ExamListPage;
