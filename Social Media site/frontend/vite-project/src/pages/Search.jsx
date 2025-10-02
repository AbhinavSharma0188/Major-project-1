import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiSearch } from "react-icons/fi";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import dp from "../assets/dp.webp";

function Search() {
    const navigate = useNavigate();
    const [input, setInput] = useState(""); // ✅ Changed from null to ""
    const [searchData, setSearchData] = useState([]); // ✅ Changed from undefined to []

    const handleSearch = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/user/search?keyWord=${input}`,
                { withCredentials: true }
            );
            setSearchData(result.data);
            console.log(result.data);
        } catch (error) {
            console.log(error);
            setSearchData([]); // ✅ Reset to empty array on error
        }
    };

    useEffect(() => {
        if (input) {
            handleSearch();
        } else {
            setSearchData([]); // ✅ Clear results when input is empty
        }
    }, [input]);

    console.log(searchData);

    return (
        <div className='w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px]'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] absolute top-0'>
                <MdOutlineKeyboardBackspace 
                    className='text-white cursor-pointer w-[25px] h-[25px]' 
                    onClick={() => navigate(`/`)} 
                />
            </div>

            <div className='w-full h-[80px] flex items-center justify-center mt-[80px]'>
                <div className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center px-[20px]'>
                    <FiSearch className='w-[18px] h-[18px] text-white'/>
                    <input 
                        type="text" 
                        placeholder='search...' 
                        className='w-full h-full outline-0 rounded-full px-[20px] text-white text-[18px] bg-transparent' 
                        onChange={(e) => setInput(e.target.value)} 
                        value={input}
                    />
                </div>
            </div>

            {input && searchData?.map((user, index) => (
                <div 
                    key={user._id || index} // ✅ Added key prop
                    className='w-[90vw] max-w-[700px] h-[60px] rounded-full bg-white flex items-center gap-[20px] px-[5px] cursor-pointer hover:bg-gray-200' 
                    onClick={() => navigate(`/profile/${user.username || user.userName}`)} // ✅ Added fallback
                >
                    <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                        <img src={user.profileImage || dp} alt="" className='w-full h-full object-cover'/>
                    </div>

                    <div className='text-black text-[18px] font-semibold'>
                        <div>{user.username || user.userName}</div> {/* ✅ Added fallback */}
                        <div className='text-[14px] text-gray-400'>{user.name}</div>
                    </div>
                </div>
            ))}   

            {!input && <div className='text-[30px] text-gray-700 font-bold'>Search Here...</div>}
        </div>
    );
}

export default Search;