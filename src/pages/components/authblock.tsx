import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"

export function AuthBlock() {
    const { data: session, status } = useSession()

    if (status === "authenticated" && session.user !== undefined) {
        const userId = session.user.id
        return (

            <div className="flex flex-col w-full h-full border-2 border-black rounded-lg shadow-md bg-white">
                <div className="flex flex-row min-w-full items-center ml-3 mt-3">
                    <div className="flex flex-col w-auto p-3">
                        <Link href={"/profile/" + userId}>
                            <img className="w-12 h-12 rounded-full border-black" src={session.user.image!} alt="Profile Picture" />
                        </Link>
                    </div>
                    <div className="flex flex-col w-auto p-3">
                        <a href={"/profile/" + userId} className=" hover:underline underline-offset-8 decoration-8 text-black">
                            <span className="text-black font-semibold text-2xl">@{session.user?.name}</span>
                        </a>
                    </div>
                </div>
                <div className="flex flex-row w-full h-auto items-center justify-center">
                    <div className="flex flex-col justify-center">
                        <span className="text-black text-sm">Buddy/Guy Best CSGO Player</span>
                    </div>
                </div>
                <div className="flex flex-row w-full h-auto items-center justify-center gap-3 mt-10">
                    <div className="flex flex-col">
                        <button type="button" className="text-white bg-sky-400 hover:bg-sky-700/90 focus:ring-4 focus:outline-none focus:ring-sky-700/50 font-small rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:focus:ring-sky-700/55">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            Profile
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <button type="button" className="text-white bg-sky-400 hover:bg-sky-700/90 focus:ring-4 focus:outline-none focus:ring-sky-700/50 font-small rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:focus:ring-sky-700/55">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
                            </svg>
                            Inbox
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <Link href="/api/auth/signout">
                            <button type="button" className="text-white bg-sky-400 hover:bg-sky-700/90 focus:ring-4 focus:outline-none focus:ring-sky-700/50 font-small rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:focus:ring-sky-700/55">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Sign Out
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

        )
    }

    return (
        <div className="flex flex-col w-full max-w-sm h-full border-2 border-black rounded-lg shadow-md bg-white">
            <div className="flex flex-row min-w-full justify-center my-auto">
                <div className="flex flex-col w-auto h-full p-3">
                    <Link href="/api/auth/signin/discord">
                        <button className="inline-flex items-center bg-sky-400 text-white text-lg font-semibold rounded-lg py-3 px-10">
                            Sign In With Discord
                            <svg stroke="white" xmlns="http://www.w3.org/2000/svg" fill="white" className="bi bi-discord ml-2 w-6 h-6" viewBox="0 0 16 16">
                                <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" fill="white"></path>
                            </svg>
                        </button>

                    </Link>
                </div>
            </div>
        </div>

    )
}
export default AuthBlock