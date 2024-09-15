import React, { useReducer, useState } from 'react'
const initialState={
    task:[],
    lastkaam:null
}
function reducerFn(state,action){
    switch(action.type){
        case 'adding':
            
            return {
                
                task:[...state.task,action.payload],
                lastkaam:{type:'adding-hua-tha',payload:action.payload}
            }
        
            
        case 'toggle':
            return{
                ...state,
                task:state.task.map(t=>
                    t.id===action.payload ? { ...t,
                        completed:!t.completed  }: t
                )
            }
         case 'delete':
               return {
                ...state,
                task:state.task.filter(t=>t.id!==action.payload),
                lastkaam:{type:'delete-hua-tha', payload:state.task.filter(t=>t.id===action.payload)}
               }
        case 'undo':
            if(state.lastkaam){
                switch(state.lastkaam.type){
                    case 'adding-hua-tha':
                        return {
                            ...state,
                            task:state.task.filter(t=>t.id !== state.lastkaam.payload.id)
                        }
                    case 'delete-hua-tha': 
                    return {
                        ...state,
                        task:[...state.task,  state.lastkaam.payload[0]]
                    }
                default :return state
                }
            }return state
        default : return state
    }
}
const TaskManagerUndo = () => {
    const [state, dispatch] = useReducer(reducerFn,initialState)
    const [inputValue, setinputValue] = useState('')
  return (
    <div>
        <input type='text' value={inputValue} onChange={(e)=>setinputValue(e.target.value)} />
        <button onClick={()=>
            {dispatch({
                type:"adding",
                payload:{id:Date.now(),
                item:inputValue,
                completed:false}
            })
            setinputValue('')}
        }> Add item</button>
        <button onClick={()=>dispatch({type:'undo'})}>undo last action</button>


    
        <ul>
        {state.task.map(t=>(
            <li key={t.id}>
                {t.item}--------{t.completed? 'finish ho gya': 'baaki hai'}
                <button onClick={()=> dispatch({type:'toggle', payload:t.id})}> toggle kijiye</button>
                <button onClick={()=> dispatch({type:'delete', payload:t.id})}> Delete kijiye</button>
            </li>
        ))}
        </ul>
        

    </div>
  )
}

export default TaskManagerUndo