export type ActionSuccess<T> = { success: true; data: T }
export type ActionError = { success: false; error: string; code?: string }
export type ActionResult<T> = ActionSuccess<T> | ActionError

export function ok<T>(data: T): ActionSuccess<T> {
  return { success: true, data }
}

export function err(error: string, code?: string): ActionError {
  return { success: false, error, code }
}
