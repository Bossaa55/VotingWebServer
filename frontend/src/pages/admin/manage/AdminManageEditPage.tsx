import { AdminNavBar } from "@/components/admin/AdminNavBar";
import { Input } from "@/components/admin/Input";
import { BackgroundShapes } from "@/components/shared/BackgroundShapes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Participant } from "@/interface/Participant";
import { useEffect, useState, type ChangeEvent } from "react";

export const ImageUpload = ({
  onImageUpload,
  imageUrl,
}: {
  onImageUpload: (file: File | null) => void;
  imageUrl?: string;
}) => {
  const [preview, setPreview] = useState<string | null>(imageUrl || null);

  useEffect(() => {
    setPreview(imageUrl || null);
  }, [imageUrl]);

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

export const AdminManageEditPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);

  const participantId = new URLSearchParams(window.location.search).get("p");

  useEffect(() => {
    const fetchVoteInfo = async () => {
      try {
        const response = await fetch(`/api/participant/${participantId}`);

        if(response.ok) {
          const data = await response.json();
          setParticipant({...data.participant});
        }else{
          window.location.href = "/admin/manage";
        }
      } catch (error) {
        console.error("Failed to fetch participants:", error);
      }
    };

    fetchVoteInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    const apiFormData = new FormData();
    apiFormData.append("participant_id", participantId || "");
    apiFormData.append("name", name);
    if (selectedFile) {
      apiFormData.append("image", selectedFile);
    }

    try {
      const response = await fetch('/api/admin/update-participant', {
        method: "PATCH",
        body: apiFormData,
      });

      if (!response.ok) {
        throw new Error("Failed to save participant");
      }

      console.log("Participant saved successfully!");
      setIsUploading(false);
      window.location.href = "/admin/manage";
    } catch (error) {
      console.error(error);
      setIsUploading(false);
    }
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/delete-participant/${participantId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to save participant");
      }

      console.log("Participant saved successfully!");
      setIsUploading(false);
      window.location.href = "/admin/manage";
    } catch (error) {
      console.error(error);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 h-dvh bg-main">
      <AdminNavBar onBack={() => {window.location.href = "/admin/manage"}} />
      <div className="pt-16">
        <BackgroundShapes />
      </div>
      {
        !participant ? (
            <div role="status">
                <svg aria-hidden="true" className="text-gray-300 size-16 animate-spin fill-violet-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        ) : (
        <Card className="z-10 w-full shadow-md sm:w-128">
          <CardHeader className="flex flex-col items-center justify-between gap-4">
            <CardTitle className="text-2xl font-semibold">
              {participant ? "Modificar Participant" : "Afegir Participant"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col items-center justify-center w-full gap-5 px-5 pt-3 mb-3" onSubmit={handleSubmit}>
              <Input
                type="text"
                name="Nom"
                placeholder="Entra el nom de l'usuari"
                value={participant ? participant.name : ""}
                id="name"
              />
              <ImageUpload
                onImageUpload={(file) => setSelectedFile(file)}
                imageUrl={participant?.imageUrl}
              />
              <div className={`flex items-center justify-between w-full`}>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    {isDeleting ? (
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
                        Eliminar
                      </>
                    ) : "Eliminar"}
                  </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 font-bold text-white rounded bg-violet-500 hover:bg-violet-600"
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
                      Guardar
                    </>
                  ) : "Guardar"
                }
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
