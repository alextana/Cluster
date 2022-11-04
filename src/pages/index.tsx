import { useState } from "react";
import { trpc } from "../utils/trpc";
import AllProjects from "../components/lists/projects/AllProjects";
import Loading from "../components/ui/loading/Loading";
import { userAtom } from "../store/Auth";
import { useAtom } from "jotai";

function Homepage() {
  const [projectTitle, setProjectTitle] = useState<string>("");
  const allProjects = trpc.project.getAll.useQuery();
  const utils = trpc.useContext();

  const [user] = useAtom(userAtom);

  const createProject = trpc.project.create.useMutation();

  const handleCreateProject = async () => {
    if (!projectTitle) return;

    const project = {
      name: projectTitle,
      status: "waiting",
      description: "",
      created_at: new Date(),
    };

    createProject.mutate(project, {
      onSuccess: () => {
        utils.project.getAll.invalidate();
      },
    });
  };

  // if 0 projects then show a create project screen

  // otherwise show projects and other stuff

  // check if you have any projects / goals

  if (allProjects.isLoading) return <Loading />;

  if (allProjects?.data && allProjects?.data?.length === 0)
    return (
      <div>
        <h1 className="mb-4 text-4xl">Create a project</h1>

        <input
          type="text"
          defaultValue=""
          onChange={(e) => setProjectTitle(e.target.value)}
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
        />

        <button onClick={handleCreateProject} className="btn btn-primary mt-4">
          Button
        </button>
      </div>
    );

  return <AllProjects projects={allProjects.data} />;
}

export default Homepage;
