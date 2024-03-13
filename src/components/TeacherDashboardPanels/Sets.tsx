import { useEffect, useState } from "react";
import Card from "../Card";
import { type Classroom, type Set } from "@prisma/client";
import { api } from "~/utils/api";
import { Box, HStack, Icon, IconButton, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import CardNew from "../CardNew";
import { AddIcon } from "@chakra-ui/icons";

const Sets = ({
  currentClass,
}: {
  currentClass: Classroom | undefined | null;
}) => {
  const [sets, setSets] = useState<Set[] | undefined | null>();

  const { data, isLoading, refetch } = api.set.getSetByClassroom.useQuery(
    {
      classId: currentClass?.id!,
    },
    {
      onSuccess: (data) => setSets(data),
      enabled: !!currentClass,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  const deleteSet = api.set.deleteSet.useMutation({
    onSuccess: (data) => {
      refetch();
    },
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Spinner size={"xl"} />
      </div>
    );
  }

  return (
    <div>
      <HStack wrap="wrap">
        {sets?.map((set) => {
          console.log(sets);
          return (
            <Card
              key={set.id}
              name={set.name}
              description={set.description}
              id={set.id}
              numCards={set.cards ? set.cards?.length : 0}
              deleteSet={deleteSet}
            />
          );
        })}
        <Link href={`/create/set/medium?classId=${currentClass!.id}`}>
          <IconButton
            mt={5}
            borderRadius={20}
            variant="outline"
            aria-label="Add card"
            fontSize="5vh"
            bg={"gray.200"}
            icon={<AddIcon color="blue.900" />}
            _hover={{ bg: "gray.300", borderColor: "gray.300" }}
            p={20}
          />
        </Link>
      </HStack>
    </div>
  );
};

export default Sets;
