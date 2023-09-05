import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import './cardlist.css';

const CardList = ({ initialData }) => {
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem('searchTerm') || ''
  );
  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(data);
  const [deleteQueue, setDeleteQueue] = useState(
    JSON.parse(localStorage.getItem('deleteQueue')) || []
  );

  useEffect(() => {
    // Store the search term in local storage
    localStorage.setItem('searchTerm', searchTerm.toLowerCase());

    // Filter data based on the search term
    const filtered = data.filter((item) => {
      const itemText = '${item.title.toLowerCase()} ${item.body.toLowerCase()}';
      return !searchTerm || itemText.includes(searchTerm);
    });

    setFilteredData(filtered);
  }, [data, searchTerm]);

  useEffect(() => {
    // Store the delete queue in local storage
    localStorage.setItem('deleteQueue', JSON.stringify(deleteQueue));
  }, [deleteQueue]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleDelete = (id) => {
    // Add the delete request to the queue
    setDeleteQueue([...deleteQueue, id]);

    // Remove the deleted item from the data
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
  };

  const handleRefresh = () => {
    // Clear the search term
    setSearchTerm('');

    // Process the delete queue (send API requests here)
    console.log('Processing delete queue:', deleteQueue);

    // Clear the delete queue
    setDeleteQueue([]);
  };

  return (
    <div className='container'>
      <TextField label="Search" variant="outlined" fullWidth margin="normal" value={searchTerm} onChange={handleSearchChange}/>
      <Button className='btn p-1' variant="outlined" onClick={handleRefresh}>Refresh State</Button>
      <Grid container spacing={2}>
        {filteredData.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent className='itm'>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
                <IconButton
                  color="secondary"
                  aria-label="delete"
                  onClick={() => handleDelete(item.id)} >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <p>Delete Queue {deleteQueue.length}</p>
    </div>
  );
};

export default CardList;
