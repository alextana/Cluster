import { User } from "@prisma/client";
import Image from "next/image";

function AvatarGroup({ users }: { users: User[] | null }) {
  return (
    <>
      {users && users?.length > 0 && (
        <div className="avatar-group -space-x-6">
          {users.map((user: User) => (
            <div key={user.id} className="avatar">
              <div className="w-8">
                <Image
                  src={user.image || ""}
                  alt={user.name || ""}
                  width="40px"
                  height="40px"
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
