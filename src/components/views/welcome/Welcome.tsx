import Link from "next/link";

function Welcome() {
  return (
    <div className="page-container">
      <div className="hero grid h-screen place-content-center bg-gradient-to-t from-black to-zinc-900">
        <div className="title text-center">
          <h1 className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-8xl font-extrabold tracking-tighter text-transparent">
            Yet another to-do app
          </h1>
          <h2 className="text-4xl font-extralight text-white">
            without the frustration
          </h2>
          <div className="try-cta my-4">
            <Link href="/api/auth/signin">
              <button className="btn btn-primary">Try it for free</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
