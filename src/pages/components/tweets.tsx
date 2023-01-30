import { api } from "../../utils/api"
import classNames from "classnames"
import { useEffect, useState } from "react"
import {z} from "zod"

type TweetData = {
    userId: string
    username: string
    tweetId: string
    tweet: string
    createdAt: string
}

const Tweets = (tweetData: TweetData) => {

    const likeCheck = api.tweetRouter.checkLike.useQuery({ userId: tweetData.userId, tweetId: tweetData.tweetId })
    const getLikes = api.tweetRouter.getLikes.useQuery({ tweetId: tweetData.tweetId })
    const shareCheck = api.tweetRouter.checkShare.useQuery({ userId: tweetData.userId, tweetId: tweetData.tweetId })
    const getShares = api.tweetRouter.getShares.useQuery({ tweetId: tweetData.tweetId })

    const like = api.tweetRouter.likeTweet.useMutation()
    const share = api.tweetRouter.shareTweet.useMutation()

    let likeBool = likeCheck.data
    let shareBool = shareCheck.data!
    let numLikes = getLikes.data!
    let numShares = getShares.data!

    const [likeColor, setLikeColor] = useState(
        classNames("w-6 h-6 mr-2", "fill-none", "stroke-2",
            { "stroke-white": likeBool == false },
            { "stroke-sky-700": likeBool == true })
    )
    const [likeCount, setLikeCount] = useState(numLikes)

    const [shareColor, setShareColor] = useState(
        classNames("w-6 h-6 mr-2", "fill-none", "stroke-2",
            { "stroke-white": shareBool == false },
            { "stroke-sky-700": shareBool == true })
    )
    const [shareCount, setShareCount] = useState(numShares)

    useEffect(() => {
        setLikeColor(classNames("w-6 h-6 mr-2", "fill-none", "stroke-2",
            { "stroke-sky-700": likeBool == true },
            { "stroke-white": likeBool == false })
        )
    }, [likeBool])
    useEffect(() => {
        setLikeCount(numLikes)
    }, [numLikes])

    useEffect(() => {
        setShareColor(classNames("w-6 h-6 mr-2", "fill-none", "stroke-2",
            { "stroke-sky-700": shareBool == true },
            { "stroke-white": shareBool == false })
        )
    }, [shareBool])
    useEffect(() => {
        setShareCount(numShares)
    }, [numShares])

    const liked = () => {
        try {
            if (likeBool == true) {
                likeBool = false
                numLikes -= 1
            }
            else {
                likeBool = true
                numLikes += 1
            }
            like.mutateAsync({ userId: tweetData.userId, tweetId: tweetData.tweetId }).catch((error) => {
                console.log(error)
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    const shared = () => {
        try {
            if (shareBool == true) {
                shareBool = false
                numShares -= 1
            }
            else {
                shareBool = true
                numShares += 1
            }
            share.mutateAsync({ userId: tweetData.userId, tweetId: tweetData.tweetId }).catch((error) => {
                console.log(error)
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <a href="#" className="block max-w-sm p-6 min-w-full bg-white border-b border-gray-200 rounded-md shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-md font-bold tracking-tight text-white">@{tweetData.username}</h5>
            <p className="font-normal text-white text-sm">{tweetData.tweet}</p>
            <div className="flex flex-row justify-end gap-3 pt-2">
                <button onClick={liked} className="inline-flex items-center text-center text-white font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        className={likeColor}>
                        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <span className="font-semibold text-white">{likeCount}</span>
                </button>

                <button className="inline-flex items-center text-center text-white font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        className={"stroke-white"}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    <span className="font-semibold text-white">{0}</span>
                </button>

                <button onClick={shared} className="inline-flex items-center text-center text-white font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className={shareColor}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 19.5v-.75a7.5 7.5 0 00-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    <p className="text-white">{shareCount}</p>
                </button>

            </div>
        </a>

    )
}

export default Tweets