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

  const deleteSet = api.set.deleteSet.useMutation({
    onSuccess: (data) => {
      console.log("success"); // TODO: Replace this with a refetch
    },
  });

  const { data, isLoading } = api.set.getSetByClassroom.useQuery(
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
        {sets?.map((set) => (
          <Link href={`/set/${set.id}`} key={set.id}>
            {/* TODO FIX THIS */}
            <Card
              key={set.name}
              name={set.name}
              description={set.description}
              id={set.id}
              deleteSet={deleteSet}
            />
          </Link>
        ))}
        <Link href={`/create/set/medium?classId=${currentClass!.id}`}>
          <IconButton
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
