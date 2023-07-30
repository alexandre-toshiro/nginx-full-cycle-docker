const express = require('express');
const app = express();
const port = 3000;

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql');
const connection = mysql.createConnection(config);

const createTable = `
CREATE TABLE IF NOT EXISTS people (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(50), PRIMARY KEY (id));
`;
connection.query(createTable);

const insertNames = `
INSERT INTO people (name) values ('Julio Cesar'), ('Agostinho'), ('Alexandre'), ('Eurípedes');
`;

connection.query(insertNames);


app.get('/', async (req, res) => {
  const selectSql = `SELECT * FROM people`;

  const getPeople = () => {
    return new Promise((resolve, reject) => {
      connection.query(selectSql, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };

  try {
    const people = await getPeople();

    const title = '<h1>Full Cycle Rocks!</h1>';
    const list = `
      <ul>
        ${people.map(p => `<li>${p.name}</li>`).join('')}
      </ul>
    `;

    res.send(title + list);
  } catch (error) {
    console.error('Erro ao obter as pessoas:', error);
  }
});

app.listen(port, ()=> {
    console.log('Rodando na porta ' + port)
});