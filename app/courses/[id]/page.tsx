import { Database } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import ApplicationForm from "@/components/CourseApplicationForm";
import Link from "next/link";

export default async function Course({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: course } = await supabase.from('courses').select('*').eq('id', params.id).single();

  const { data: existingApplication } = user ? await supabase.from('course_applications')
    .select('*')
    .eq('course_id', params.id)
    .eq('user_id', user.id)
    .single() : { data: null };

  // redirect with next
  if (!course) {
    return redirect("/courses");
  }

  const { id, works } = course;

  return (
    <main>
      <div style={{ marginBottom: 24 }}>
      <Link href="/">
        ← Back to courses
      </Link>
      </div>

      {works.map((work) => (
        <>
          <b>{work}</b>
          <br />
        </>
      ))}

      {existingApplication ? (
        <p style={{ marginTop: 40 }}>Thank you for applying!</p>
      ) : user ? (
        <ApplicationForm groupId={id} user={user} />
      ) : <p>Please <Link href="/login">Log in</Link> to apply</p>}

    </main>
  );
}
