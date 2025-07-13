import { Card, CardContent } from "../ui/card";

export const IconCard = ({
  title,
  description,
  icon,
  onClick,
  className,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <Card
      className={`shadow-md w-96 z-10 ${className ?? ""}`}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 px-4 h-14">
        <div className="flex items-center justify-center w-auto h-full p-2 rounded-full bg-violet-200">
          {icon}
        </div>
        <div
          className={`h-full flex flex-col items-start ${
            description ? "justify-between" : "justify-center"
          } gap-1`}
        >
          <h1 className="text-2xl font-semibold text-center">{title}</h1>
          {description && (
            <p className="mb-0 text-sm text-center text-gray-500">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
