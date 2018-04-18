const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

mongoose.connect('mongodb://localhost/newsletter');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//Schema de los elementos del newsletter

const elementSchema = {
		titulo: String,
    color: String,
    sumario: String,
    posicion: String,
    colorFondo: String,
    imagen: String,
    url: String
};

var Element = mongoose.model('Element', elementSchema);

app.set("view engine", "jade");

app.use(express.static("public"));

//Raiz del proyecto
app.get("/", function(req, res){
	Element.find(function(error, document){
		if(error){
			console.log('Ocurrió un error en la búsqueda de la base de datos');
		}
		res.render('admin/index', {elements: document});
	})
});

//Raiz del admin
app.get("/newsletter", function(req, res){
	Element.find(function(error, document){
		res.render('index', {elements: document});
	})
});

app.get("/new", function(req, res){
  res.render('admin/new');
});

//Creación de nuevo elemento
app.post("/new", function(req, res){

  var data = {
    titulo: req.body.titulo,
    color: req.body.color,
    sumario: req.body.sumario,
    posicion: req.body.posicion,
    colorFondo: req.body.colorFondo,
    imagen: req.body.imagen,
    url: req.body.url
  };

  var element = new Element(data);

  element.save(function(){
    res.redirect('/');
  });
});

//Editar elemento
app.get("/editar/:id", function(req, res){
	var id_elemento = req.params.id;
	Element.findOne({"_id": id_elemento}, function(error, documento){
		if(error){
			console.log('Error encontrando el elemento');
		}
		res.render('admin/edit', {element: documento})
	});
});

app.put("/:id", function(req, res){
	var data = {
    titulo: req.body.titulo,
    color: req.body.color,
    sumario: req.body.sumario,
    posicion: req.body.posicion,
    colorFondo: req.body.colorFondo,
    imagen: req.body.imagen,
    url: req.body.url
  };

  Element.update({'_id': req.params.id}, data, function(element){
		console.log('Elemento actualizado');
    res.redirect('/');
  });
});

//Eliminar elemento
app.get("/eliminar/:id", function(req, res){
	var id_elemento = req.params.id;
	Element.findOne({"_id": id_elemento}, function(error, documento){
		if(error){
			console.log('Error encontrando el elemento');
		}
		res.render('admin/delete', {element: documento})
	});
});

app.delete("/:id", function(req, res){
  Element.remove({'_id': req.params.id}, function(error){
		if (error) {
			console.log('Error eliminando el elemento');
		}
		console.log('Elemento eliminado');
    res.redirect('/');
  });
});

app.listen(8080);
