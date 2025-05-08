import { Card, CardContent } from "../ui/card";

export const IconCard = ({ title, description, icon, onClick }: { title: string; description: string; icon: React.ReactNode; onClick: () => void }) => {
    return (
        <Card className="shadow-md w-96 z-10" onClick={onClick}>
            <CardContent className="flex items-center px-4 gap-4 h-14">
                <div className="flex items-center justify-center w-auto h-full rounded-full bg-violet-200 p-2">
                    {icon}
                </div>
                <div className={`h-full flex flex-col items-start ${description ? 'justify-between' : 'justify-center'} gap-1`}>
                    <h1 className="text-2xl font-semibold text-center">{title}</h1>
                    {description && <p className="text-sm text-center text-gray-500 mb-0">{description}</p>}
                </div>
            </CardContent>
        </Card>
    );
};