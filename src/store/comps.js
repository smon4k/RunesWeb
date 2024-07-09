export default {
    state:{
        mainTheme:localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark',
        positionFinish:false,
        screenWidth: document.body.clientWidth,
        isMobel: document.body.clientWidth < 960 ? true : false,
        adaptiveSize: 960,
    },
    mutations:{
        setMainTheme(state , val){
            state.mainTheme = val
        },
        setPositionFinish(state , val){
            state.positionFinish = val
        },
        setScreenWidth(state , val){
            state.screenWidth = val;
            if(val < 960) {
                state.isMobel = true;
            } else {
                state.isMobel = false;
            }
        },
    }
}