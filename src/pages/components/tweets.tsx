import { QueryClient } from "@tanstack/react-query"
import { api } from "../../utils/api"

type TweetData = {
    userId: string
    username: string
    tweetId: string
    tweet: string
    createdAt: string
}

const Tweets = (tweetData: TweetData) => {
    const tweetRouter = api.tweetRouter;
    const likeMutation = tweetRouter.like.useMutation().mutateAsync;
    const unlikeMutation = tweetRouter.unlike.useMutation().mutateAsync;
    const hasLiked = tweetRouter.getTweetById.useQuery({ tweetId: tweetData.tweetId }).data?.likes.length! > 0
    const likes = tweetRouter.getTweetById.useQuery({ tweetId: tweetData.tweetId }).data?.likes.length!

    return (
        <a href="#" className="block max-w-sm p-6 min-w-full bg-white border-b border-gray-200 rounded-md shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-md font-bold tracking-tight text-white">@{tweetData.username}</h5>
            <p className="font-normal text-white text-sm">{tweetData.tweet}</p>
            <div className="flex flex-row justify-end gap-3 pt-2">
                <button onClick={() => {
                    if (hasLiked)
                        unlikeMutation({ tweetId: tweetData.tweetId })
                    else {
                        likeMutation({ tweetId: tweetData.tweetId })
                    }
                }} className="inline-flex items-center text-center text-white font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" className={hasLiked ? "w-6 h-6 stroke-sky-700" : "w-6 h-6 stroke-white"}>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <span className="font-semibold text-white pl-1">{likes}</span>
                </button>

                <button className="inline-flex items-center text-center text-white font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" className={hasLiked ? "w-6 h-6 stroke-sky-700" : "w-6 h-6 stroke-white"}>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                    </svg>
                    <span className="font-semibold text-white pl-1">{likes}</span>
                </button>

                <button className="inline-flex items-center text-center text-white font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    <p className="font-semibold text-white pl-1">{0}</p>
                </button>

            </div>
        </a >

    )
}

export default Tweets