from itertools import product
from decimal import Decimal, getcontext

# Precisión decimal
getcontext().prec = 10

# Valores disponibles
valores = {
    "BONIFICACION": Decimal("1585.00"),
    "BONIFICACION POR PRODUCTIVIDAD": Decimal("627.00"),
    "BONO PRESTACION ECONOMICA ALTA RESPONSABILIDAD": Decimal("633.00"),
    "ASIGNACION FAMILIAR DL 728": Decimal("93.00"),
    "REMUNERACION": Decimal("1553.00"),
    "BONO NO REMUNERATIVO": Decimal("880.00")
}

# Monto objetivo
objetivo = Decimal("2510.20")

# Factores permitidos (0%, 40%, 50%, 60%, 100%)
factores = [
    Decimal("0"),
    Decimal("0.4"),
    Decimal("0.5"),
    Decimal("0.6"),
    Decimal("1")
]

nombres = list(valores.keys())
montos = list(valores.values())

print("Iniciando búsqueda de combinaciones...\n")

contador = 0

for combinacion in product(factores, repeat=len(montos)):
    suma = Decimal("0.00")

    for monto, factor in zip(montos, combinacion):
        suma += monto * factor

        # Poda temprana si se supera el objetivo
        if suma > objetivo:
            break

    if suma == objetivo:
        contador += 1
        print(f"Coincidencia #{contador}")
        for nombre, monto, factor in zip(nombres, montos, combinacion):
            if factor != 0:
                porcentaje = int(factor * 100)
                print(f"  {nombre}: {porcentaje}% -> {monto * factor}")
        print(f"  TOTAL: {suma}\n")

print(f"Búsqueda finalizada. Total de coincidencias encontradas: {contador}")
