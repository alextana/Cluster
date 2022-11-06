import { User, UsersOnOrganisations } from "@prisma/client";
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../../../utils/trpc";

type Inputs = {
  teamName: string;
};

type UserOrg = User & {
  UsersOnOrganisations: UsersOnOrganisations[];
};

function CreateTeam({ user }: { user: UserOrg }) {
  const createTeam = trpc.team.createFirst.useMutation();
  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    createTeam.mutate(
      {
        name: data.teamName,
        user_id: user?.id,
        created_at: new Date(),
        organisation_id: user?.UsersOnOrganisations[0]
          ?.organisationId as string,
      },
      {
        onSuccess: () => {
          // update user and set first_login to false
          // as the org has been established
          // and send an email ? TODO
          utils.user.getById.invalidate();
        },
      }
    );
  };

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tighter">
        Create a team
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-3">
          <input
            {...register("teamName", {
              required: "Team name is required",
            })}
            placeholder="Team name"
            className="input input-bordered input-primary w-full max-w-xs"
          />
          <button
            className={`btn btn-primary ${
              createTeam.isLoading ? "loading" : ""
            } ${createTeam.isSuccess ? "btn-success" : ""}`}
          >
            Create
          </button>
        </div>
        {errors?.teamName?.message && (
          <p className="mt-4 text-red-500">
            {errors.teamName.message.toString()}
          </p>
        )}
      </form>
    </div>
  );
}

export default CreateTeam;
