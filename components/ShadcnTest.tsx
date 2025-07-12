import { Button } from '@/components/ui/button'

export function ShadcnTest() {
  return (
    <div className="flex gap-4 p-4">
      <Button>Default Button</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  )
}