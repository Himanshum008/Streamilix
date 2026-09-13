import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        channelData:null,
        allChannelData:null,
        subscribedChannels:null,
        subscribedVideos:null,
        subscribedShorts:null,
        subscribedPlaylists:null,
        subscribedPosts:null,
        historyVideo:null,
        historyShort:null
    },
    reducers:{
        setUserData:(state, action) => {
            state.userData = action.payload
        },
        setChannelData:(state, action) => {
            state.channelData = action.payload
        },
        setAllChannelData:(state, action) => {
            state.allChannelData = action.payload
        },
        setSubscribedChannels:(state, action) => {
            state.subscribedChannels = action.payload
        },
        setSubscribedVideos:(state, action) => {
            state.subscribedVideos = action.payload
        },
        setSubscribedShorts:(state, action) => {
            state.subscribedShorts = action.payload
        },
        setSubscribedPlaylists:(state, action) => {
            state.subscribedPlaylists = action.payload
        },
        setSubscribedPosts:(state, action) => {
            state.subscribedPosts = action.payload
        },
        setHistoryVideo:(state, action) => {
            state.historyVideo = action.payload
        },
        setHistoryShort:(state, action) => {
            state.historyShort = action.payload
        },
    }
})

export const {setUserData} = userSlice.actions
export const {setChannelData} = userSlice.actions
export const {setAllChannelData} = userSlice.actions
export const {setSubscribedChannels} = userSlice.actions
export const {setSubscribedVideos} = userSlice.actions
export const {setSubscribedShorts} = userSlice.actions
export const {setSubscribedPlaylists} = userSlice.actions
export const {setSubscribedPosts} = userSlice.actions
export const {setHistoryVideo} = userSlice.actions
export const {setHistoryShort} = userSlice.actions
export default userSlice.reducer