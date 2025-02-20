import * as React from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
} from "@/components/ui/toast"

interface ToasterToast extends ToastProps {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
}

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])

  const addToast = React.useCallback(
    ({ title, description, ...props }: Omit<ToasterToast, "id">) => {
      setToasts((currentToasts) => {
        const id = Math.random().toString(36).substring(2, 9)
        return [...currentToasts, { id, title, description, ...props }]
      })
    },
    []
  )

  const dismissToast = React.useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    )
  }, [])

  const Toaster = React.memo(() => {
    return (
      <ToastProvider>
        {toasts.map(({ id, title, description, action, ...props }) => (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose onClick={() => dismissToast(id)} />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    )
  })
  Toaster.displayName = "Toaster"

  return {
    toast: addToast,
    dismiss: dismissToast,
    Toaster: Toaster,
  }
}