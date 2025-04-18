import Lottie from "lottie-react";
import loadingAnimation from "@/assets/Loading.json";

function Loading() {
    return(
        <div className="flex items-center justify-center h-screen">
        <Lottie animationData={loadingAnimation} loop autoplay className="w-64 h-64" />
        </div>
    )
}

export default Loading;