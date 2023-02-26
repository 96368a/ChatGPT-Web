import type { Data, Message } from '~/api/data'

const DataContext = createContext()
export type DataStore = [Data[],
  {
    addMessage: (uuid: string, message: Message) => void,
    addMessages: (uuid: string, messages: Message[]) => void,
    addConversation: (uuid: string, title: string) => void,
    setMessage: (uuid: string,msg_id: string, message: Message) => void,
  }
]

export function DataProvider(props: any) {
  const [data, setData] = createStore<Data[]>([])
  const store: DataStore = [
    data,
    {
      addMessage(uuid, message) {
        if (data.find((d) => d.id === uuid)) {
          setData(produce((data) => {
            data.find((d) => d.id === uuid)!.messages.push(message)
          }))
        }
      },
      addMessages(uuid, messages) {
        if (data.find((d) => d.id === uuid)) {
          setData(produce((data) => {
            data.find((d) => d.id === uuid)!.messages.push(...messages)
          }))
        }
      },
      addConversation(uuid, title) {
        setData(produce((data) => {
          data.push({ id: uuid, title, messages: [] })
        }))
      },
      setMessage(uuid,msg_id, message) {
        if (data.find((d) => d.id === uuid)) {
          setData(produce((data) => {
            if(data.find((d) => d.id === uuid)!.messages.find((m) => m.id === msg_id)){
              let index = data.find((d) => d.id === uuid)!.messages.findIndex((m) => m.id === msg_id)
              if(index!==-1){
                data.find((d) => d.id === uuid)!.messages[index] = message
              }
            }
          }))
        }
      }
    },
  ]

  return (
    <DataContext.Provider value={store}>
      {props.children}
    </DataContext.Provider>
  )
}

export function useData() { return useContext(DataContext) as DataStore }
