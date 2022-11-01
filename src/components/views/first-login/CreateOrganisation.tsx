import { loginSetupPage } from "../../../store/General";
import { useAtom } from "jotai";
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../../../utils/trpc";
import { userAtom } from "../../../store/Auth";

type Inputs = {
  orgName: string;
};

function CreateOrganisation() {
  const createOrganisation = trpc.organisation.create.useMutation();
  const [user] = useAtom(userAtom);
  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    createOrganisation.mutate(
      {
        name: data.orgName,
        created_at: new Date(),
        user_id: user?.id as string,
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
    <>
      <div className="create">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tighter text-white xl:text-4xl">
          Create a new organisation
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3">
            <input
              {...register("orgName", {
                required: "Organisation name is required",
              })}
              placeholder="Organisation name"
              className="input input-bordered input-primary w-full max-w-xs"
            />
            <button
              className={`btn btn-primary ${
                createOrganisation.isLoading ? "loading" : ""
              } ${createOrganisation.isSuccess ? "btn-success" : ""}`}
            >
              Create
            </button>
          </div>
          {errors?.orgName?.message && (
            <p className="mt-4 text-red-500">
              {errors.orgName.message.toString()}
            </p>
          )}
        </form>
      </div>
    </>
  );
}

export default CreateOrganisation;
