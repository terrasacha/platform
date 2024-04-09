export const formatCurrency = (value, currency = null) => {
  let opcionesDeFormato = {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };
  if(currency) {
    opcionesDeFormato.style = "currency"
    opcionesDeFormato.currency = currency
  }

  return new Intl.NumberFormat('es-ES', opcionesDeFormato).format(value);
}