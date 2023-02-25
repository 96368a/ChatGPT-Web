import { getConversationsHistory } from '~/api'
import Typing from '~/components/chat/AiMessage'
import UserMessage from '~/components/chat/UserMessage'
import { useData } from '~/components/DataStore'


export default function Chat() {
    // 检查uuid是否合法
    const navigate = useNavigate()
    const [id, setId] = createSignal('')
    let {uuid} = useParams<{ uuid: string }>()
    if (!uuid||!/[a-z,0-9,-]{36}/.test(uuid)) {
        navigate('/')
    }
    setId(uuid)
    const location = useLocation();

// const pathname = createMemo(() => parsePath(location.pathname));
    createEffect(() => {
        console.log(location.pathname);
        let {uuid} = useParams<{ uuid: string }>()
        setId(uuid)
    })

    const [data, { addMessage }] = useData()

    onMount(() => {
        // 获取历史消息
        getConversationsHistory(uuid).then((res) => {
            const mapping = res.mapping
            const current_node = res.current_node
            // 获取最后一条消息，根据parent_id一直往上找，最后存入data
            let node = mapping[current_node]
            while(node){
                // 只存储用户消息和ai消息
                if(node.message&&node.message.author.role!=='system'){
                    addMessage(uuid, {
                        id: node.id,
                        msg: node.message.content.parts.toString(),
                        role: node.message.author.role,
                        parent: node.parent,
                    })
                }
                node = mapping[node.parent]
            }
        })
    })

    // 过滤出当前uuid的消息
    const messages = createMemo(() => {
        const d = data.filter((d) => d.id === uuid)
        if (d.length) {
            return d[0].messages
        }
        return []
    })

    return (
        <div class="flex-1 overflow-hidden">
            <div class="relative h-full dark:bg-gray-800">
                <div class="overflow-y-auto h-full w-full">
                    <For each={messages()}>
                        {(d, index) =>
                            <div class="flex flex-col items-center text-sm dark:bg-gray-800">
                                {d.role === 'user' && <UserMessage text={d.msg} />}
                                {d.role === 'assistant' && <Typing text={d.msg} speed={0} />}
                                <Show when={index() == messages().length - 1}>
                                    <div class="w-full h-32 md:h-48 flex-shrink-0"></div>
                                </Show>
                            </div>
                        }
                    </For>
                </div>
            </div>
        </div>
    )
}
