import { AdminNavBar } from "@/components/admin/AdminNavBar";
import { Input } from "@/components/admin/Input";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, type ChangeEvent } from "react";

export const ImageUpload = ({
  onImageUpload,
}: {
  onImageUpload: (file: File | null) => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onImageUpload(file);
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <label className="block text-gray-700 self-start text-sm font-bold mb-2">
        Imatge
      </label>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-32 object-cover rounded"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full text-sm text-transparent file:mr-0 file:py-2 file:px-0 file:w-full file:rounded file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
      />
    </div>
  );
};

export const AdminManageCreatePage = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsUploading(true);
    // Simulate an API call to create a participant
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Participant created successfully!");
        setIsUploading(false);
        resolve(true);
        window.location.href = "/admin/manage";
      }, 1000);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-main">
      <AdminNavBar onBack={() => (window.location.href = "/admin/manage")} />
      <div className="pt-16">
        <BackgroundShapes />
      </div>
      <Card className="shadow-md w-96 z-10">
        <CardHeader className="flex flex-col items-center justify-between gap-4">
          <CardTitle className="text-2xl font-semibold">
            Afegir Participant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col items-center justify-center gap-5 px-5 pt-3 mb-3 w-full">
            <Input
              type="text"
              name="Nom"
              placeholder="Entra el nom de l'usuari"
              id="name"
            />
            <ImageUpload onImageUpload={(file) => console.log(file)} />
            <div className="flex items-center justify-end w-full">
              <button
                type="submit"
                onClick={handleCreate}
                className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 animate-spin mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                      />
                    </svg>
                    Afegir
                  </>
                ) : (
                  "Afegir"
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
