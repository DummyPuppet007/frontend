import { UserProfile } from "@/components/User/UserProfile";
import { UserProfileType } from "@/utils/types/auth.types";

export default function ProfilePage() {
  const dummyUser: UserProfileType = {
    userId: 1,
    username: "johndoe",
    email: "johndoe@example.com",
    password: "securepassword123", // In a real app, never store plaintext passwords!
    firstname: "John",
    middleName: "Michael",
    lastname: "Doe",
    isLocked: false,
    lockReason: null,
    roleId: 2,
    isDeleted: false,
    createdBy: 1,
    createdAt: "2024-03-11T12:00:00Z",
    updatedBy: null,
    updatedAt: "2024-03-11T12:00:00Z",
  };

  const handleUpdateUser = async (updatedData: Partial<UserProfileType>) => {
    try {
      console.log(updatedData)
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <UserProfile user={dummyUser} onUpdate={handleUpdateUser} />
    </div>
  );
}
