import { useState } from 'react'
import { UserProfileType } from '@/utils/types/auth.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UserProfileProps {
  user: UserProfileType;
  onUpdate: (updatedUser: Partial<UserProfileType>) => Promise<void>;
}

export function UserProfile({ user, onUpdate }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<UserProfileType>>({
    firstname: user.firstname,
    middleName: user.middleName,
    lastname: user.lastname,
    email: user.email,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onUpdate(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Username - Read only */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={user.username}
                disabled
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* Middle Name */}
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                name="middleName"
                value={formData.middleName || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {/* Role ID - Read only */}
            <div className="space-y-2">
              <Label htmlFor="roleId">Role ID</Label>
              <Input
                id="roleId"
                value={user.roleId}
                disabled
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </form>

        {/* Display additional read-only information */}
        <div className="mt-8 pt-6 border-t space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><span className="font-medium">Created At:</span> {new Date(user.createdAt).toLocaleString()}</p>
            <p><span className="font-medium">Created By:</span> {user.createdBy}</p>
            <p><span className="font-medium">Updated At:</span> {new Date(user.updatedAt).toLocaleString()}</p>
            <p><span className="font-medium">Updated By:</span> {user.updatedBy || 'N/A'}</p>
            <p><span className="font-medium">Account Status:</span> {user.isLocked ? 'Locked' : 'Active'}</p>
            {user.isLocked && user.lockReason && (
              <p><span className="font-medium">Lock Reason:</span> {user.lockReason}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
