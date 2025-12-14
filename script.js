document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    const API_URL = 'http://localhost:5000/api'; // URL de tu backend


    // --- Estado de la Aplicación ---
    let appState = {
        ejercicios: [],
        comidas: [],
        meditaciones: [],
        user: null
    };

    // --- Elementos de Autenticación y Vistas ---
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');
    const header = document.querySelector('header');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginLink = document.getElementById('show-login-link');

    // --- Elementos del DOM ---
    // Ejercicio
    const formEjercicio = document.getElementById('form-ejercicio');
    const tipoEjercicioInput = document.getElementById('tipo-ejercicio');
    const duracionEjercicioInput = document.getElementById('duracion-ejercicio');
    const fechaEjercicioInput = document.getElementById('fecha-ejercicio');
    const listaEjercicio = document.getElementById('lista-ejercicio');

    // Comidas
    const formComidas = document.getElementById('form-comidas');
    const fechaComidaInput = document.getElementById('fecha-comida');
    const descripcionComidaInput = document.getElementById('descripcion-comida');
    const caloriasComidaInput = document.getElementById('calorias-comida');
    const listaComidas = document.getElementById('lista-comidas');

    // Meditación
    const formMeditacion = document.getElementById('form-meditacion');
    const duracionMeditacionInput = document.getElementById('duracion-meditacion');
    const fechaMeditacionInput = document.getElementById('fecha-meditacion');
    const listaMeditacion = document.getElementById('lista-meditacion');

    // Panel de Resumen
    const totalEjercicioSpan = document.getElementById('total-ejercicio');
    const totalCaloriasSpan = document.getElementById('total-calorias');
    const totalMeditacionSpan = document.getElementById('total-meditacion');

    // Elementos de Suscripción
    const subscribePremiumBtn = document.getElementById('subscribe-premium-btn');
    const paymentModal = document.getElementById('payment-modal');
    const paymentForm = document.getElementById('payment-form');
    const closeModalBtn = document.querySelector('.close-modal-btn');


    // ------------------------------------------------------------------------
    // -------------------------- SECCIÓN IMC ---------------------------------
    // ------------------------------------------------------------------------

    const menuIMC = document.getElementById("menu-imc");
    const sectionIMC = document.getElementById("section-imc");
    const btnCalcularIMC = document.getElementById("btn-calcular-imc");
    const resultadoIMC = document.getElementById("resultado-imc");

    // Ocultar todas las secciones (ejercicios, comidas, meditación, IMC)
    function ocultarTodasLasSecciones() {
        document.querySelectorAll("section").forEach(sec => {
            sec.classList.add("hidden");
        });
    }

    // Acción al abrir IMC desde menú
    if (menuIMC) {
        menuIMC.addEventListener("click", () => {
            ocultarTodasLasSecciones();
            sectionIMC.classList.remove("hidden");
            hamburgerMenu.classList.add("hidden");
        });
    }

    // Lógica del cálculo de IMC
    // Lógica del cálculo de IMC
    const formIMC = document.getElementById("form-imc");
    let imcChart = null; // Variable global para la gráfica

    if (formIMC) {
        formIMC.addEventListener("submit", (e) => {
            e.preventDefault();
            const peso = Number(document.getElementById("peso-imc").value);
            const estatura = Number(document.getElementById("estatura-imc").value);

            if (!peso || !estatura) {
                resultadoIMC.textContent = "Por favor completa todos los campos.";
                return;
            }

            // Estatura en metros, no dividir por 100
            const imc = (peso / (estatura * estatura)).toFixed(2);

            let clasificacion = "";
            let color = "";

            // Logic for classification and color
            if (imc < 18.5) {
                clasificacion = "(Bajo peso)";
                color = "#3498db"; // Azul
            } else if (imc < 25) {
                clasificacion = "(Peso normal)";
                color = "#2ecc71"; // Verde
            } else if (imc < 30) {
                clasificacion = "(Sobrepeso)";
                color = "#f1c40f"; // Amarillo/Naranja
            } else {
                clasificacion = "(Obesidad)";
                color = "#e74c3c"; // Rojo
            }

            resultadoIMC.textContent = `Tu IMC es ${imc} ${clasificacion}`;

            // Render Chart
            const ctx = document.getElementById('imc-chart').getContext('2d');

            // Destruir gráfica anterior si existe
            if (imcChart) {
                imcChart.destroy();
            }

            // Plugin para dibujar la aguja
            const gaugeNeedle = {
                id: 'gaugeNeedle',
                afterDatasetDraw(chart, args, options) {
                    const { ctx, config, data, chartArea: { top, bottom, left, right, width, height } } = chart;

                    ctx.save();

                    const needleValue = options.value;
                    const dataTotal = data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const angle = Math.PI + (1 / dataTotal * needleValue * Math.PI);

                    const cx = width / 2;
                    const cy = chart._metasets[0].data[0].y;

                    // Calcular radio para el largo de la aguja
                    // Usamos el radio externo del primer segmento como referencia
                    const radius = chart._metasets[0].data[0].outerRadius;

                    // Dibujar la aguja
                    ctx.translate(cx, cy);
                    ctx.rotate(angle);
                    ctx.beginPath();
                    ctx.moveTo(0, -5); // Base un poco más ancha
                    ctx.lineTo(radius - 20, 0); // Largo basado en el radio
                    ctx.lineTo(0, 5);
                    ctx.fillStyle = '#444';
                    ctx.fill();

                    // Dibujar el punto central (pivote)
                    ctx.rotate(-angle); // Reset rotation
                    ctx.translate(-cx, -cy); // Reset translate
                    ctx.beginPath();
                    ctx.arc(cx, cy, 5, 0, 10);
                    ctx.fillStyle = '#444';
                    ctx.fill();
                    ctx.restore();
                }
            };

            imcChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Bajo', 'Normal', 'Sobrepeso', 'Obesidad'],
                    datasets: [{
                        data: [18.5, 6.5, 5, 20], // Suma = 50. Rangos: 0-18.5, 18.5-25, 25-30, 30-50
                        backgroundColor: [
                            '#3498db', // Bajo
                            '#2ecc71', // Normal
                            '#f1c40f', // Sobrepeso
                            '#e74c3c'  // Obesidad
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    rotation: -90,
                    circumference: 180,
                    layout: { padding: { bottom: 20 } },
                    plugins: {
                        tooltip: { enabled: false },
                        legend: { position: 'bottom' },
                        title: {
                            display: true,
                            text: `Tu IMC: ${imc}`,
                            font: { size: 16 }
                        },
                        gaugeNeedle: {
                            value: Math.min(Math.max(imc, 0), 50) // Clamp value between 0 and 50
                        }
                    }
                },
                plugins: [gaugeNeedle]
            });
        });
    }

    // Botón Volver al Inicio (IMC)
    const btnVolverIMC = document.getElementById("btn-volver-imc");
    if (btnVolverIMC) {
        btnVolverIMC.addEventListener("click", () => {
            sectionIMC.classList.add("hidden");
            // Mostrar secciones del dashboard
            document.getElementById("resumen-diario").classList.remove("hidden");
            document.getElementById("ejercicio").classList.remove("hidden");
            document.getElementById("comidas").classList.remove("hidden");
            document.getElementById("meditacion").classList.remove("hidden");
            document.getElementById("recomendaciones").classList.remove("hidden");
            document.getElementById("suscripcion").classList.remove("hidden");
        });
    }

    // ------------------------------------------------------------------------
    // ---------------------- AUTENTICACIÓN Y APP ------------------------------
    // ------------------------------------------------------------------------

    const checkLogin = () => {
        if (localStorage.getItem('token')) {
            showApp();
        } else {
            showLogin();
        }
    };

    const showApp = () => {
        authContainer.classList.add('hidden');
        loginBox.classList.add('hidden');
        appContainer.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        header.style.justifyContent = 'space-between';
        document.body.style.overflow = 'auto';
        setInitialDates();
        cargarTodosLosDatos();
        checkUserSubscription();
    };

    const showLogin = () => {
        authContainer.classList.remove('hidden');
        loginBox.classList.remove('hidden');
        registerBox.classList.add('hidden');
        appContainer.classList.add('hidden');
        logoutBtn.classList.add('hidden');
        header.style.justifyContent = 'center';
        document.body.style.overflow = 'hidden';
    };

    const showRegister = () => {
        loginBox.classList.add('hidden');
        registerBox.classList.remove('hidden');
    };

    // Modal de pago
    const openPaymentModal = () => {
        paymentModal.classList.add('visible');
    };
    const closePaymentModal = () => {
        paymentModal.classList.remove('visible');
    };

    const checkUserSubscription = () => {
        if (appState.user && appState.user.subscription === 'premium') {
            subscribePremiumBtn.textContent = 'Suscrito';
            subscribePremiumBtn.disabled = true;
        } else {
            subscribePremiumBtn.textContent = 'Obtener Premium';
            subscribePremiumBtn.disabled = false;
        }
    };

    // -------------------- API y funciones auxiliares -------------------------
    const setInitialDates = () => {
        fechaEjercicioInput.value = today;
        fechaComidaInput.value = today;
        fechaMeditacionInput.value = today;
    };

    const apiFetch = async (endpoint, options = {}) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (token) {
            headers['x-auth-token'] = token;
        }
        const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
        return response;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    };

    const cargarTodosLosDatos = async () => {
        try {
            const resUser = await apiFetch('/auth');
            if (!resUser.ok) throw new Error('Error al cargar datos del usuario');
            appState.user = await resUser.json();
            checkUserSubscription();

            const resEjercicios = await apiFetch('/exercises');
            if (!resEjercicios.ok) throw new Error('Error al cargar ejercicios');
            appState.ejercicios = await resEjercicios.json();
            renderizarLista(appState.ejercicios, listaEjercicio, crearElementoEjercicio, 'Añade tu primera rutina.');

            renderizarLista(appState.comidas, listaComidas, crearElementoComida, 'Registra tu primera comida.');
            renderizarLista(appState.meditaciones, listaMeditacion, crearElementoMeditacion, 'Añade tu primera sesión.');

            actualizarResumenDiario();
        } catch (error) {
            console.error(error);
            alert('No se pudieron cargar los datos del servidor.');
        }
    };

    const renderizarLista = (datos, listaElement, creadorDeElemento, emptyMessage) => {
        listaElement.innerHTML = '';
        if (datos.length === 0) {
            const li = document.createElement('li');
            li.className = 'empty-state';
            li.textContent = emptyMessage;
            listaElement.appendChild(li);
        } else {
            datos.forEach(item => {
                const elemento = creadorDeElemento(item, emptyMessage);
                listaElement.appendChild(elemento);
            });
        }
    };

    const eliminarDato = async (endpoint, id, elementoLi, emptyMessage) => {
        try {
            const res = await apiFetch(`/${endpoint}/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || 'Error al eliminar');
            }

            const listaElement = elementoLi.parentElement;
            elementoLi.remove();

            if (endpoint === 'exercises') {
                appState.ejercicios = appState.ejercicios.filter(item => item._id !== id);
            }

            if (listaElement.children.length === 0) {
                const li = document.createElement('li');
                li.className = 'empty-state';
                li.textContent = emptyMessage;
                listaElement.appendChild(li);
            }
            actualizarResumenDiario();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const crearElementoEjercicio = (ejercicio) => {
        const li = document.createElement('li');
        li.dataset.id = ejercicio._id;
        li.innerHTML = `
            <span>
                <small>${formatDate(ejercicio.fecha.split('T')[0])}</small> - 
                <strong>${ejercicio.tipo}</strong> (${ejercicio.duracion} min)
            </span>
            <button class="delete-btn" title="Eliminar">&times;</button>
        `;
        li.querySelector('.delete-btn').addEventListener('click', () => {
            eliminarDato('exercises', ejercicio._id, li, 'Añade tu primera rutina.');
        });
        return li;
    };

    const crearElementoComida = (comida) => {
        const li = document.createElement('li');
        const caloriasTexto = comida.calorias ? ` - ${comida.calorias} kcal` : '';
        li.innerHTML = `
            <span>
                <small>${formatDate(comida.fecha.split('T')[0])}</small> - 
                <strong>${comida.nombre}</strong>${caloriasTexto}
            </span>
            <button class="delete-btn">&times;</button>
        `;
        li.querySelector('.delete-btn').addEventListener('click', () => {
            eliminarDato('foods', comida._id, li, 'Registra tu primera comida.');
        });
        return li;
    };

    const crearElementoMeditacion = (meditacion) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>
                <small>${formatDate(meditacion.fecha.split('T')[0])}</small> - 
                <strong>Sesión</strong> (${meditacion.duracion} min)
            </span>
            <button class="delete-btn">&times;</button>
        `;
        li.querySelector('.delete-btn').addEventListener('click', () => {
            eliminarDato('meditations', meditacion._id, li, 'Añade tu primera sesión.');
        });
        return li;
    };

    const actualizarResumenDiario = () => {
        const todayStr = new Date().toISOString().split('T')[0];

        const totalEjercicio = appState.ejercicios
            .filter(e => e.fecha.startsWith(todayStr))
            .reduce((sum, e) => sum + Number(e.duracion), 0);
        totalEjercicioSpan.textContent = totalEjercicio;

        const totalCalorias = appState.comidas
            .filter(c => c.fecha.startsWith(todayStr))
            .reduce((sum, c) => sum + Number(c.calorias || 0), 0);
        totalCaloriasSpan.textContent = totalCalorias;

        const totalMeditacion = appState.meditaciones
            .filter(m => m.fecha.startsWith(todayStr))
            .reduce((sum, m) => sum + Number(m.duracion), 0);
        totalMeditacionSpan.textContent = totalMeditacion;
    };

    // Guardar ejercicio
    formEjercicio.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            tipo: tipoEjercicioInput.value,
            duracion: duracionEjercicioInput.value,
            fecha: fechaEjercicioInput.value
        };

        try {
            const res = await apiFetch('/exercises', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error al añadir ejercicio');
            }

            const ejercicio = await res.json();
            appState.ejercicios.unshift(ejercicio);
            renderizarLista(appState.ejercicios, listaEjercicio, crearElementoEjercicio, 'Añade tu primera rutina.');
            actualizarResumenDiario();

            formEjercicio.reset();
            fechaEjercicioInput.value = today;

        } catch (error) {
            alert(error.message);
        }
    });

    // Guardar comidas
    formComidas.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            fecha: fechaComidaInput.value,
            nombre: descripcionComidaInput.value,
            calorias: caloriasComidaInput.value
        };

        try {
            const res = await apiFetch('/foods', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error al añadir comida');
            }

            const comida = await res.json();
            appState.comidas.unshift(comida);
            renderizarLista(appState.comidas, listaComidas, crearElementoComida, 'Registra tu primera comida.');
            actualizarResumenDiario();

            formComidas.reset();
            fechaComidaInput.value = today;

        } catch (error) {
            alert(error.message);
        }
    });

    // Guardar meditaciones
    formMeditacion.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            duracion: duracionMeditacionInput.value,
            fecha: fechaMeditacionInput.value
        };

        try {
            const res = await apiFetch('/meditations', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al añadir meditación');
            }

            const meditacion = await res.json();
            appState.meditaciones.unshift(meditacion);
            renderizarLista(appState.meditaciones, listaMeditacion, crearElementoMeditacion, 'Añade tu primera sesión.');
            actualizarResumenDiario();

            formMeditacion.reset();
            fechaMeditacionInput.value = today;

        } catch (error) {
            alert(error.message);
        }
    });

    // LOGIN
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.elements[0].value;
        const password = e.target.elements[1].value;

        try {
            const res = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || 'Error al iniciar sesión');
            }

            const { token } = await res.json();
            localStorage.setItem('token', token);
            showApp();

        } catch (error) {
            alert(error.message);
        }
    });

    // LOGOUT
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        appState = { ejercicios: [], comidas: [], meditaciones: [], user: null };
        showLogin();
    });

    showRegisterBtn.addEventListener('click', showRegister);

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = e.target.elements[0].value;
        const email = e.target.elements[1].value;
        const password = e.target.elements[2].value;

        try {
            const res = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || 'Error en el registro');
            }

            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            showLogin();

        } catch (error) {
            alert(error.message);
        }
    });

    subscribePremiumBtn.addEventListener('click', openPaymentModal);
    closeModalBtn.addEventListener('click', closePaymentModal);

    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) closePaymentModal();
    });

    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const res = await apiFetch('/subscription/subscribe', {
                method: 'PUT'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || 'Error en la suscripción');
            }

            const { user } = await res.json();
            appState.user = user;
            closePaymentModal();
            alert('Pago exitoso. Ahora eres Premium.');
            checkUserSubscription();

        } catch (error) {
            alert(error.message);
        }
    });

    checkLogin();

    // ------------------------------------------------------------------------
    // ---------------------- MENÚ HAMBURGUESA --------------------------------
    // ------------------------------------------------------------------------

    const hamburgerBtn = document.getElementById("hamburger-btn");
    const hamburgerMenu = document.getElementById("hamburger-menu");

    hamburgerBtn.addEventListener("click", () => {
        hamburgerMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
        if (!hamburgerBtn.contains(e.target) && !hamburgerMenu.contains(e.target)) {
            hamburgerMenu.classList.add("hidden");
        }
    });

    const menuPerfil = document.getElementById("menu-perfil");
    const menuConfig = document.getElementById("menu-config");
    const menuAyuda = document.getElementById("menu-ayuda");

    menuPerfil.addEventListener("click", () => {
        alert("Perfil próximamente...");
        hamburgerMenu.classList.add("hidden");
    });

    menuConfig.addEventListener("click", () => {
        alert("Configuraciones próximamente...");
        hamburgerMenu.classList.add("hidden");
    });

    menuAyuda.addEventListener("click", () => {
        alert("Sección de ayuda próximamente...");
        hamburgerMenu.classList.add("hidden");
    });

});
