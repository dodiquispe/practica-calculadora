const pantallaAnterior = document.getElementById("previousOperand");
const pantallaActual = document.getElementById("currentOperand");
const botonesNumero = document.querySelectorAll(".number");
const botonesOperador = document.querySelectorAll(".operator");
const botonesReset = document.querySelectorAll(".reset");

const calculadora = {
  operandoActual: "0",
  operandoAnterior: "",
  operador: undefined,
  limpiarTodo() {
    this.operandoActual = "0";
    this.operandoAnterior = "";
    this.operador = undefined;
  },

  borrarUltimo() {
    this.operandoActual = this.operandoActual.slice(0, -1);
    if (this.operandoActual === "") this.operandoActual = "0";
  },

  agregarNumero(numero) {
    if (numero === "." && this.operandoActual.includes(".")) return;
    if (this.operandoActual === "0" && numero !== ".") {
      this.operandoActual = numero;
    } else {
      this.operandoActual += numero;
    }
  },

  elegirOperador(operador) {
    switch (operador) {
      case "sign":
        this.operandoActual = (parseFloat(this.operandoActual) * -1).toString();
        break;
      case "percentage":
        this.operandoActual = (
          parseFloat(this.operandoActual) / 100
        ).toString();
        break;
      case "equals":
        this.calcular();
        break;
      default:
        if (this.operandoActual === "") return;
        if (this.operandoAnterior !== "") {
          this.calcular();
        }
        this.operador = operador;
        this.operandoAnterior = this.operandoActual;
        this.operandoActual = "";
        break;
    }
  },
  calcular() {
    const numeroAnterior = parseFloat(this.operandoAnterior);
    const numeroActual = parseFloat(this.operandoActual);

    if (isNaN(numeroAnterior) || isNaN(numeroActual)) return;

    let resultado;
    switch (this.operador) {
      case "add":
        resultado = numeroAnterior + numeroActual;
        break;
      case "subtract":
        resultado = numeroAnterior - numeroActual;
        break;
      case "multiply":
        resultado = numeroAnterior * numeroActual;
        break;
      case "divide":
        if (numeroActual === 0) {
          this.limpiarTodo();
          this.operandoActual = "Error";
          return;
        }
        resultado = numeroAnterior / numeroActual;
        break;
      default:
        return;
    }
    this.operandoActual = resultado.toString();
    this.operador = undefined;
    this.operandoAnterior = "";
  },
  formatearNumero(numero) {
    const numeroTexto = numero.toString();
    const parteEntera = parseFloat(numeroTexto.split(".")[0]);
    const parteDecimal = numeroTexto.split(".")[1];
    let enteraFormateada;
    if (isNaN(parteEntera)) {
      enteraFormateada = "";
    } else {
      enteraFormateada = parteEntera.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    return parteDecimal != null
      ? `${enteraFormateada}.${parteDecimal}`
      : enteraFormateada;
  },
  obtenerSimboloOperador(operador) {
    switch (operador) {
      case "add":
        return "+";
      case "subtract":
        return "-";
      case "multiply":
        return "×";
      case "divide":
        return "/";
      default:
        return "";
    }
  },
  actualizarPantalla() {
    pantallaActual.innerText = this.formatearNumero(this.operandoActual);
    if (this.operador != null) {
      pantallaAnterior.innerText = `${this.formatearNumero(this.operandoAnterior)} ${this.obtenerSimboloOperador(this.operador)}`;
    } else {
      pantallaAnterior.innerText = "";
    }
  },
};

botonesNumero.forEach((button) => {
  button.addEventListener("click", () => {
    calculadora.agregarNumero(button.innerText);
    calculadora.actualizarPantalla();
  });
});

botonesOperador.forEach((button) => {
  button.addEventListener("click", () => {
    calculadora.elegirOperador(button.value);
    calculadora.actualizarPantalla();
  });
});

botonesReset.forEach((button) => {
  button.addEventListener("click", () => {
    switch (button.dataset.action) {
      case "clear":
        calculadora.limpiarTodo();
        break;
      case "delete":
        calculadora.borrarUltimo();
        break;
    }
    calculadora.actualizarPantalla();
  });
});

calculadora.actualizarPantalla();
