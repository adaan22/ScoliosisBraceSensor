import Image from 'next/image'

export function BrandingLogos() {
  return (
    <div className="flex items-center justify-end gap-3 md:gap-4">
      <Image
        src="/branding/project-90.png"
        alt="Project 90"
        width={140}
        height={56}
        className="h-8 w-auto md:h-9"
        priority
      />
      <Image
        src="/branding/cascade-orthotics.png"
        alt="Cascade Orthotics"
        width={160}
        height={56}
        className="h-8 w-auto md:h-9"
        priority
      />
    </div>
  )
}
