// store some constants

// re
export const regPsw = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#@!~%^$&*-])[a-zA-Z\d#@!~%^$&*-]{6,18}$/
export const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
export const regName = /^[a-z][0-9a-z_]{2,19}$/
export const regNname = /^\w{2,20}$/
export const regTag = /(?<=[\n|\r|\s])#(\w+)/g
