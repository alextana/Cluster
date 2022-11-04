import { Organisation } from "@prisma/client";
import { organisationAtom } from "../../../../store/Organisation";
import { userAtom } from "../../../../store/Auth";

import { trpc } from "../../../../utils/trpc";
import { useAtom } from "jotai";

function DisplayOrganisation() {
  const [user] = useAtom(userAtom);

  const [, setOrg] = useAtom(organisationAtom);

  const organisations = trpc.organisation.getAll.useQuery(user?.id as string, {
    enabled: !!user,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setOrg(data);
    },
  });

  if (organisations.isLoading) return <div>loading...</div>;

  return (
    <>
      <div className="organisation mt-4 mb-4">
        {organisations.data && (
          <>
            {organisations.data.map((organisation: Organisation) => (
              <div
                key={organisation.id}
                className="org flex items-center gap-1"
              >
                <div className="org-image grid h-[20px] w-[20px] place-content-center rounded-full bg-white">
                  <span className="text-xs font-bold text-black">
                    {organisation?.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-white">{organisation.name}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default DisplayOrganisation;
