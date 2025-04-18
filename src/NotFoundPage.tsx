import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <img
        src="/images/notfound.jpg"
        alt="404 Not Found"
        className="w-1/2 mb-6 opacity-90"
      />
      <p className="text-gray-600 text-lg mt-2">Oops! The page you're looking for doesn't exist.</p>
      <Button className="mt-6" onClick={() => navigate("/")}>Go Home</Button>
    </div>
  );
};

export default NotFoundPage;
