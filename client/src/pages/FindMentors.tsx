import { Helmet } from "react-helmet";
import MentorSearch from "@/components/mentors/MentorSearch";

export default function FindMentors() {
  return (
    <div>
      <Helmet>
        <title>Find Mentors | MentorConnect</title>
      </Helmet>
      <MentorSearch />
    </div>
  );
}
