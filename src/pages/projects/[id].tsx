import { useRouter } from "next/router";
import { useState } from "react";
import Button from "../../components/ui/forms/button/Button";
import ProjectView from "../../components/views/project/ProjectView";
import TextInput from "../../components/ui/forms/text-input/TextInput";
import { trpc } from "../../utils/trpc";

function Project() {
  const router = useRouter();
  const { id } = router.query;
  const utils = trpc.useContext();

  const [milestoneTitle, setMilestoneTitle] = useState<string>("");

  const project = trpc.project.getById.useQuery({
    id: id as string,
    getMilestones: true,
  });

  const createMilestone = trpc.milestone.create.useMutation();

  const handleCreateMilestone = async () => {
    if (!milestoneTitle) return;

    const milestone = {
      name: milestoneTitle,
      status: "waiting",
      description: "",
      created_at: new Date(),
      projectId: id as string,
    };

    createMilestone.mutate(milestone, {
      onSuccess: () => {
        utils.project.getById.invalidate();
      },
    });
  };

  // TODO - proper loading
  if (project.isLoading) return <div>loading...</div>;

  if (project.data)
    return (
      <div className="project-intro w-full">
        {project.data.milestones && project?.data?.milestones?.length > 0 ? (
          <ProjectView project={project.data.project} />
        ) : (
          <div>
            <h2 className="text-2xl font-bold">
              Create your first milestone...
            </h2>

            <TextInput
              label="Title"
              placeHolder="My first milestone"
              handleChange={(e) => setMilestoneTitle(e.target.value)}
            />

            <Button
              handleClick={handleCreateMilestone}
              extraClass="btn-primary"
            >
              Create milestone
            </Button>
          </div>
        )}
      </div>
    );

  return <div>there was an error..</div>;
}

export default Project;
