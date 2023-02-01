import { type NextPage } from "next";
import Head from "next/head";
import Tweets from "./components/tweets";
import { CreateTweet } from "./components/createtweet";
import { AuthBlock } from "./components/authblock";
import { TrendingBlock } from "./components/trendingblock";
import { api } from "../utils/api";
import { useEffect } from "react";


const Home: NextPage = () => {

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

  useEffect(() => {
    tweetQuery.refetch().catch((e) => console.log(e));
  },[tweetQuery.data?.pages.length]);

  return (
    <>
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="Twitter Clone Portfolio Site" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex gap-5 h-screen bg-slate-800 overflow-hidden">
        <div className="flex-col relative w-9/12 rounded-3xl my-5">
          <div className="flex flex-col h-full">
            <div className="p-6 h-full rounded-lg border-4 border-none border-white">
              <h2 className="text-white font-semibold text-xl pb-5">Timeline</h2>
              <div className="flex flex-row w-full h-4/6">
                <div className="flex flex-row w-full overflow-scroll h-auto ">
                  <ul className="flex flex-col w-full h-auto">
                    {tweetQuery.data?.pages.map((page, index) => (
                      <li key={page.items[0]?.id || index}>
                        {page.items.map((item) => (
                          // eslint-disable-next-line react/jsx-key
                          <Tweets tweet={item.tweet} username={item.userName} userId={item.userId} tweetId={item.id} createdAt={item.createdAt.toDateString()}/>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex flex-row w-full h-1/5 mt-10">
                <CreateTweet parentId={null}/>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-col w-3/12 rounded-3xl p-5">
          <div className="flex flex-row h-1/4">
            <AuthBlock />
          </div>
          <div className="flex flex-row h-3/4">
            <TrendingBlock />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

