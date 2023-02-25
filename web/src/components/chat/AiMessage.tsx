import Icon from './Icon'
import '~/styles/typing.css'

export default function (props:{text:string,speed:number}) {
    // let text = "今天主要的工作内容是熟悉项目的结构与代码。通过对代码的深入学习，我对项目的整体框架有了更清晰的认识，并对其中的一些细节问题进行了修复。在代码中发现了一些潜在的问题，并针对这些问题提出了一些改进的建议，以便于提高项目的效率和可维护性。在工作中，我与同事紧密协作，共同解决了一些技术难题，提升了团队的整体效率。通过今天的工作，我对项目有了更深入的理解，并为以后的开发工作打下了良好的基础。"
    // const speed = 10;
    const [local, others]  = splitProps(props, ['text', 'speed'])
    const [typing, setTyping] = createSignal(false)
    const [index, setIndex] = createSignal(0)
    createEffect(() => {
        if (local.text.length===0) {
            setTyping(true)
            return
        }
        if (local.speed === 0) {
            setIndex(local.text.length)
        } else {
            setTyping(true)
            const typingInterval = setInterval(() => {
                if (index() === local.text.length) {
                    clearInterval(typingInterval)
                    setTyping(false)
                    return
                }
                setIndex(index() + 1)
            }, local.speed)
        }
    })

    return (
        <div
            class="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]">
            <div
                class="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
                <Icon />
                <div class="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                    <div class="flex flex-grow flex-col gap-3">
                        <div class="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                            <div class="markdown prose w-full break-words dark:prose-invert light">
                                <p class="" classList={{ typing: typing() }}>
                                    {local.text.substring(0, index())}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <div
                            class="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-3 md:gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible">
                            <button
                                class="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"><svg
                                    stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
                                    stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em"
                                    width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3">
                                    </path>
                                </svg></button><button
                                    class="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"><svg
                                        stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"
                                        stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em"
                                        width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17">
                                    </path>
                                </svg></button></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
