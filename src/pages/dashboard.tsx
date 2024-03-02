import {
  HStack,
  Box,
  Heading,
  Text,
  Flex,
  IconButton,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DashboardTabs from "~/components/DashboardTabs";
import Sidebar from "~/components/SideBar/SideBar";
import { api } from "~/utils/api";
import { Role, type Classroom } from "@prisma/client";
import { useSession } from "next-auth/react";
import ProtectedPage from "~/components/ProtectedPage";
import { AddIcon } from "@chakra-ui/icons";
import AddClassModal from "~/components/AddClassModal";
import { useRouter } from "next/router";

export default function TeacherDashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [currentClass, setCurrentClass] = useState<Classroom | null>(null);
  const teacherId = session?.user?.id;
  const router = useRouter();

  const { data, isLoading } = api.teacher.getTeacherAndClassrooms.useQuery(
    {
      teacherId: teacherId!,
    },
    {
      onSuccess: (res) => {
        if (res) {
          setClassrooms(res.classroom as Classroom[]);
          if (router.query.class) {
            res.classroom.forEach((item: Classroom, index: number) => {
              if (item.id == router.query.class) {
                setCurrentClass(res.classroom[index]);
              }
            });
          } else {
            setCurrentClass(res.classroom[0]);
          }
        }
      },
      enabled: !!teacherId,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  const onAddClass = () => {
    onOpen();
  };

  const handleClose = () => {
    onClose();
    // redirect to new page
  };

  const addClassroom = api.classroom.addClassroomForTeacher.useMutation();

  return (
    <ProtectedPage requiredRole={Role.TEACHER}>
      <HStack height="100%" className="main-class min-h-screen">
        <Sidebar
          classes={classrooms}
          currentClass={currentClass}
          setCurrentClass={setCurrentClass}
          onAddClass={onAddClass}
          isLoading={isLoading}
        />
        {isLoading ? (
          <div
            style={{
              margin: "auto",
            }}
          >
            <Spinner />
          </div>
        ) : classrooms.length ? (
          <>
            {" "}
            <Box
              w="full"
              h="100%"
              pt={16}
              pl={10}
              style={{ overflowY: "scroll" }}
            >
              <Text className="h3 leading-9 text-darkBlue">Welcome to</Text>
              <Text className="h3 text-mediumBlue">{currentClass?.name}</Text>
              <DashboardTabs currentClass={currentClass} />
            </Box>
          </>
        ) : (
          <Flex
            w="full"
            h="100%"
            direction="column"
            align="center"
            justify="center"
            style={{ overflowY: "scroll" }}
            gap={8} // Adjust the value as needed for your design
          >
            <IconButton
              borderRadius={20}
              variant="outline"
              aria-label="Add card"
              fontSize="5vh"
              bg={"gray.200"}
              icon={<AddIcon color="blue.900" />}
              _hover={{ bg: "gray.300", borderColor: "gray.300" }}
              p={20}
              onClick={onAddClass}
            />
            <Text className="h3 leading-9 text-darkBlue" textAlign="center">
              Add Class To Get Started
            </Text>
          </Flex>
        )}
        <AddClassModal
          isOpen={isOpen}
          onClose={handleClose}
          addClassAPI={addClassroom}
          teacherId={session?.user.id}
        />
      </HStack>
    </ProtectedPage>
  );
}
