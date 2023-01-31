import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useSession } from "next-auth/react"
import { api } from "../../utils/api"

type TweetData = {
    tweet: string
    userName: string
    userId: string
    createdAt: string
}

type Inputs = {
    tweet: string;
};


export const CreateTweet = () => {
    const utils = api.useContext();
    const addPost = api.tweetRouter.createTweet.useMutation({
        onSuccess() {
            utils.tweetRouter.invalidate()
        },
    });

    const { register, handleSubmit, reset } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async data => {
                await addPost.mutateAsync(data).catch((err) => console.log(err))
                reset({ tweet: "" })
            }


    return (
        // We pass the event to the handleSubmit() function on submit.
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
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

    )
}

export default CreateTweet