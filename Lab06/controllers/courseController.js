const courses = require('../data/coursesData');

exports.getAllCourses = (req, res) => {
  let result = courses;
  const { creditos } = req.query;

  if (creditos) {
    result = courses.filter(c => c.creditos === parseInt(creditos));
  }

  res.status(200).json({
    status: 'success',
    results: result.length,
    data: result
  });
};

exports.getCourseById = (req, res) => {
  const courseId = parseInt(req.params.id);
  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return res.status(404).json({
      status: 'fail',
      message: 'Curso no encontrado'
    });
  }

  res.status(200).json({
    status: 'success',
    data: course
  });
};

exports.createCourse = (req, res) => {
  const { nombre, codigo, creditos } = req.body;

  if (!nombre || !codigo || !creditos) {
    return res.status(400).json({
      status: 'fail',
      message: 'Faltan campos obligatorios (nombre, codigo, creditos)'
    });
  }

  const newCourse = {
    id: courses.length > 0 ? courses[courses.length - 1].id + 1 : 1,
    codigo,
    nombre,
    creditos: parseInt(creditos)
  };

  courses.push(newCourse);

  res.status(201).json({
    status: 'success',
    data: newCourse
  });
};

exports.updateCourse = (req, res) => {
  const courseId = parseInt(req.params.id);
  const courseIndex = courses.findIndex(c => c.id === courseId);

  if (courseIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Curso no encontrado para actualizar'
    });
  }

  const { nombre, codigo, creditos } = req.body;

  courses[courseIndex] = {
    id: courseId,
    codigo: codigo || courses[courseIndex].codigo,
    nombre: nombre || courses[courseIndex].nombre,
    creditos: creditos ? parseInt(creditos) : courses[courseIndex].creditos
  };

  res.status(200).json({
    status: 'success',
    data: courses[courseIndex]
  });
};

exports.deleteCourse = (req, res) => {
  const courseId = parseInt(req.params.id);
  const courseIndex = courses.findIndex(c => c.id === courseId);

  if (courseIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Curso no encontrado para eliminar'
    });
  }

  courses.splice(courseIndex, 1);

  res.status(200).json({
    status: 'success',
    message: 'Curso eliminado correctamente'
  });
};