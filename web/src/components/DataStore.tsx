import type { Data, Message } from '~/api/data'

const DataContext = createContext()
export type DataStore = [Data[], { addConversations: (uuid: string, message: Message) => void }]

export function DataProvider(props: any) {
  const [data, setData] = createStore([] as Data[])
  const store: DataStore = [
    data,
    {
      addConversations(uuid, message) {
        if (!data.find((d) => d.conversation_id === uuid)) {
          setData(produce((data) => {
            data.push({ conversation_id: uuid, messages: [message] })
          }))
        }else{
          setData(produce((data) => {
            data.find((d) => d.conversation_id === uuid)!.messages.unshift(message)
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
