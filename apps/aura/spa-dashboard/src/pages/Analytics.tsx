import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@jade/ui';

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          View detailed analytics and insights
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              Analytics charts and graphs will be displayed here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Demographics</CardTitle>
            <CardDescription>Age and location distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              Demographic data visualization will be displayed here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
