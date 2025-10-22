'use client';

import { redirect } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';

type AuthGuardProps = {
  children: React.ReactNode
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [allowed, setAllowed] = useState(false);
  useLayoutEffect(() => {
    const user = localStorage.getItem('user:data')
    if (!user) {
      redirect('/auth')
    } else {
      setAllowed(true)
    }
  }, [])

  return (
    <>{allowed ? children : null}</>
  )
}

export default AuthGuard