import { NextPage } from "next";
import  Tweets  from "./tweets";
import { api } from "../../utils/api";

export const TrendingBlock = () => {

    const postsQuery = api.tweetRouter.list.useInfiniteQuery(
        {
            limit: 5,
        },
        {
            getPreviousPageParam(lastPage) {
                return lastPage.nextCursor;
            },
        },
    );

    return (
        <div className="flex flex-col w-full h-full">
            <h2 className="text-white font-semibold text-xl mt-5 mb-3">Trending</h2>
            <div className="flex flex-col w-full border border-gray-700 rounded-lg shadow-md bg-gray-800 overflow-scroll">
                <div className="flex flex-col w-full h-auto rounded-lg">
                    {postsQuery.data?.pages.map((page, index) => (
                        <div key={page.items[0]?.id || index}>
                            {page.items.map((item) => (
                                // eslint-disable-next-line react/jsx-key
                                <Tweets tweet={item.tweet} username={item.userName} userId={item.userId} tweetId={item.id} createdAt={item.createdAt.toDateString()} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default TrendingBlock