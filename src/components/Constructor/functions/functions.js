export function validarString(str, regex) {
    if (!regex.test(str)) {
        return 'Caracteres no permitidos'
    }
    return ''
  }