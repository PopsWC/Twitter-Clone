import  Tweets  from "./tweets";
import { api } from "../../utils/api";

export const TrendingBlock = () => {

    const tweetQuery = api.tweetRouter.list.useInfiniteQuery(
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
            <div className="flex flex-col w-full  rounded-lg shadow-md bg-white overflow-scroll">
                <div className="flex flex-col w-full h-auto rounded-lg">
                    {tweetQuery.data?.pages.map((page, index) => (
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