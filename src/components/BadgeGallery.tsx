import { Badge, Classroom } from "@prisma/client";
import React, { useState } from "react";
import { api } from "~/utils/api";

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
        const badges = data.map((badge) => badge.url.toString("base64"));
        setBadges(badges);
        console.log(badges);
      },
      enabled: !!currentClass,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  return (
    <>
      <div>hi</div>
    </>
  );
};

export default BadgeGallery;
