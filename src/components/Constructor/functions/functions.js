export function validarString(str, regex) {
    // Crea una expresión regular
    
    // Comprueba si el string cumple con la expresión regular
    if (!regex.test(str)) {
        return 'Caracteres no permitidos'
    }
    return ''
  }