import { HStack } from "@chakra-ui/react";
import { Set } from "@prisma/client";
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

  const { data: sets } = api.sets.getAllSets.useQuery({ classId: "65d104e87c97cf68389b7e90" });
  console.log(sets);

  return (
    <HStack height="100%" className="main-class min-h-screen">
      <Sidebar classes={classes} />
      {sets?.map((set: Set) => (
        <SetCard
          key={set.id}
          setName={set.name}
          imageSrc="https://gizmodo.com.au/wp-content/uploads/2023/01/25/google-reverse-image-search.png?quality=75"
          className="English 7th Hour"
        />
      ))}
    </HStack>
  );
}
