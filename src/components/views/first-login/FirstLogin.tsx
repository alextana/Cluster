import { User, UsersOnOrganisations } from "@prisma/client";
import CreateOrganisation from "./CreateOrganisation";
import JoinOrganisation from "./JoinOrganisation";
import { loginSetupPage } from "../../../store/General";
import { useAtom } from "jotai";
import CreateTeam from "./CreateTeam";

type UserOrg = User & {
  UsersOnOrganisations: UsersOnOrganisations[];
};

function FirstLogin({ user }: { user: UserOrg }) {
  const [selectedSetupPage, setSelectedSetupPage] = useAtom(loginSetupPage);

  // check where the user is at
  // if there's an org with the user
  // then a team needs to be created

  return (
    <div className="grid h-screen w-screen place-content-center">
      <div className="card-middle grid min-h-[50vh] min-w-[50vw] place-content-center rounded-2xl p-6 text-center">
        {user?.UsersOnOrganisations?.length ? (
          <CreateTeam user={user} />
        ) : (
          <>
            {selectedSetupPage === "create-org" && <CreateOrganisation />}

            {selectedSetupPage === "join-org" && <JoinOrganisation />}

            {!selectedSetupPage && (
              <div>
                <h1 className="mb-8 text-4xl font-extrabold tracking-tighter text-white xl:text-4xl">
                  <span className="font-light ">Welcome to Cluster, </span>{" "}
                  {user?.name}
                </h1>
                <button
                  onClick={() => setSelectedSetupPage("create-org")}
                  className="btn btn-primary mx-auto w-max"
                >
                  Create an organisation
                </button>

                <div className="divider">OR</div>
                <button
                  onClick={() => setSelectedSetupPage("join-org")}
                  className="btn btn-ghost mx-auto w-max"
                >
                  Join an existing organisation
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FirstLogin;
