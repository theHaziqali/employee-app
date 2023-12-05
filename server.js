const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const port = 3001;
const jsonFilePath = './employees.json';

app.use(bodyParser.json());

app.get('/api/employees', async (req, res) => {
  try {
    const data = await readJsonFile();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/employees/:id', async (req, res) => {
  try {
    const data = await readJsonFile();
    const employeeId = req.params.id;
    const employee = data.find((emp) => emp.id === employeeId);

    if (employee) {
      res.header('Content-Type', 'application/json').json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const data = await readJsonFile();
    const newEmployee = req.body;

    // If the employee has an ID, update the existing employee
    if (newEmployee.id) {
      const index = data.findIndex((emp) => emp.id === newEmployee.id);
      if (index !== -1) {
        data[index] = newEmployee;
        await writeJsonFile(data);
        res.json(newEmployee);
        return;
      }
    }

    // If the employee doesn't have an ID, add a new employee
    newEmployee.id = generateUniqueId();
    data.push(newEmployee);
    await writeJsonFile(data);
    res.header('Content-Type', 'application/json').json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// PUT route to update an existing employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    const data = await readJsonFile();
    const employeeId = req.params.id;
    const updatedEmployeeData = req.body;

    const index = data.findIndex((emp) => emp.id === employeeId);
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedEmployeeData };
      await writeJsonFile(data);
      res.header('Content-Type', 'application/json').json(data[index]);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error updating employee data', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const data = await readJsonFile();
    const employeeId = req.params.id;
    const index = data.findIndex((emp) => emp.id === employeeId);

    if (index !== -1) {
      const deletedEmployee = data.splice(index, 1)[0];
      await writeJsonFile(data);
      res.json(deletedEmployee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function readJsonFile() {
  const data = await fs.readFile(jsonFilePath, 'utf8');
  return JSON.parse(data);
}

async function writeJsonFile(data) {
  await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
}

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}
