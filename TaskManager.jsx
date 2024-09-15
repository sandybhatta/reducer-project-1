// import React, { useReducer, useState } from "react";

// const initialState = { tasks: [], filter: "all" };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "ADD_TASK":
//       return { ...state, tasks: [...state.tasks, action.payload] };
//     case "TOGGLE_TASK":
//       return {
//         ...state,
//         tasks: state.tasks.map(task =>
//           task.id === action.payload
//             ? { ...task, completed: !task.completed }
//             : task
//         ),
//       };
//     case "DELETE_TASK":
//       return {
//         ...state,
//         tasks: state.tasks.filter(task => task.id !== action.payload),
//       };
//     case "SET_FILTER":
//       return { ...state, filter: action.payload };
//     default:
//       return state;
//   }
// };

// const TaskManager = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const [taskText, setTaskText] = useState("");

//   const addTask = () => {
//     dispatch({ type: "ADD_TASK", payload: { id: Date.now(), text: taskText, completed: false } });
//     setTaskText("");
//   };

//   const filteredTasks = state.tasks.filter(task => {
//     if (state.filter === "completed") return task.completed;
//     if (state.filter === "pending") return !task.completed;
//     return true;
//   });

//   return (
//     <div>
//       <h2>Task Manager</h2>
//       <input value={taskText} onChange={e => setTaskText(e.target.value)} />
//       <button onClick={addTask}>Add Task</button>

//       <div>
//         {filteredTasks.map(task => (
//           <div key={task.id}>
//             <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
//               {task.text}
//             </span>
//             <button onClick={() => dispatch({ type: "TOGGLE_TASK", payload: task.id })}>
//               Toggle
//             </button>
//             <button onClick={() => dispatch({ type: "DELETE_TASK", payload: task.id })}>
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>

//       <div>
//         <button onClick={() => dispatch({ type: "SET_FILTER", payload: "all" })}>All</button>
//         <button onClick={() => dispatch({ type: "SET_FILTER", payload: "completed" })}>
//           Completed
//         </button>
//         <button onClick={() => dispatch({ type: "SET_FILTER", payload: "pending" })}>
//           Pending
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TaskManager;



// Another task mananger with undo Action
import React, { useReducer, useState } from 'react';

const initialState = {
  tasks: [],
  lastAction: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        lastAction: { type: 'ADD_TASK', payload: action.payload },
      };

    case 'TOGGLE_TASK':
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task
      );
      return {
        ...state,
        tasks: updatedTasks,
        lastAction: { type: 'TOGGLE_TASK', payload: action.payload },
      };

    case 'DELETE_TASK':
      const taskToDelete = state.tasks.find(task => task.id === action.payload);
      const remainingTasks = state.tasks.filter(task => task.id !== action.payload);
      return {
        ...state,
        tasks: remainingTasks,
        lastAction: { type: 'DELETE_TASK', payload: taskToDelete }, // Store the entire task object
      };

    case 'UNDO_ACTION':
      if (state.lastAction) {
        switch (state.lastAction.type) {
          case 'ADD_TASK':
            return {
              ...state,
              tasks: state.tasks.filter(task => task.id !== state.lastAction.payload.id),
            };
          case 'DELETE_TASK':
            return {
              ...state,
              tasks: [...state.tasks, state.lastAction.payload], // Re-add the deleted task
            };
          default:
            return state;
        }
      }
      return state;

    default:
      return state;
  }
}

const TaskManager = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [inputValue, setInputValue] = useState('');

  const addTask = () => {
    const newTask = { id: Date.now(), task: inputValue, completed: false };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    setInputValue('');
  };

  const undoAction = () => {
    dispatch({ type: 'UNDO_ACTION' });
  };

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="New Task"
      />
      <button onClick={addTask}>Add Task</button>
      <button onClick={undoAction}>Undo Last Action</button>
      <ul>
        {state.tasks.map(task => (
          <li key={task.id}>
            {task.task} - {task.completed ? 'Completed' : 'Pending'}
            <button onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}>
              Toggle
            </button>
            <button onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;