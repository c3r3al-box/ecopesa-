// src/types/next-auth.d.ts
import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role: 'admin' | 'recycler' | 'collector' | 'user'
    full_name?: string
  }
  
  interface Session {
    user: User & {
      id: string
      role: string
    }
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser extends User {
    id: string
    role: string
  }
}