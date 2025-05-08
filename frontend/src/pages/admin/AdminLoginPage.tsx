import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import { NavBar } from "@/components/shared/NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Input: React.FC<{ type: string; name: string; placeholder: string; id: string }> = ({ type, name, placeholder, id }) => {
    return(
        <div className="w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                {name}
            </label>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
    );
}

export const AdminLoginPage = () => {
    return(
        <div className="flex flex-col items-center justify-center h-screen bg-main">
            <BackgroundShapes />
            <NavBar />
            <Card className="shadow-md w-96 z-10">
                <CardHeader className="flex flex-col items-center justify-between gap-4">
                    <CardTitle className="text-2xl font-semibold">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col items-center justify-center gap-5 px-5 pt-3 mb-3 w-full">
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