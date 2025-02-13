import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Papa from 'papaparse';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const assignSecretSanta = (employees, previousAssignments = []) => {
  const shuffledEmployees = shuffleArray([...employees]);
  const assignments = [];
  const used = new Set();

  for (let i = 0; i < employees.length; i++) {
    const santa = employees[i];
    let childIndex = -1;

    for (let j = 0; j < shuffledEmployees.length; j++) {
      const potentialChild = shuffledEmployees[j];
      const previousAssignment = previousAssignments.find(
        assignment => assignment.Employee_EmailID === santa.Employee_EmailID
      );

      const isValid = 
        potentialChild.Employee_EmailID !== santa.Employee_EmailID &&
        !used.has(potentialChild.Employee_EmailID) &&
        (!previousAssignment || 
         previousAssignment.Secret_Child_EmailID !== potentialChild.Employee_EmailID);

      if (isValid) {
        childIndex = j;
        break;
      }
    }

    if (childIndex === -1) return assignSecretSanta(employees, previousAssignments);

    const child = shuffledEmployees[childIndex];
    used.add(child.Employee_EmailID);
    
    assignments.push({
      Employee_Name: santa.Employee_Name,
      Employee_EmailID: santa.Employee_EmailID,
      Secret_Child_Name: child.Employee_Name,
      Secret_Child_EmailID: child.Employee_EmailID
    });
  }

  return assignments;
};

const SecretSantaGame = () => {
  const [currentEmployees, setCurrentEmployees] = useState([]);
  const [previousAssignments, setPreviousAssignments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');

  const handleFileUpload = (event, setFunction) => {
    const file = event.target.files[0];
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setFunction(results.data);
        setError('');
      },
      error: (error) => {
        setError('Error parsing file: ' + error.message);
      }
    });
  };

  const generateAssignments = () => {
    if (currentEmployees.length === 0) {
      setError('Please upload the current employees file first.');
      return;
    }

    setAssignments(assignSecretSanta(currentEmployees, previousAssignments));
    setError('');
  };

  const downloadAssignments = () => {
    if (assignments.length === 0) {
      setError('No assignments to download');
      return;
    }
    const csv = Papa.unparse(assignments);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'secret_santa_assignments.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 5, p: 3, boxShadow: 5 }}>
      <CardHeader title="🎅 Secret Santa Game" sx={{ textAlign: 'center', color: 'red' }} />
      <CardContent>
        <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, setCurrentEmployees)} />
        <br /><br />
        <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, setPreviousAssignments)} />
        <br /><br />
        {error && <Typography color="error">⚠️ {error}</Typography>}
        <br />
        <Button variant="contained" color="primary" onClick={generateAssignments} sx={{ mr: 2 }}>Generate Assignments</Button>
        <Button variant="contained" color="secondary" onClick={downloadAssignments} disabled={assignments.length === 0}>Download Assignments</Button>
        {assignments.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Secret Santa 🎅</strong></TableCell>
                  <TableCell><strong>Gift Recipient 🎁</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment, index) => (
                  <TableRow key={index}>
                    <TableCell>{assignment.Employee_Name} ({assignment.Employee_EmailID})</TableCell>
                    <TableCell>{assignment.Secret_Child_Name} ({assignment.Secret_Child_EmailID})</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SecretSantaGame;
