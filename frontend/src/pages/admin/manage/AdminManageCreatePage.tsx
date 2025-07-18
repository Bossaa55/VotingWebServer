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
    <div className="flex flex-col items-center w-full gap-2">
      <label className="self-start block mb-2 text-sm font-bold text-gray-700">
        Imatge
      </label>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="object-cover w-32 h-32 rounded"
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsUploading(true);

      const formData = new FormData(e.currentTarget);
      const name = formData.get('name') as string;

      const apiFormData = new FormData();
      apiFormData.append('name', name);
      if (selectedFile) {
          apiFormData.append('image', selectedFile);
      }

      const response = await fetch(`/api/admin/add-participant`, {
          method: 'POST',
          body: apiFormData,
      });

      if (!response.ok) {
          console.error("Failed to login");
          setIsUploading(false);
          return;
      }

      window.location.href = '/admin/manage';
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen mx-4 bg-main">
      <AdminNavBar onBack={() => {window.location.href = "/admin/manage"}} />
      <div className="pt-16">
        <BackgroundShapes />
      </div>
      <Card className="z-10 w-full shadow-md sm:w-96">
        <CardHeader className="flex flex-col items-center justify-between gap-4">
          <CardTitle className="text-2xl font-semibold">
            Afegir Participant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full gap-5 px-5 pt-3 mb-3">
            <Input
              type="text"
              name="Nom"
              placeholder="Entra el nom de l'usuari"
              id="name"
            />
            <ImageUpload onImageUpload={(file) => setSelectedFile(file)} />
            <div className="flex items-center justify-end w-full">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 font-bold text-white rounded bg-violet-500 hover:bg-violet-700 focus:outline-none focus:shadow-outline"
              >
                {isUploading ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-2 animate-spin"
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
