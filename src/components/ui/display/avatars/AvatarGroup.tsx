import { User, UsersOnTasks } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

function AvatarGroup({
  users,
  size,
}: {
  users: User[] | UsersOnTasks[] | null;
  size?: string;
}) {
  const [imageSize, setImageSize] = useState<string>("40");

  useEffect(() => {
    if (size === "sm") {
      setImageSize("20");
    }
  }, [size]);

  return (
    <>
      {users && users?.length > 0 && (
        <div className="avatar-group -space-x-6">
          {users.map((user: User | UsersOnTasks) => (
            <div key={user.email} className="avatar">
              <div className={`w-[${imageSize}px]`}>
                <Image
                  src={user.image || ""}
                  alt={user.name || ""}
                  width={imageSize}
                  height={imageSize}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default AvatarGroup;
