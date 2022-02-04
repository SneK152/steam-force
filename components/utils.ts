export interface LessonProps {
  data: {
    answerchoices: string[]
    title: string
    slug?: any
    question: string
    correct: string
    heading: string
    lesson?: number
    prev?: string
    next?: string
    desc: string
    unit: string
  }
  content: string
  lessons: {
    cs: { title: string; lesson: string; slug: string; unit: string }[]
    math: { title: string; lesson: string; slug: string; unit: string }[]
    science: { title: string; lesson: string; slug: string; unit: string }[]
  }
  searches: { title: string; slug: string; type: string }[]
}

export const fetchData = async (url: string, options?: RequestInit) => {
  const res = await fetch(
    `${
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://steam-force.vercel.app"
    }${url}`,
    options,
  )
  const json = await res.json()
  return json
}
