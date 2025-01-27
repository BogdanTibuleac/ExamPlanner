import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()), //teacher ids
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
  specializationId: z.coerce.number().min(1, { message: "Specialization name is required!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;
export const teacherSchema = z.object({
  id: z.string().optional(),
  
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),

  name: z
    .string()
    .min(1, { message: "First name is required!" }),

  surname: z
    .string()
    .min(1, { message: "Last name is required!" }),

  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .optional(),

  faculty: z
    .string()
    .min(1, { message: "Faculty is required!" }),

  specialization: z
    .string()
    .min(1, { message: "Specialization is required!" }),

  img: z
    .string()
    .optional(),

  bloodType: z
    .string()
    .min(1, { message: "Blood Type is required!" }),

  birthday: z
    .coerce.date({ message: "Birthday is required!" }),

  sex: z
    .enum(["MALE", "FEMALE"], { message: "Sex is required!" }),

  subjects: z
    .array(z.string())
    .optional(), // Array of subject IDs
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .or(z.literal("")),
  phone: z.string(),
  faculty: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  specializationId: z.coerce.number().min(1, { message: "Specialization is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  parentId: z.string().optional(),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Course is required!" }),
  roomId: z.coerce.number().min(1, { message: "Class is required!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const lessonSchema = z
  .object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: "Lesson name is required!" }),
    day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], {
      message: "Day is required!",
    }).optional(),
    startTime: z.coerce.date({ message: "Start time is required!" }),
    endTime: z.coerce.date({ message: "End time is required!" }),
    subjectId: z.coerce.number().min(1, { message: "Subject ID is required!" }),
    classId: z.coerce.number().min(1, { message: "Class ID is required!" }),
    teacherId: z.string().min(1, { message: "Teacher ID is required!" }),
  })
  .refine(
    (data) => new Date(data.startTime) < new Date(data.endTime),
    {
      message: "Start time must be earlier than end time!",
      path: ["endTime"], // Error will be associated with the `endTime` field
    }
  );

export type LessonSchema = z.infer<typeof lessonSchema>;
