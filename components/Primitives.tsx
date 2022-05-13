import { ReactNode } from 'react'

export const Main: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <main
    className={`p-2 m-auto sm:w-11/12 md:w-3/5 lg:w-2/5 ${
      className && className
    }`}>
    {children}
  </main>
)
