import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@jade/ui';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your Aura spa dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Appointments</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,543</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Clients</CardTitle>
            <CardDescription>Total registered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
