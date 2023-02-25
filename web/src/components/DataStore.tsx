import type { Data, Message } from '~/api/data'

const DataContext = createContext()
export type DataStore = [Data[],
  {
    addMessage: (uuid: string, message: Message) => void,
    addConversation: (uuid: string, title: string) => void
  }
]

export function DataProvider(props: any) {
  const [data, setData] = createStore([] as Data[])
  const store: DataStore = [
    data,
    {
      addMessage(uuid, message) {
        if (data.find((d) => d.id === uuid)) {
          setData(produce((data) => {
            data.find((d) => d.id === uuid)!.messages.unshift(message)
          }))
        }
      },
      addConversation(uuid, title) {
        setData(produce((data) => {
          data.push({ id: uuid, title, messages: [] })
        }))
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
