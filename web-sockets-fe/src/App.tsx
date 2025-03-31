import { useEffect, useRef, useState } from 'react'
import { IoSend } from "react-icons/io5";


function App() {

  const [messages, setMessages] = useState(["hi there"]);
  //@ts-ignore
  const wsRef = useRef()
  //@ts-ignore
  const inputRef = useRef()

  function sendMessage(){
    //@ts-ignore
    wsRef.current.send(JSON.stringify({
      type: "chat",
      payload: {
        //@ts-ignore
        message: inputRef.current.value
      }
    }))
  }

  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:8080")
    ws.onmessage=(event)=>{
      setMessages(m => [...m, event.data])
    }
    //@ts-ignore
    wsRef.current = ws
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload:{
          roomId: "red"
        }
      }))
    }
    return () => {
      ws.close()
    }
  }, [])

  return (
    <div className='flex h-screen bg-black items-center justify-center'>
      <div className='bg-gray-900 w-[50%] h-[550px] p-3 flex flex-col  justify-center items-center rounded-2xl'>
        <div className='bg-black w-[100%] h-[95%] rounded-2xl p-3'>
          {
            messages.map((message)=>(
              <div className='rounded-xl w-[50%] text-white bg-gray-800 px-4 py-2 flex flex-col mb-3'>
                <p>{message}</p>
              </div>
            ))
          }
        </div>
        <div className='mt-2 w-full text-white border border-slate-600 rounded-2xl p-3 flex items-center group focus-within:border-slate-200'>
          <input ref={inputRef} className='w-full rounded-lg focus:outline-none' placeholder='Type Here...'/>
          <button onClick={sendMessage}>
            <IoSend className='text-2xl cursor-pointer ml-2'/>
          </button>
        </div>
      </div>  
    </div>
  )
}

export default App
