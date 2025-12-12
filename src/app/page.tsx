import { Button } from "@/components/ui/button";
import prisma from "@/lib/database";

const Home = async () => {
  return (
    <main>
      <h1 className="text-blue-600 text-5xl">This is home page</h1>
      <p>This is a second paragraph</p>
      <p>another paragraph</p>
    </main>
  );
};

export default Home;
