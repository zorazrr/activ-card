import { useEffect, useState } from "react";
import Card from "../Card";
import { type Classroom, type Set } from "@prisma/client";
import { api } from "~/utils/api";
import { Box, HStack, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import CardNew from "../CardNew";

const Sets = ({
  currentClass,
}: {
  currentClass: Classroom | undefined | null;
}) => {
  const [sets, setSets] = useState<Set[] | undefined | null>();

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
          <Link href={`/set/${set.id}`} key={set.id}>
            <Card
              key={set.name}
              name={set.name}
              description={set.description}
            />
          </Link>
        ))}
        <Link href={`/create/set/medium?classId=${currentClass!.id}`}>
          <CardNew />
        </Link>
      </HStack>
    </div>
  );
};

export default Sets;
