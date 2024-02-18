import { useEffect, useState } from "react";
import Card from "../Card";
import { type Classroom, type Set } from "@prisma/client";
import { api } from "~/utils/api";
import { Box, HStack, Spinner } from "@chakra-ui/react";

const Sets = ({ currentClass }: { currentClass: Classroom | undefined }) => {
  const [sets, setSets] = useState<Set[] | undefined>();
  if (currentClass) {
    console.log("okkkkkkkk");
    console.log(currentClass.id);
  }

  const { data } = api.set.getSetByClassroom.useQuery(
    {
      classId: currentClass?.id,
    },
    {
      onSuccess: (data) => setSets(data),
      enabled: !!currentClass,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  if (!sets) {
    return <Spinner />; // or any other fallback content
  }

  return (
    <div>
      <HStack wrap="wrap">
        {sets?.map((set) => (
          <Card key={set.name} name={set.name} description={set.description} />
        ))}
      </HStack>
    </div>
  );
};

export default Sets;
