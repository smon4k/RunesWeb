export default {
    state:{
        mainTheme:localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark',
        positionFinish:false,
        screenWidth: document.body.clientWidth,
        isMobel: document.body.clientWidth < 960 ? true : false,
        adaptiveSize: 960,
        popUpList:[],
        showPending:false,
        showConstruction:false,
    },
    mutations:{
        SHOW_POPUP(state, status){
            state.popUpList.push({...status})
        },
        CLOSE_POPUP(state, {id , kind}){
            if(kind === 'pending'){
                state.showPending = false
            }else if(kind === 'construction'){
                state.showConstruction = false
            }

            let index = state.popUpList.findIndex(item=>{
                return item.id === id
            })
            if(index !== -1){
                state.popUpList.splice(index,1)
            }
        },
        SHOW_PENDING(state){
            state.showPending = true
        },
        SHOW_CONSTRUCTION(state){ 
            state.showConstruction = true
        },
        setMainTheme(state , val){
            state.mainTheme = val
        },
        setPositionFinish(state , val){
            state.positionFinish = val
        },
        setScreenWidth(state , val){
            state.screenWidth = val;
            if(val < 600) {
                state.isMobel = true;
            } else {
                state.isMobel = false;
            }
        },
    },
    actions:{
        showPopUp({commit } , status){
            commit('SHOW_POPUP' , status)
        },
        showPendingPopUp({commit}){
            commit("SHOW_PENDING")
        },
        closePopUp({commit} , status){
            commit('CLOSE_POPUP' , status)
        },
    }
}