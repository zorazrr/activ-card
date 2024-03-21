import { Badge, Classroom } from "@prisma/client";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import { Stack } from "@chakra-ui/react";

const BadgeGallery = ({
  currentClass,
}: {
  currentClass: Classroom | undefined | null;
}) => {
  const [badges, setBadges] = useState<string[] | undefined | null>();

  const { data, isLoading, refetch } = api.badge.getBadgesByClassroom.useQuery(
    {
      classId: currentClass?.id!,
    },
    {
      onSuccess: (data) => {
        setBadges(data);
      },
      enabled: !!currentClass,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  return (
    <>
      <Stack direction="row" spacing={4}>
        {" "}
        {/* Apply grid layout */}
        {data?.map((url, index) => (
          <Image key={index} src={url} alt="Badge" width={200} height={200} />
        ))}
      </Stack>
    </>
  );
};

export default BadgeGallery;
