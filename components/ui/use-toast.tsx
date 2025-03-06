"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

export type ToastActionElement = React.ReactElement<{
  className?: string
  onMouseDown: React.MouseEventHandler
  altText: string
}>

export type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive"
  onOpenChange?: (open: boolean) => void
}

type ActionType = {
  ADD_TOAST: "ADD_TOAST";
  UPDATE_TOAST: "UPDATE_TOAST";
  DISMISS_TOAST: "DISMISS_TOAST";
  REMOVE_TOAST: "REMOVE_TOAST";
};

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}


type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToastProps
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToastProps>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToastProps[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                onOpenChange: (open: boolean) => {
                  if (!open) {
                    dispatch({ type: "DISMISS_TOAST", toastId: t.id })
                  }
                },
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToastProps, "id"> & {
  id?: string
}

function toast({ ...props }: Toast) {
  const id = props.id || genId()

  const update = (props: ToastProps) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
    Toaster: Toaster,
  }
}

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = React.useState<ToastProps[]>([])
  
    React.useEffect(() => {
      // Create a compatible listener function
      const listener = (state: State) => {
        setToasts(state.toasts)
      }
      
      listeners.push(listener)
      
      return () => {
        const index = listeners.indexOf(listener)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    }, [])
  
    return (
      <Toast.Provider>
        {children}
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast.Root key={id} {...props}>
              <div className="grid gap-1">
                {title && <Toast.Title>{title}</Toast.Title>}
                {description && (
                  <Toast.Description>{description}</Toast.Description>
                )}
              </div>
              {action}
              <Toast.Close />
            </Toast.Root>
          )
        })}
        <Toast.Viewport />
      </Toast.Provider>
    )
  }
  
  /* -------------------------------------------------------------------------------------------------
   * Toast
   * -----------------------------------------------------------------------------------------------*/
  
  const Toast = {
    Provider: ToastProvider,
    Viewport: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
      <ol
        className={cn(
          "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
          className
        )}
        {...props}
      />
    ),
    Root: ({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLLIElement> & { variant?: "default" | "destructive" }) => (
      <li
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full mt-4 bg-background border",
          className,
          variant === "default" && "border-border",
          variant === "destructive" && "border-destructive bg-destructive text-destructive-foreground"
        )}
        {...props}
      />
    ),
    Title: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={cn("text-sm font-semibold", className)} {...props} />
    ),
    Description: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={cn("text-sm opacity-90", className)} {...props} />
    ),
    Close: ({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) => (
      <button
        className={cn(
          "absolute right-2 top-2 rounded-md p-1",
          "text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 group-hover:opacity-100",
          className
        )}
        toast-close=""
        aria-label="Close"
        {...props}
      >
        <X className="h-4 w-4" />
      </button>
    ),
  }
  
  const Toaster = () => {
    const { toasts } = useToast()
  
    return (
      <Toast.Provider>
        {toasts.map(({ id, title, description, action, ...props }) => {
          return (
            <Toast.Root key={id} {...props}>
              <div className="grid gap-1">
                {title && <Toast.Title>{title}</Toast.Title>}
                {description && (
                  <Toast.Description>{description}</Toast.Description>
                )}
              </div>
              {action}
              <Toast.Close />
            </Toast.Root>
          )
        })}
        <Toast.Viewport />
      </Toast.Provider>
    )
  }
  
  export { Toaster, useToast }