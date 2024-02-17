import { HStack } from "@chakra-ui/react";
import { Classroom, Set } from "@prisma/client";
import Link from "next/link";
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

  // API Proof of Concepts
  const { data: sets } = api.set.getAllSets.useQuery({
    classId: "65d12457cdde4a764731c380",
  });
  console.log(sets);

  // const { data: student } = api.student.getStudentInfo.useQuery({
  //   studentId: "65d12546cdde4a764731c381",
  // });
  // console.log(student);
  // NOTE: Will keep this here until student dashboard is created

  const { data: teacherInfo } =
    api.teacher.getTeacherAndClassrooms.useQuery({
      teacherId: "65d1242ccdde4a764731c37f",
    });
    
  const classRes: Class[] = teacherInfo?.classroom.map((x: Classroom) => {
    return { className: x?.name };
  });

  if (!teacherInfo) {
    return <div>Loading</div>;
  }

  return (
    <HStack height="100%" className="main-class min-h-screen">
      <Sidebar classes={classRes} />
      {sets?.map((set: Set) => (
        <Link key={set.id} href={`set/${set.id}`}>
          <SetCard
            setName={set.name}
            imageSrc="https://gizmodo.com.au/wp-content/uploads/2023/01/25/google-reverse-image-search.png?quality=75"
            className="English 7th Hour"
          />
        </Link>
      ))}
    </HStack>
  );
}
