import { createSlice } from '@reduxjs/toolkit';

export const contentSlice = createSlice({
    name: 'content',
    initialState: {
        posts: [],
        newposts: [],
        ids: [],
    },

    reducers: {
        addPosts: (state, action) => {
            
            function shuffle(array) {
                let currentIndex = array.length,  randomIndex;
              
                // While there remain elements to shuffle...
                while (currentIndex !== 0) {
              
                  // Pick a remaining element...
                  randomIndex = Math.floor(Math.random() * currentIndex);
                  currentIndex--;
              
                  // And swap it with the current element.
                  [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]];
                }
              
                return array;
            }

            var data = action.payload

            state.ids.push(...data.map(post => post.id))
            state.posts.push(...shuffle(data))
        },

        newPost: (state, action) => {
            var a = action.payload
            a.last_vote = {up: true, down: false}
            a.score = 1
            a.time_ago = 0
            state.newposts.push(a)
        }
    }
})

export const { addPosts, newPost } = contentSlice.actions

export default contentSlice.reducer