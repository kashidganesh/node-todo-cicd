const express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    sanitizer = require('sanitizer'),
    path = require('path'), // ✅ Added for view path
    app = express(),
    port = 8000;

// ✅ Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Support for PUT via POST
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

let todolist = [];

/* The to-do list and the form are displayed */
app.get('/todo', function (req, res) {
    res.render('todo.ejs', {
        todolist,
        clickHandler: "func1();"
    });
})

/* Adding an item to the to-do list */
.post('/todo/add/', function (req, res) {
    let newTodo = sanitizer.escape(req.body.newtodo);
    if (req.body.newtodo != '') {
        todolist.push(newTodo);
    }
    res.redirect('/todo');
})

/* Deletes an item from the to-do list */
.get('/todo/delete/:id', function (req, res) {
    if (req.params.id != '') {
        todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

/* Get a single todo item and render edit page */
.get('/todo/:id', function (req, res) {
    let todoIdx = req.params.id;
    let todo = todolist[todoIdx];

    if (todo) {
        res.render('edititem.ejs', {
            todoIdx,
            todo,
            clickHandler: "func1();"
        });
    } else {
        res.redirect('/todo');
    }
})

/* Edit item in the to-do list */
.put('/todo/edit/:id', function (req, res) {
    let todoIdx = req.params.id;
    let editTodo = sanitizer.escape(req.body.editTodo);
    if (todoIdx != '' && editTodo != '') {
        todolist[todoIdx] = editTodo;
    }
    res.redirect('/todo');
})

/* Redirects to the to-do list if the page requested is not found */
.use(function (req, res, next) {
    res.redirect('/todo');
})

.listen(port, function () {
    console.log(`Todolist running on http://0.0.0.0:${port}`);
});

// Export app for testing
module.exports = app;
