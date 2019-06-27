const express = require('express');
const server = express();

server.use(express.json());

var projects = [
    {id: "1", title: "Novo projeto 1", tasks: []},
    {id: "2", title: "Novo projeto 2", tasks: []},
    {id: "3", title: "Novo projeto 3", tasks: []},
    {id: "4", title: "Novo projeto 4", tasks: []},
];

var countReqs = 0;

server.use((req, res, next) => {
    
    countReqs += 1; 
    
    console.log(`Método ${req.method}; URL ${req.url}; Requisições feitas: ${countReqs}`);
    
    next();
});

function checkIdExist(req, res, next) {
    const { id } = req.params;
    if (!projects.findIndex(proj => proj.id == id)) {
        return res.json({ error: 'Id inexistente' });
    }

    return next();
}

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    }

    projects.push(project);
    return res.json(project);

});

server.put('/projects/:id', checkIdExist, (req, res) => {
    const { id } = req.params;
    const { title }= req.body;

    projects[id].title = title;
    
    return res.json(projects[id]);

});

server.delete('/projects/:id', checkIdExist, (req, res) => {
    const { id } = req.params;

    const index = projects.findIndex(proj => proj.id == id);

    projects.splice(index, 1);

    return res.send();
});

server.post('/projects/:id/tasks', checkIdExist, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const index = projects.findIndex(proj => proj.id == id);

    projects[index].tasks.push(title);

    return res.json(projects[index]);

});


server.listen(3000, () => { 
    console.log('Server listening on port 3000') 
});