import { Project } from "@prisma/client";
import Link from "next/link";

function AllProjects({ projects }: { projects: Project[] | undefined }) {
  return (
    <div>
      <div className="title-bar flex justify-between">
        <h1 className="mb-8 text-2xl font-bold tracking-tighter text-white">
          Projects
        </h1>
        <div className="ml-auto">
          <button className="btn btn-primary btn-sm text-xs font-extrabold uppercase">
            New project +
          </button>
        </div>
      </div>
      <div className="project-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects?.map((project: Project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <div className="card w-full cursor-pointer rounded-3xl border border-zinc-700 bg-zinc-900 shadow-xl hover:bg-zinc-800">
              <div className="card-body">
                <h2 className="card-title text-xl font-light">
                  {project.name}
                </h2>
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
