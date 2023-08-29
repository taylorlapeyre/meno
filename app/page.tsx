import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types";
import Link from "next/link";

export default async function Index() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: courses } = await supabase.from("courses").select("*");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: applications } = user
    ? await supabase
        .from("course_applications")
        .select("*")
        .eq("user_id", user.id)
    : { data: [] };

  if (!courses) {
    return null;
  }

  const getWeekdayFromDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("en-US", { weekday: "long" });
  };

  const renderRow = (course: (typeof courses)[number]) => {
    const {
      id,
      start_date,
      end_date,
      enrollment_deadline,
      title,
      meeting_time,
    } = course;

    const formatMinute = (minute: number) => {
      if (minute < 10) {
        return `0${minute}`;
      } else {
        return `${minute}`;
      }
    };

    return (
      <li key={id} className="w-fit my-4 p-4 list-none">
        {title && <h4 className="font-bold mb-4">{title}</h4>}
        Starting {new Date(start_date).toLocaleDateString()} on {getWeekdayFromDateTime(start_date)}s @ {meeting_time}
        <div style={{ marginTop: 10, marginLeft: 16 }}>
          {course.works.map((work) => (
            <>
              <i>{work}</i>
              <br />
            </>
          ))}
        </div>
        {applications?.some((app) => app.course_id === course.id) ? (
          <p className="mt-4 text-slate-500 italic">You've applied to this course.</p>
        ) : (
          <Link
            href={`/courses/${id}`}
            className="mt-4 inline-block py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
          >
            Apply
          </Link>
        )}
      </li>
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-xl">Courses open for enrollment</h2>
      <ul className="my-auto">{courses.map(renderRow)}</ul>
    </div>
  );
}
