import { createSlice } from "@reduxjs/toolkit";


const contentSlice = createSlice({
    name:"content",
    initialState:{
        userData:null,
        allVideosData:null,
        allShortsData:null
    },
    reducers:{
        setAllVideosData:(state, action) => {
            state.allVideosData = action.payload
        },
        setAllShortsData:(state, action) => {
            state.allShortsData = action.payload
        }
    }
})

export const {setAllVideosData} = contentSlice.actions
export const {setAllShortsData} = contentSlice.actions
export default contentSlice.reducer