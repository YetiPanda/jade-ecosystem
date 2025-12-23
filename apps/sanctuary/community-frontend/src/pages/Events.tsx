import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@jade/ui';

export function Events() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Community Events</h2>
        <p className="text-muted-foreground">
          Upcoming beauty and wellness events
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Skincare Workshop</CardTitle>
              <Badge>Upcoming</Badge>
            </div>
            <CardDescription>January 15, 2025 at 2:00 PM</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Join us for an interactive workshop on building the perfect skincare routine.
              Expert dermatologists will share their tips and answer your questions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Product Launch: GlowLab Collection</CardTitle>
              <Badge variant="secondary">Featured</Badge>
            </div>
            <CardDescription>January 20, 2025 at 6:00 PM</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Be the first to discover GlowLab's new winter collection. Special discounts
              for attendees and live Q&A with the founders.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Virtual Spa Day</CardTitle>
              <Badge>Upcoming</Badge>
            </div>
            <CardDescription>January 25, 2025 at 10:00 AM</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Relax and unwind with our virtual spa day. Guided meditation, facial massage
              tutorials, and self-care tips from wellness experts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Community Meetup: SF Bay Area</CardTitle>
              <Badge>Upcoming</Badge>
            </div>
            <CardDescription>February 1, 2025 at 3:00 PM</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect with fellow beauty enthusiasts in person! Coffee, product swaps,
              and skincare discussions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
