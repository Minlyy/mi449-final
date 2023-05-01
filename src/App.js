import './App.css';
import React, { useState, useEffect } from 'react';

function CatFact() {
  const [fact, setFact] = useState('');

  const fetchFact = async () => {
    try {
      const response = await fetch('https://cat-fact.herokuapp.com/facts/random');
      const data = await response.json();
      setFact(data.text)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFact();
  }, []);

  return (
    <div className='mt-6 mb-6 w-3/6'>
      <h2>Random Cat Fact:</h2>
      <p className='mx-auto'>{fact}</p>
      <button onClick={fetchFact} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">New Fact</button>
    </div>
  );
}

function CatGrid() {
  const [catBreeds, setCatBreeds] = useState([]);
  const [catIndex, setIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);



  useEffect(() => {
    const fetchCatImages = async () => {
      try {
        const response = await fetch('https://api.thecatapi.com/v1/breeds');
        const data = await response.json();
        console.log(data)
        const actualData = [];
        for(let i = 0; i < 9; i++) {
          const response2 = await fetch('https://api.thecatapi.com/v1/images/search?breed_id='+data[catIndex + i].id);
          const data2 = await response2.json();
          if(data2.length !== 0)
          {
            data[catIndex + i]['url'] = data2[0].url;
            actualData.push(data[catIndex + i]);
          }
          else
          {
            data[catIndex + i]['url'] = "";
            actualData.push(data[catIndex + i]);
          }
        }
        setCatBreeds(actualData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCatImages();
  }, [catIndex]);

  function AddIndex() {
    setIndex(catIndex + 9);
    console.log(catIndex);
  }
  
  function AddFavorite(url, breed, description) {
    let cat = {};
    cat['url'] = url;
    cat['breed'] = breed;
    cat['des'] = description;
    setFavorites([...favorites, cat])
  }

  return (
    <div>
    <div className="grid grid-cols-3 grid-rows-3 gap-4 w-3/4 mx-auto border-4 border-green-600 rounded-3xl">
      {catBreeds.map(catBreed => (
        <div className='ml-5 mr-5 mt-2'>
          <img src={catBreed.url} alt={catBreed.name} className='w-full h-80 object-cover border-4 border-red-600 rounded-3xl' onClick={() => AddFavorite(catBreed.url, catBreed.name, catBreed.description)}/>
          <p>{catBreed.name}</p>
        </div>
      ))}
      <button onClick={AddIndex} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded col-end-4 mb-6 mr-5">New Breeds</button>
    </div>
    <h1 className='mb-5 mt-5'>Favorites</h1>
      <Favorite favorites={favorites} />
    </div>

  );
};

function Favorite({favorites}) {
  return (
    <div className='grid grid-cols-4 grid-rows-4 gap-4 ml-4 mr-4'>
      {favorites.map(cat => (
        <div>
          <img src={cat.url} className='w-full h-80 object-cover' alt={cat.name}></img>
          <p>{cat.des}</p>
        </div>
      ))}
    </div>
  );
}




function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className='mt-4'>Cats</h1>
        <CatFact></CatFact>
        <h1>Click to add to favorite</h1>
        <CatGrid></CatGrid>
      </header>
    </div>
  );
}

export default App;
