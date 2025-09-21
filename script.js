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


    // --- Lógica de Autenticación (Simulada) ---
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
        document.body.style.overflow = 'auto'; // Permitir scroll en la app
        // Cargar datos y configurar la app
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
        document.body.style.overflow = 'hidden'; // Bloquear scroll en el login
    };

    const showRegister = () => {
        loginBox.classList.add('hidden');
        registerBox.classList.remove('hidden');
    };

    // --- Lógica del Modal de Pago ---
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


    // --- Funciones Auxiliares y de API ---
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
        const date = new Date(dateString + 'T00:00:00'); // Asegura la zona horaria local
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    };

    // --- Cargar y renderizar datos ---
    const cargarTodosLosDatos = async () => {
        try {
            // Cargar datos del usuario
            const resUser = await apiFetch('/auth');
            if (!resUser.ok) throw new Error('Error al cargar datos del usuario');
            appState.user = await resUser.json();
            checkUserSubscription();

            // Cargar Ejercicios
            const resEjercicios = await apiFetch('/exercises');
            if (!resEjercicios.ok) throw new Error('Error al cargar ejercicios');
            appState.ejercicios = await resEjercicios.json();
            renderizarLista(appState.ejercicios, listaEjercicio, crearElementoEjercicio, 'Añade tu primera rutina.');

            // TODO: Cargar Comidas y Meditaciones de forma similar cuando las rutas estén listas
            renderizarLista(appState.comidas, listaComidas, crearElementoComida, 'Registra tu primera comida.');
            renderizarLista(appState.meditaciones, listaMeditacion, crearElementoMeditacion, 'Añade tu primera sesión.');

            actualizarResumenDiario();
        } catch (error) {
            console.error(error);
            alert('No se pudieron cargar los datos del servidor.');
        }
    };

    const renderizarLista = (datos, listaElement, creadorDeElemento, emptyMessage) => {
        listaElement.innerHTML = ''; // Limpiar lista
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

            // Actualizar estado local
            if (endpoint === 'exercises') {
                appState.ejercicios = appState.ejercicios.filter(item => item._id !== id);
            }
            // TODO: Añadir lógica para 'meals' y 'meditations'

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

    // --- Creadores de Elementos de la Lista ---
    const crearElementoEjercicio = (ejercicio, emptyMessage) => {
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

    const crearElementoComida = (comida, emptyMessage) => {
    const li = document.createElement('li');
    li.dataset.id = comida._id;
    const caloriasTexto = comida.calorias ? ` - ${comida.calorias} kcal` : '';
    li.innerHTML = `
        <span>
            <small>${formatDate(comida.fecha.split('T')[0])}</small> - 
            <strong>${comida.nombre}</strong>${caloriasTexto}  <!-- 👈 usar "nombre" -->
        </span>
        <button class="delete-btn" title="Eliminar">&times;</button>
    `;
    li.querySelector('.delete-btn').addEventListener('click', () => {
        eliminarDato('foods', comida._id, li, 'Registra tu primera comida.');
    });
    return li;
};


    const crearElementoMeditacion = (meditacion, emptyMessage) => {
        const li = document.createElement('li');
        li.dataset.id = meditacion._id;
        li.innerHTML = `
            <span>
                <small>${formatDate(meditacion.fecha.split('T')[0])}</small> - 
                <strong>Sesión</strong> (${meditacion.duracion} min)
            </span>
            <button class="delete-btn" title="Eliminar">&times;</button>
        `;
        li.querySelector('.delete-btn').addEventListener('click', () => {
            eliminarDato('meditations', meditacion._id, li, 'Añade tu primera sesión.');
        });
        return li;
    };

    // --- Función de Resumen ---
    const actualizarResumenDiario = () => {
        const todayStr = new Date().toISOString().split('T')[0];

        // Calcular ejercicio
        const totalEjercicio = appState.ejercicios
            .filter(e => e.fecha.startsWith(todayStr))
            .reduce((sum, e) => sum + Number(e.duracion), 0);
        totalEjercicioSpan.textContent = totalEjercicio;

        // Calcular calorías
        const totalCalorias = appState.comidas
            .filter(c => c.fecha.startsWith(todayStr))
            .reduce((sum, c) => sum + Number(c.calorias || 0), 0);
        totalCaloriasSpan.textContent = totalCalorias;

        // Calcular meditación
        const totalMeditacion = appState.meditaciones
            .filter(m => m.fecha.startsWith(todayStr))
            .reduce((sum, m) => sum + Number(m.duracion), 0);
        totalMeditacionSpan.textContent = totalMeditacion;
    };

    // --- Event Listeners para los Formularios ---
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
                throw new Error(errorData.message || 'Error al añadir el ejercicio');
            }

            const ejercicioGuardado = await res.json();
            appState.ejercicios.unshift(ejercicioGuardado); // Añadir al principio
            renderizarLista(appState.ejercicios, listaEjercicio, crearElementoEjercicio, 'Añade tu primera rutina.');
            actualizarResumenDiario();

            formEjercicio.reset();
            fechaEjercicioInput.value = today;
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

   // --- Guardar comidas ---
formComidas.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = { 
        fecha: fechaComidaInput.value,
        nombre: descripcionComidaInput.value,   // 👈 usar "nombre" porque así lo pide tu modelo
        calorias: caloriasComidaInput.value 
    };

    try {
        const res = await apiFetch('/foods', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Error al añadir la comida');
        }

        const comidaGuardada = await res.json();
        appState.comidas.unshift(comidaGuardada);
        renderizarLista(appState.comidas, listaComidas, crearElementoComida, 'Registra tu primera comida.');
        actualizarResumenDiario();

        formComidas.reset();
        fechaComidaInput.value = today;
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});


// --- Guardar meditaciones ---
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
            throw new Error(errorData.error || 'Error al añadir la meditación');
        }

        const meditacionGuardada = await res.json();
        appState.meditaciones.unshift(meditacionGuardada); // añadir al principio
        renderizarLista(appState.meditaciones, listaMeditacion, crearElementoMeditacion, 'Añade tu primera sesión.');
        actualizarResumenDiario();

        formMeditacion.reset();
        fechaMeditacionInput.value = today;
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});



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
        // Cierra el modal si se hace clic en el fondo oscuro
        if (e.target === paymentModal) {
            closePaymentModal();
        }
    });

    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Aquí iría la lógica de validación de la tarjeta

        try {
            const res = await apiFetch('/subscription/subscribe', {
                method: 'PUT'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || 'Error en la suscripción');
            }

            const { user } = await res.json();
            appState.user = user; // Actualizar el estado del usuario
            closePaymentModal();
            alert('¡Pago exitoso! Gracias por suscribirte al Plan Premium.');
            checkUserSubscription();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    // --- Carga Inicial ---
    checkLogin();
});