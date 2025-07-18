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
      className={`shadow-md md:w-96 w-full z-10 ${className ?? ""}`}
      onClick={onClick}
    >
      <CardContent className="flex items-center h-auto gap-4 px-4 py-4">
        <div className="flex items-center justify-center p-2 rounded-full size-14 bg-violet-200">
          {icon}
        </div>
        <div
          className={`h-auto flex flex-col items-start ${
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
