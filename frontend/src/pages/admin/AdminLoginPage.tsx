import { Input } from "@/components/admin/Input";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import { NavBar } from "@/components/shared/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminLoginPage = () => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission

        // Get form data
        const formData = new FormData(e.currentTarget);
        const username = formData.get('Username') as string;
        const password = formData.get('Password') as string;

        const response = await fetch(`/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            console.error("Failed to login");
            return;
        }

        window.location.href = '/admin';
    };

    return(
        <div className="flex flex-col items-center justify-center h-screen bg-main">
            <BackgroundShapes />
            <NavBar />
            <Card className="shadow-md w-96 z-10">
                <CardHeader className="flex flex-col items-center justify-between gap-4">
                    <CardTitle className="text-2xl font-semibold">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-5 px-5 pt-3 mb-3 w-full">
                        <Input type="text" name="Username" placeholder="Enter your username" id="username"/>
                        <Input type="password" name="Password" placeholder="Enter your pasword" id="password"/>
                        <div className="flex items-center justify-end w-full">
                            <button
                                type="submit"
                                className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}