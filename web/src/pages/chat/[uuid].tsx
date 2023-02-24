import { getConversationsHistory } from '~/api'
import Typing from '~/components/chat/AiMessage'
import UserMessage from '~/components/chat/UserMessage'
import { useData } from '~/components/DataStore'


export default function Chat() {
    const navigate = useNavigate()
    const { uuid } = useParams<{ uuid: string }>()
    if (!uuid||!/[a-z,0-9,-]{36}/.test(uuid)) {
        navigate('/')
    }
    const [data, { addConversations }] = useData()
    onMount(() => {
        getConversationsHistory(uuid).then((res) => {
            const mapping = res.mapping
            const current_node = res.current_node
            let node = mapping[current_node]
            while(node){
                if(node.message&&node.message.author.role!=='system'){
                    console.log(node);
                    addConversations(uuid, {
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

    const messages = createMemo(() => {
        const d = data.filter((d) => d.conversation_id === uuid)
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
