import { Database } from "@/types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect, useParams, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewCourse({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const addCourse = async (formData: FormData) => {
    "use server";
    const title = formData.get("title");
    const works = formData.get("works");
    const isTutorial = formData.get("isTutorial");
    const startDate = formData.get("startDate");
    const endDate = formData.get("endDate");
    const numberOfSlots = formData.get("numberOfSlots");
    const meetingTime = formData.get("meetingTime");
    const enrollmentDeadline = formData.get("enrollmentDeadline");

    const data = {
      title,
      works: [works],
      is_tutorial: isTutorial,
      start_date: startDate,
      end_date: endDate,
      number_of_slots: numberOfSlots,
      meeting_time: meetingTime,
      enrollment_deadline: enrollmentDeadline,
    };

    const supabase = createServerActionClient({ cookies });
    const { error } = await supabase.from("courses").insert(data);

    if (error) {
      redirect(`/courses/new?error=${error.message}`);
    } else {
      revalidatePath("/");
      redirect("/");
    }
  };

  return (
    <form action={addCourse}>
      <label className="block mb-4">
        Title:
        <input className="border border-slate-500 rounded block" name="title" />
      </label>
      <label className="block mb-4">
        Works:
        <input className="border border-slate-500 rounded block" name="works" type="" />
      </label>
      <label className="block mb-4">
        Is Tutorial:
        <input
          className="border border-slate-500 rounded block"
          name="isTutorial"
        />
      </label>
      <label className="block mb-4">
        Number of Slots:
        <input
          className="border border-slate-500 rounded block"
          name="numberOfSlots"
          type="number"
        />
      </label>
      <label className="block mb-4">
        Start Date:
        <input
          className="border border-slate-500 rounded block"
          name="startDate"
          type="date"
        />
      </label>
      <label className="block mb-4">
        End Date:
        <input
          className="border border-slate-500 rounded block"
          name="endDate"
          type="date"
        />
      </label>
      <label className="block mb-4">
        Meeting Time:
        <input
          className="border border-slate-500 rounded block"
          name="meetingTime"
          type="time"
        />
      </label>
      <label className="block mb-4">
        Enrollment Deadline:
        <input
          className="border border-slate-500 rounded block"
          name="enrollmentDeadline"
          type="date"
        />
      </label>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded"
        type="submit"
      >
        Submit
      </button>
      {searchParams["error"] && (
        <p className="text-red-500">{searchParams["error"]}</p>
      )}
    </form>
  );
}
