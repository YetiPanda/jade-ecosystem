import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@jade/ui';

export function Community() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Community Feed</h2>
        <p className="text-muted-foreground">
          Connect with other beauty enthusiasts
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Discussion: Best Winter Skincare Routines</CardTitle>
            <CardDescription>Posted 2 hours ago by @skincare_guru</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              What are your go-to products for winter? Looking for recommendations...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review: New Hydrating Serum from GlowLab</CardTitle>
            <CardDescription>Posted 5 hours ago by @beauty_explorer</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Just tried the new hyaluronic acid serum and the results are amazing!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tips: Morning vs Evening Routines</CardTitle>
            <CardDescription>Posted 1 day ago by @derma_expert</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Here's my guide to optimizing your skincare routine for different times of day...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
