document.addEventListener("DOMContentLoaded", () => {
  const text = "¡Hola! Soy Ana San Segundo García";
  let i = 0;
  const speed = 100;

  function typeWriter() {
    const target = document.getElementById("typing");
    if (!target) return; // seguridad por si no encuentra el h1

    if (i < text.length) {
      target.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  typeWriter(); // inicia la escritura cuando el DOM está listo
});
