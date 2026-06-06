const dataInicio = document.querySelector('input[name="dataInicio"]');
const dataFim = document.querySelector('input[name="dataFim"]');

if (dataInicio && dataFim) {
  const hoje = new Date().toISOString().split("T")[0];
  dataInicio.setAttribute("min", hoje);

  dataInicio.addEventListener("change", function () {
    dataFim.setAttribute("min", dataInicio.value);
  });
}

setTimeout(function () {
  const alertas = document.querySelectorAll(".alert-error");
  alertas.forEach(function (el) {
    el.style.opacity = "0";
    el.style.transition = "opacity 0.5s";
    setTimeout(function () {
      el.remove();
    }, 500);
  });
}, 5000);
