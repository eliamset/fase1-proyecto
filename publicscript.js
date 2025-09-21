// Guardar comidas (calorías)
document.getElementById('form-comidas').addEventListener('submit', async (e) => {
  e.preventDefault();

  const descripcion = document.getElementById('descripcion-comida').value;
  const calorias = document.getElementById('calorias-comida').value;
  const fecha = document.getElementById('fecha-comida').value;

  const res = await fetch('http://localhost:5000/api/meditations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ minutos: 0, calorias, fecha })
  });

  const data = await res.json();
  console.log("Respuesta comidas:", data);
  alert("Comida guardada ✅");
});

// Guardar meditaciones
document.getElementById('form-meditacion').addEventListener('submit', async (e) => {
  e.preventDefault();

  const minutos = document.getElementById('duracion-meditacion').value;
  const fecha = document.getElementById('fecha-meditacion').value;

  const res = await fetch('http://localhost:5000/api/meditations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ minutos, calorias: 0, fecha })
  });

  const data = await res.json();
  console.log("Respuesta meditacion:", data);
  alert("Meditación guardada ✅");
});
