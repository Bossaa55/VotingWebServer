import { Input } from "@/components/admin/Input";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import { NavBar } from "@/components/shared/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminLoginPage = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const response = await fetch(`/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      console.error("Failed to login");
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen mx-4 bg-main">
      <BackgroundShapes />
      <NavBar />
      <Card className="z-10 w-full shadow-md sm:w-96">
        <CardHeader className="flex flex-col items-center justify-between gap-4">
          <CardTitle className="text-2xl font-semibold">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center w-full gap-5 px-5 pt-3 mb-3"
          >
            <Input
              type="text"
              name="Username"
              placeholder="Enter your username"
              id="username"
            />
            <Input
              type="password"
              name="Password"
              placeholder="Enter your pasword"
              id="password"
            />
            <div className="flex items-center justify-end w-full">
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white rounded bg-violet-500 hover:bg-violet-700 focus:outline-none focus:shadow-outline"
              >
                Login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
