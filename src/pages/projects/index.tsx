import AllProjects from "../../components/lists/projects/AllProjects";
import Loading from "../../components/ui/loading/Loading";
import { trpc } from "../../utils/trpc";

function Projects() {
  const allProjects = trpc.project.getAll.useQuery();

  if (allProjects.isLoading) return <Loading />;

  if (!allProjects.data) return <div>no projects..</div>;

  return <AllProjects projects={allProjects.data} />;
}

export default Projects;
