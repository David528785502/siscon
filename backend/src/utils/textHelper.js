/**
 * Limpia caracteres con encoding incorrecto
 */
export const limpiarTexto = (texto) => {
  if (!texto) return texto;
  
  return texto
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, ''); // Eliminar caracteres no imprimibles
};