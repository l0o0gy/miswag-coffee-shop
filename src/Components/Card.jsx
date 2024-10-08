import React, { useState, useEffect } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useDebounce } from '../Hooks/hook';
import searchlogo from '../assets/img/searching.png';
import searchcup from '../assets/img/searchcup.png';
import CoffeeImage from './CoffeeImage';

function Card() {
    const [miswagData, setMiswagData] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search);
    const [searching, setSearching] = useState(false);

    const fetchCoffeeShopData = async () => {
        try {
            const response = await axios.get('https://file.notion.so/f/f/f9a09310-af94-4993-bbca-d051d7b65e1d/2dd59431-7382-4f93-9625-fece6ad64e7d/coffee.json?table=block&id=1118d471-7c66-80c3-81e4-d43d01799cc0&spaceId=f9a09310-af94-4993-bbca-d051d7b65e1d&expirationTimestamp=1728633600000&signature=OFxCCJDR8vA8SXBMQG_MMEQC5MOZffNIA4oQPeAAwB4&downloadName=coffee.json');
            return response.data.data;
        } catch (err) {
            console.error("Error fetching data:", err);
            return [];
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchCoffeeShopData();
            setMiswagData(data);
            const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || {};
            setFavorites(storedFavorites);
            setLoading(false);
        };

        loadData();
    }, []);

    const toggleFavorite = (id) => {
        const updatedFavorites = { ...favorites, [id]: !favorites[id] };
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    useEffect(() => {
        const loadNameOfItem = async () => {
            setLoading(true);

            if (debouncedSearch === '') {
                const data = await fetchCoffeeShopData();
                setMiswagData(data);
                setLoading(false);
                setSearching(false);
                return;
            }

            setSearching(true);
            const delay = setTimeout(async () => {
                const data = await fetchCoffeeShopData();

                const filteredData = data.filter(item => item.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
                setMiswagData(filteredData);

                setLoading(false);
                setSearching(false);
            }, 3000);

            return () => clearTimeout(delay);
        };

        loadNameOfItem();
    }, [debouncedSearch]);




    return (
        <>
            <div className='m-5 md:mt-20 flex justify-between md:ml-20 md:mr-20'>
                <h1 className='font-bold md:text-2xl mt-2 text-amber-800'>Products</h1>
                <SearchBar onChange={setSearch} />
            </div>

            {loading && (
                <div className='flex justify-center m-20'>
                    <div className='animate-pulse relative md:w-60 flex justify-center'>
                        <img src={searchlogo} alt='searchlogo' className='search-logo w-16 md:w-32' />
                        <img src={searchcup} alt='searchcup' className=' w-32 md:w-56' />
                    </div>
                </div>
            )}

            {!loading && (
                <div className='m-5 mt-1 md:ml-20 md:mr-20 flex justify-center'>
                    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                        {miswagData.length > 0 && miswagData.map((data) => (
                            <div key={data.id} className='bg-amber-100 p-3 h-auto rounded-xl shadow-lg flex flex-col'>
                                <Box
                                    sx={{
                                        height: { xs: '100px',sm:'200px',md:'150px' ,lg: '300px' },
                                        maxWidth: '500px',
                                        overflow: 'hidden',
                                        borderRadius: 2,
                                    }}
                                >
                                    <CoffeeImage id={data.id} />
                                </Box>
                                <h1 className='font-bold text-lg mt-2'>{data.name}</h1>
                                <p className='text-sm md:text-base mt-2 line-clamp-3'>{data.description}</p>
                                <Stack sx={{ mt: 'auto' }}>
                                    <div className="flex justify-between items-center pt-4 no-flex-xxxs">
                                        <p className='font-semibold text-sm sm:text-base lg:text-lg mb-1 md:mb-0'>{data.price} IQD</p>
                                        <div className='flex space-x-2'>
                                            <Link to={`/miswagcoffee/${data.id}/${data.name}`} state={{ data }} style={{ textDecoration: 'none' }}>
                                                <button className='bg-orange-500 hover:bg-orange-600 max-w-full sm:w-32 md:w-24 lg:w-40 md:h-10 rounded-lg p-2 text-xs sm:text-base md:text-sm lg:text-base text-white shadow-md'>
                                                    More Details
                                                </button>
                                            </Link>
                                            <Box
                                                sx={{
                                                    padding: 1,
                                                    borderRadius: 20,
                                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                                    height: { xs: '30px',sm:'40px', md: '40px', lg:'auto'},
                                                    width: { xs: '30px',sm:'40px', md:'40px' , lg:'auto'}
                                                }}
                                                onClick={() => toggleFavorite(data.id)}
                                            >
                                                {favorites[data.id] ? (
                                                    <FavoriteIcon sx={{ marginTop: { xs: '-10px',sm:'-2px', lg: 'auto' }, marginLeft: { xs: '-5px',sm:'-1px', lg: 'auto' }, color: 'orange' }} />
                                                ) : (
                                                    <FavoriteBorderIcon sx={{ marginTop: { xs: '-10px',sm:'-2px', lg: 'auto' }, marginLeft: { xs: '-5px',sm:'-1px', lg: 'auto' } }} />
                                                )}
                                            </Box>
                                        </div>
                                    </div>
                                </Stack>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default Card;
