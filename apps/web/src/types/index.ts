export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: User
  students?: User[]
  createdAt: Date
  updatedAt: Date
}

export interface Lesson {
  id: string
  title: string
  content: string
  courseId: string
  order: number
  createdAt: Date
  updatedAt: Date
}
