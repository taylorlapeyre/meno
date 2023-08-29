"use client";

import { Database } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface Application {
  statement_of_interest: string;
  course_id: number;
}

export default function ApplicationForm({
  groupId,
  user,
}: {
  groupId: number;
  user: User;
}) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleSendApplication = async (application: Application) => {
    if (!user) {
      return;
    }

    const { data, error } = await supabase
      .from('course_applications')
      .upsert([
        { ...application, user_id: user.id },
      ]);
    if (error) {
      console.log(error);
    } else {
      router.refresh();
    }
  };

  const [application, setApplication] = useState({
    statement_of_interest: "",
    course_id: groupId,
  });

  return (
    <div style={{ marginTop: 40 }}>
      <h3>Apply for this group</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendApplication(application);
        }}
      >
        <p>Applying as {user.email}</p>

        <div
          style={{ margin: "12px 0", display: "flex", flexDirection: "column" }}
        >
          <label htmlFor="statement_of_interest">Statement of interest</label>
          <textarea
            name="statement_of_interest"
            id="statement_of_interest"
            style={{ height: 200, fontSize: 16 }}
            onChange={(e) =>
              setApplication({
                ...application,
                statement_of_interest: e.target.value,
              })
            }
            value={application.statement_of_interest}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
