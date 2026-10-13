document.addEventListener('DOMContentLoaded', () => {
    const listaCursos = document.getElementById('lista-cursos');

    // Realiza una petición GET al endpoint de cursos de nuestra API backend
    fetch('/api/cursos')
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                listaCursos.innerHTML = '';
                if (result.data.length === 0) {
                    listaCursos.innerHTML = '<li>No hay cursos registrados.</li>';
                    return;
                }
                result.data.forEach(curso => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span class="badge">${curso.codigo}</span> <strong>${curso.nombre}</strong> — Créditos: ${curso.creditos}`;
                    listaCursos.appendChild(li);
                });
            } else {
                listaCursos.innerHTML = '<li>Error al obtener los datos de los cursos.</li>';
            }
        })
        .catch(error => {
            console.error('Error de conexión:', error);
            listaCursos.innerHTML = '<li>No se pudo conectar con el servidor backend.</li>';
        });
});