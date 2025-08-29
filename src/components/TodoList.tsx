import React from 'react';
import { Check, Clock, AlertTriangle, Trash2, Cpu, Zap } from 'lucide-react';
import { TodoItem } from '../types';
import { formatDate, isOverdue } from '../utils/dateUtils';

interface TodoListProps {
  todos: TodoItem[];
  onUpdateTodo: (id: string, updates: Partial<TodoItem>) => void;
  onDeleteTodo: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onUpdateTodo,
  onDeleteTodo,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);

  if (todos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-slate-700 rounded-full blur-xl opacity-50"></div>
          <div className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border border-slate-600">
            <Cpu size={48} className="text-slate-500 mx-auto" />
          </div>
        </div>
        <p className="text-slate-400 text-xl font-bold font-tech uppercase tracking-wider">No Tasks Queued</p>
        <p className="text-slate-500 text-sm mt-2">Initialize your first task protocol</p>
      </div>
    );
  };

  const TodoItemComponent: React.FC<{ todo: TodoItem }> = ({ todo }) => {
    const overdue = todo.deadline && !todo.completed && isOverdue(todo.deadline);

    return (
      <div
        className={`glass-card p-5 rounded-lg border-2 transition-all duration-300 group hover:scale-[1.02] ${
          todo.completed
            ? 'border-emerald-400/30 hover:shadow-emerald-400/20'
            : overdue
            ? 'border-red-400/50 hover:shadow-red-400/20'
            : 'border-cyan-400/30 hover:shadow-cyan-400/20'
        }`}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={() => onUpdateTodo(todo.id, { completed: !todo.completed })}
            className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              todo.completed
                ? 'bg-gradient-to-r from-emerald-400 to-green-500 border-emerald-400 text-slate-900 neon-glow-green'
                : 'border-cyan-400 hover:border-cyan-300 hover:bg-cyan-400/10'
            }`}
          >
            {todo.completed && <Check size={14} className="font-bold" />}
          </button>

          <div className="flex-1">
            <h4
              className={`font-bold transition-all duration-200 font-tech ${
                todo.completed 
                  ? 'text-emerald-400 line-through opacity-75' 
                  : 'text-slate-200 group-hover:text-cyan-300'
              }`}
            >
              {todo.title}
            </h4>
            {todo.deadline && (
              <div className="flex items-center gap-2 mt-3">
                {overdue ? (
                  <AlertTriangle size={14} className="text-red-400" />
                ) : (
                  <Clock size={14} className="text-cyan-400" />
                )}
                <span
                  className={`text-sm font-medium uppercase tracking-wider ${
                    overdue ? 'text-red-400 neon-text' : 'text-slate-400'
                  }`}
                >
                  Deadline: {formatDate(todo.deadline)}
                  {overdue && ' [OVERDUE]'}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => onDeleteTodo(todo.id)}
            className="text-slate-500 hover:text-red-400 transition-colors duration-200 p-2 rounded-lg hover:bg-red-900/20 border border-transparent hover:border-red-400/30"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {pendingTodos.length > 0 && (
        <div>
          <h4 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-3 font-tech uppercase tracking-wider">
            <Zap size={20} />
            Active Tasks
            <span className="text-sm font-normal text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-600">
              {pendingTodos.length} queued
            </span>
          </h4>
          <div className="space-y-4">
            {pendingTodos.map(todo => (
              <TodoItemComponent key={todo.id} todo={todo} />
            ))}
          </div>
        </div>
      )}

      {completedTodos.length > 0 && (
        <div>
          <h4 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-3 font-tech uppercase tracking-wider">
            <Check size={20} />
            Completed Tasks
            <span className="text-sm font-normal text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-600">
              {completedTodos.length} executed
            </span>
          </h4>
          <div className="space-y-4">
            {completedTodos.map(todo => (
              <TodoItemComponent key={todo.id} todo={todo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};