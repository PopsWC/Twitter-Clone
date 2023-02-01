import { useState } from "react";
import Link from "next/link";
import { api } from "../../utils/api"
import { SubmitHandler, useForm } from "react-hook-form";

type TweetData = {
    userId: string
    username: string
    tweetId: string
    tweet: string
    createdAt: string
}

type Inputs = {
    tweet: string;
};

const Tweets = (tweetData: TweetData) => {
    const utils = api.useContext();
    const likeMutation = api.tweetRouter.like.useMutation({
        onSuccess: () => {
            utils.tweetRouter.invalidate().catch((e) => console.log(e))
        }
    }).mutateAsync;
    const unlikeMutation = api.tweetRouter.unlike.useMutation({
        onSuccess: () => {
            utils.tweetRouter.invalidate().catch((e) => console.log(e))
        }
    }).mutateAsync;
    const shareMutation = api.tweetRouter.share.useMutation({
        onSuccess: () => {
            utils.tweetRouter.invalidate().catch((e) => console.log(e))
        }
    }).mutateAsync;
    const unshareMutation = api.tweetRouter.unshare.useMutation({
        onSuccess: () => {
            utils.tweetRouter.invalidate().catch((e) => console.log(e))
        }
    }).mutateAsync;
    const likeData = api.tweetRouter.checkLike.useQuery({ tweetId: tweetData.tweetId }).data
    const numlikes = api.tweetRouter.getTweet.useQuery({ tweetId: tweetData.tweetId }).data?.likes.length
    const shareData = api.tweetRouter.checkShare.useQuery({ tweetId: tweetData.tweetId }).data
    const numshares = api.tweetRouter.getTweet.useQuery({ tweetId: tweetData.tweetId }).data?.shares.length

    const [showModal, setShowModal] = useState(false);

    const tweetQuery = api.tweetRouter.list.useInfiniteQuery(
        {
            limit: 5,
            tweedId: tweetData.tweetId,
        },
        {
            getPreviousPageParam(lastPage) {
                return lastPage.nextCursor;
            },
        },
    );

    const addPost = api.tweetRouter.createTweet.useMutation({
        onSuccess() {
            utils.tweetRouter.invalidate().catch((e) => console.log(e))
        },
    });

    const { register, handleSubmit, reset } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async data => {
                await addPost.mutateAsync({tweet : data.tweet, parentId: tweetData.tweetId}).catch((err) => console.log(err))
                reset({ tweet: "" })
    };



    return (
        <a href="#" className="block max-w-sm p-6 min-w-full bg-white border-b border-gray-200 rounded-md shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <Link href={'/profile/'} className="mb-2 text-md font-bold tracking-tight text-white hover:underline underline-offset-4">@{tweetData.username}</Link>
            <p className="font-normal text-white text-sm">{tweetData.tweet}</p>
            <div className="flex flex-row justify-end gap-3 pt-2">
                <button onClick={() => {
                    if (likeData) {
                        unlikeMutation({ tweetId: tweetData.tweetId }).catch((e) => console.log(e))
                    }
                    else {
                        likeMutation({ tweetId: tweetData.tweetId }).catch((e) => console.log(e))
                    }
                }} className="inline-flex items-center text-center text-white font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" className={likeData ? "w-6 h-6 stroke-sky-700" : "w-6 h-6 stroke-white"}>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <span className="font-semibold text-white pl-1">{numlikes ? numlikes : 0}</span>
                </button>

                <button className="inline-flex items-center text-center text-white font-semibold" onClick={() => {
                    if (shareData) {
                        unshareMutation({ tweetId: tweetData.tweetId }).catch((e) => console.log(e))
                    }
                    else {
                        shareMutation({ tweetId: tweetData.tweetId }).catch((e) => console.log(e))
                    }
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" className={shareData ? "w-6 h-6 stroke-sky-700" : "w-6 h-6 stroke-white"}>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                    </svg>
                    <span className="font-semibold text-white pl-1">{numshares ? numshares : 0}</span>
                </button>

                <button className="inline-flex items-center text-center text-white font-semibold" onClick={() => setShowModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    <p className="font-semibold text-white pl-1">{0}</p>
                </button>
                {showModal ? (
                    <div className="fixed flex inset-0 h-full w-full bg-gray-400 bg-opacity-70 items-center justify-center">
                        <div className="inline-flex flex-col w-1/2 h-3/4 border border-gray-700 rounded-lg shadow-md bg-gray-800 ">
                            <div className="flex flex-row min-w-full p-4 items-center">
                                <span className="text-white text-lg font-semibold">Reply To Tweet</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="white" className="w-6 h-6 ml-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                                </svg>
                                <button className="flex flex-row ml-auto" onClick={() => setShowModal(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="white" className="w-7 h-7">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex flex-row pl-10 pt-5">
                                <span className="mb-2 text-lg font-semibold tracking-tight text-white">@{tweetData.username}</span>
                            </div>
                            <div className="flex flex-row pl-14">
                                <p className="font-normal text-white text-md">{tweetData.tweet}</p>
                            </div>
                            <div className="flex flex-row pl-14 pt-10 ">
                                <span className="mb-2 text-lg font-semibold tracking-tight text-white">Replies</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="white" className="w-6 h-6 ml-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
                                </svg>
                            </div>
                            <div className="flex flex-row">
                                <div className="flex flex-col w-1/4" />

                                <div className="flex flex-row w-full h-full bg-white">
                                    <div className="flex flex-row w-full overflow-scroll h-auto ">
                                        <ul className="flex flex-col w-full h-auto">
                                            {tweetQuery.data?.pages.map((page, index) => (
                                                <li key={page.items[0]?.id || index}>
                                                    {page.items.map((item) => (
                                                        // eslint-disable-next-line react/jsx-key
                                                        <Tweets tweet={item.tweet} username={item.userName} userId={item.userId} tweetId={item.id} createdAt={item.createdAt.toDateString()} />
                                                    ))}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row w-full h-1/6">
                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full h-full border border-gray-700 rounded-lg shadow-md bg-gray-800 flex-wrap">
                                    <div className="flex flex-row w-4/5 h-full">
                                        <textarea
                                            {...register("tweet", { required: true })}
                                            typeof="text"
                                            id="tweet"
                                            name="tweet"
                                            required
                                            placeholder="Whats Happening?"
                                            className="bg-gray-800 h-full w-full text-white placeholder-gray-400 font-semibold p-4 border-transparent outline-none focus:border-transparent focus:ring-0"
                                        />
                                    </div>
                                    <div className="flex flex-row w-1/5 h-full justify-center items-center">
                                        <button type="submit" className="bg-sky-700 text-white rounded-lg py-3 px-10">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </a >
    )
}

export default Tweets