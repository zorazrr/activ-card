import { HStack } from "@chakra-ui/react";
import SetCard from "~/components/Card";
import Sidebar from "~/components/SideBar/SideBar";
import { api } from "~/utils/api";

interface Class {
  className: string;
}

export default function TeacherDashboard() {
  const classes = [
    { className: "English" },
    { className: "Math" },
    { className: "Science" },
  ] as Class[];

  const sets = api.sets.getSets.useQuery();
  console.log(sets);

  return (
    <HStack height="100%" className="main-class min-h-screen">
      <Sidebar classes={classes} />
      <SetCard
        setName="Spelling Unit 1"
        imageSrc="https://gizmodo.com.au/wp-content/uploads/2023/01/25/google-reverse-image-search.png?quality=75"
        className="English 7th Hour"
      />
    </HStack>
  );
}
