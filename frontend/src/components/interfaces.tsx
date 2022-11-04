
export interface NotifyInter{
    isOpen:boolean, 
    message: string,
    type: any,
}

export interface NotifyInterUse{
    notify: NotifyInter,
    setNotify: any,
}

export const Severity = {
    error: "error",
    warning: "warning",
    info: "info",
    success: "success",
}
