const express = require('express');
const router = express.Router();
const mongojs = require('mongojs');
const db = mongojs('mongodb://diegocmsantos:qwe123*@ds151078.mlab.com:51078/meantodos_maia', ['todos']);

// Get Todos
router.get('/todos', function(req, res, next) {
  db.todos.find(function(err, todos) {
    if (err) {
      res.send(err);
    } else {
      res.json(todos);
    }
  })
});

// Get Single Todo
router.get('/todo/:id', function(req, res, next) {
  db.todos.findOne({
      _id: mongojs.ObjectId(req.params.id)}, 
    function(err, todos) {
      if (err) {
        res.send(err);
      } else {
        res.json(todos);
      }
  });
});

// Save Single Todo
router.post('/todo', function(req, res, next) {

  const todo = req.body;

  // some validation
  if (!todo.text || !(todo.isCompleted + '')) {
    res.status(400);
    res.json({
      "error": "Invalid Data"
    });
  } else {
    db.todos.save(todo, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  }
});

// Update Single Todo
router.put('/todo/:id', function(req, res, next) {

  const todo = req.body;
  const updObj = {};

  if (todo.isCompleted) {
    updObj.isCompleted = todo.isCompleted;
  }

  if (todo.text) {
    updObj.text = todo.text;
  }

  if (!updObj) {
    res.status(400).json({"error": "Invalid Data"});
  } else {
    db.todos.update({
      _id: mongojs.ObjectId(req.params.id)
    }, updObj, {}, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  }

});

// Delete Single Todo
router.delete('/todo/:id', function(req, res, next) {

  db.todos.remove({
    _id: mongojs.ObjectId(req.params.id)
  }, '', function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });

});

module.exports = router;