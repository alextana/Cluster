import { Project } from "@prisma/client";
import Link from "next/link";

function AllProjects({ projects }: { projects: Project[] }) {
  return (
    <div>
      <h1 className="mb-8 text-4xl">Projects</h1>
      <div className="project-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects?.map((project: Project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <div className="card w-full cursor-pointer bg-base-100 shadow-xl hover:bg-base-200">
              <div className="card-body">
                <h2 className="card-title">{project.name}</h2>
                {project.description && <p>{project.description}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllProjects;
