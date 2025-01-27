"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { lessonSchema, LessonSchema } from "@/lib/formValidationSchemas";
import { createLesson, updateLesson } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LessonForm = ({
  type,
  data,
  setOpen,
  relatedData, // Default fallback
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData: {
    subjects: { id: number; name: string }[];
    classes: { id: number; name: string }[];
    teachers: { id: string; name: string; surname: string }[];
  };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
  });

  const [state, setState] = useState<{ success: boolean; error: boolean }>({
    success: false,
    error: false,
  });

  const router = useRouter();

  const onSubmit = async (formData: LessonSchema) => {
    try {
      const response = await (type === "create"
        ? createLesson(state, formData)
        : updateLesson(formData));

      if (response.success) {
        toast(`${type === "create" ? "Created" : "Updated"} successfully!`);
        setState({ success: true, error: false });
        setOpen(false);
        router.refresh();
      } else {
        toast.error(response.message || "Something went wrong!");
        setState({ success: false, error: true });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred.");
      setState({ success: false, error: true });
    }
  };

  useEffect(() => {
    if (state.success) {
      toast(`${type === "create" ? "Created" : "Updated"} successfully!`);
      setOpen(false);
      router.refresh();
      console.log('Classes:', classes);

    }
  }, [state, router, type, setOpen]);

  
  const { subjects = [], classes = [], teachers = [] } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
    <h1 className="text-xl font-semibold">
      {type === "create" ? "Create a new course" : "Update the course"}
    </h1>

    <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:max-w-[45%]">
      <label htmlFor="name" className="text-xs text-gray-500">
        Lesson Name
      </label>
      <input
        id="name"
        type="text"
        defaultValue={data?.name}
        {...register("name")} // This automatically assigns the name attribute
        className={`ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full ${
          errors?.name ? "ring-red-400" : ""
        }`}
      />
      {errors?.name?.message && (
        <p className="text-xs text-red-400">{errors.name.message.toString()}</p>
      )}
    </div>

      <div className="flex flex-col gap-2 w-full md:max-w-[45%]">
        <label className="text-xs text-gray-500">Subject</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("subjectId")}
          defaultValue={data?.subjectId}
        >
          {subjects.map((subject) => (
            <option value={subject.id} key={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        {errors.subjectId?.message && (
          <p className="text-xs text-red-400">{errors.subjectId.message.toString()}</p>
        )}
      </div>
      
     

        {/* Start Time Field */}
        <div className="flex flex-col gap-2 w-full md:max-w-[45%]">
          <label className="text-xs text-gray-500">Start Time</label>
          <input
            type="datetime-local"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("startTime")}
            defaultValue={data?.startTime}
          />
          {errors.startTime?.message && (
            <p className="text-xs text-red-400">{errors.startTime.message.toString()}</p>
          )}
        </div>

        {/* End Time Field */}
        <div className="flex flex-col gap-2 w-full md:max-w-[45%]">
          <label className="text-xs text-gray-500">End Time</label>
          <input
            type="datetime-local"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("endTime")}
            defaultValue={data?.endTime}
          />
          {errors.endTime?.message && (
            <p className="text-xs text-red-400">{errors.endTime.message.toString()}</p>
          )}
        </div>

       {/* Class Field as a Select Component */}
       <div className="flex flex-col gap-2 w-full md:max-w-[45%]">
        <label className="text-xs text-gray-500">Class</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("classId")}
          defaultValue={data?.classId}
        >
          {classes.map((classItem) => (  // Rename `class` to `classItem`
            <option value={classItem.id} key={classItem.id}>
              {classItem.name}
            </option>
          ))}
        </select>
        {errors.classId?.message && (
          <p className="text-xs text-red-400">{errors.classId.message.toString()}</p>
        )}
      </div>


      <div className="flex flex-col gap-2 w-full md:w-2/4">
        <label className="text-xs text-gray-500">Teacher</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("teacherId")}
          defaultValue={data?.teacherId}
        >
          {teachers.map((teacher) => (
             <option value={teacher.id} key={teacher.id}>
             {teacher.name} {teacher.surname} {/* Concatenate name and surname */}
           </option>
          ))}
        </select>
        {errors.teacherId?.message && (
          <p className="text-xs text-red-400">{errors.teacherId.message.toString()}</p>
        )}
      </div>
    </div>

    {state.error && (
      <span className="text-red-500">
        {typeof state.error === "string" ? state.error : "Something went wrong!"}
      </span>
    )}

    <button className="bg-blue-400 text-white p-2 rounded-md">
      {type === "create" ? "Create" : "Update"}
    </button>
  </form>

  );
};

export default LessonForm;
