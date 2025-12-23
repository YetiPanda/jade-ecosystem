import { Card, CardContent, CardDescription, CardHeader, CardTitle, Label, Input, Button, Textarea } from '@jade/ui';

export function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Your Profile</h2>
        <p className="text-muted-foreground">
          Manage your community profile and preferences
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input id="display-name" placeholder="Your display name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" placeholder="Tell us about yourself..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skin-type">Skin Type</Label>
              <Input id="skin-type" placeholder="e.g., Combination, Dry, Oily" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="concerns">Skin Concerns</Label>
              <Input id="concerns" placeholder="e.g., Acne, Aging, Sensitivity" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Activity</CardTitle>
            <CardDescription>Your recent contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Posts</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span>Comments</span>
                <span className="font-medium">87</span>
              </div>
              <div className="flex justify-between">
                <span>Events Attended</span>
                <span className="font-medium">5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
