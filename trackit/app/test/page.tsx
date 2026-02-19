export default function TestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold text-primary mb-4">Tailwind CSS Test</h1>
      <p className="text-muted-foreground mb-4">
        If you can see this with proper styling, Tailwind is working!
      </p>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="text-card-foreground font-semibold">Card 1</h2>
          <p className="text-muted-foreground">This is a card with border</p>
        </div>
        
        <div className="bg-secondary border border-border rounded-lg p-4">
          <h2 className="text-secondary-foreground font-semibold">Card 2</h2>
          <p className="text-muted-foreground">Secondary background</p>
        </div>
        
        <div className="bg-accent border border-border rounded-lg p-4">
          <h2 className="text-accent-foreground font-semibold">Card 3</h2>
          <p className="text-muted-foreground">Accent background</p>
        </div>
      </div>
      
      <div className="mt-8 flex gap-4">
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
          Primary Button
        </button>
        <button className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90">
          Destructive Button
        </button>
        <button className="border border-border bg-background px-4 py-2 rounded-lg hover:bg-muted">
          Outline Button
        </button>
      </div>
    </div>
  )
}