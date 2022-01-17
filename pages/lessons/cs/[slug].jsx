import { getPostBySlug, getAllPosts } from "../../../components/courses"
import markdownToHtml from "../../../components/markdown"
import matter from "gray-matter"
import Layout from "../../../components/layout"
import Sidebar from "../../../components/sidebar"
import fs from "fs"
import { join } from "path"
import AccountHeader from "../../../components/accountHeader"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { arrayUnion, doc, increment, updateDoc } from "@firebase/firestore"
import { useAuth } from "../../../components/userContext"
import db from "../../../components/clientApp"
import $ from "jquery"

export default function CSLesson({ data, content, lessons }) {
    const router = useRouter()
    const user = useAuth()
    const answerchoices = [...data.answerchoices]
    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    shuffleArray(answerchoices)
    const formSubmit = async (e) => {
        e.preventDefault()
        const val = $(`input[name=${data.slug}-question]:checked + label`).html()
        if (val == data.correct) {
            $(`:has(> input[name=${data.slug}-question]:checked)`).addClass("bggreen")
            await updateDoc(doc(db, "users", user.uid), {
                points: increment(10)
            })
        } else {
            $(`:has(> input[name=${data.slug}-question]:checked)`).addClass("bgred")
            $(`input[name=${data.slug}-question] + label`).each((index, element) => {
                if (element.innerText == data.correct) {
                    $(element.parentElement).addClass("bggreen")
                }
            })
            await updateDoc(doc(db, "users", user.uid), {
                points: increment(1)
            })
        }
        await updateDoc(doc(db, "users", user.uid), {
            completed: arrayUnion(data.slug)
        })
        router.reload()
    }
    useEffect(() => {
        const fn = async () => {
            try {
                await updateDoc(doc(db, "users", user.uid), {
                    current: router.asPath,
                    currentTitle: data.heading
                })
                await updateDoc(doc(db, "users", user.uid), {
                    courses: {
                        cs: data.slug,
                        math: user.courses.math,
                        science: user.courses.science
                    }
                })
            }
            catch { }
        }
        fn()
    }, [router.asPath])
    return <Layout title={data.title} container={false}>
        <AccountHeader />
        <div className="flex max-w-7xl sm:flex-row flex-col mx-auto py-6 px-4 sm:px-6 lg:px-8 relative flex-grow">
            <Sidebar lessons={lessons} type="cs" />
            <div className="w-full inline-block prose prose-pre:bg-[#22272e] prose-pre:p-0 prose-h2:border-t-2 prose-h2:pt-5 border p-4 shadow-lg rounded-2xl border-opacity-80 bg-white max-w-none sm:w-9/12">
                <h1>{data.heading}</h1>
                <p className="mb-0">In this section you will {data.desc}.</p>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
                <div className={user.completed?.includes(data.slug) ? "cursor-not-allowed" : ""}>
                    <div className={`bg-gray-50 shadow-md rounded-md p-3 mb-5 ${user.completed?.includes(data.slug) ? "bg-white text-gray-400 cursor-not-allowed pointer-events-none" : ""}`}>
                        <span className="font-semibold text-lg">Review: {data.question}</span>
                        <form onSubmit={formSubmit}>
                            {answerchoices.map(choice => (
                                <span className={`flex flex-row flex-grow m-1 p-1 rounded-lg ${user.completed?.includes(data.slug) && choice == data.correct ? "bggreen" : ""}`} key={choice}>
                                    <input type="radio" id={choice} name={`${data.slug}-question`} className="h-4 w-4 focus:outline-none focus:ring-transparent align-middle mt-[6px] mr-2" />
                                    <label className="not-prose inline-block align-baseline" htmlFor={choice}>{choice}</label>
                                </span>
                            ))}
                            <button type="submit" className={`text-white py-1 px-2 rounded-md shadow-lg ${user.completed?.includes(data.slug) ? "bg-blue-200" : "bg-blue-500"}`}>Submit</button>
                        </form>
                    </div>
                </div>
                <div className="flex justify-between h-10">
                    <Link href={`/lessons/cs/${data.prev}`}>
                        <a className={`bg-gray-300 rounded-md shadow-md no-underline pt-[0.4rem] px-3 font-light ${data.prev ? "" : "pointer-events-none bg-gray-200 text-gray-400"}`}>
                            Previous
                        </a>
                    </Link>
                    <Link href={`/lessons/cs/${data.next}`}>
                        <a className={`bg-blue-500 rounded-md shadow-md no-underline text-white pt-[0.4rem] px-3 font-light ${data.next ? "" : "pointer-events-none bg-blue-300 text-gray-100"}`}>
                            Next
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    </Layout>
}

export async function getStaticProps({ params }) {
    const fileContents = getPostBySlug(params.slug, "cs")
    const { data, content } = matter(fileContents)
    const cont = await markdownToHtml(content)
    return {
        props: {
            content: cont,
            data: data,
            lessons: {
                cs: getAllPosts("cs"),
                math: getAllPosts("math"),
                science: getAllPosts("science")
            }
        }
    }
}

export async function getStaticPaths() {
    const slugs = fs.readdirSync(join(process.cwd(), "courses/cs"))
    const posts = slugs.map((slug) => { return { slug: matter(getPostBySlug(slug, "cs")).data.slug } })
    return {
        paths: posts.map((post) => {
            return {
                params: {
                    slug: post.slug
                }
            }
        }),
        fallback: false
    }
}