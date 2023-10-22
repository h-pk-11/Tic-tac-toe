const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const appStart = $('.app-start');
const appStartHeading = $('.app-start__heading');
const appStartBtn = $('.app-start__btn');
const appStartMode = $('.app-start-mode');
const appModeContent = $('.app-mode-content');

const pVsPInput = $('#playerVsPlayer');
const pVsAiInput = $('#playerVsAi');

const pVsPForm = $('.pVsPForm');
const pVsAiForm = $('.pVsAiForm');

const gridForm = $('.gridForm');

const toggleBtn = $('.app-light-toggle__btn');
const toggleBtn_icon = toggleBtn.querySelector('i');
const toggleBtn_text = toggleBtn.querySelector('span');

const root = document.documentElement;

// app start
function start(){

    // 0. toggle light
    root.classList.add('light');

    toggleBtn.onclick = function(){

        const newTheme = root.className === 'dark' ? 'light' : 'dark';
        root.className = newTheme;
        toggleBtn_text.innerHTML = toggleBtn_text.innerHTML === 'Light' ? 'Dark' : 'Light';
        toggleBtn_icon.classList.toggle('fa-sun');
        toggleBtn_icon.classList.toggle('fa-moon');
       
    }

    // 1. start screen 
    appStartBtn.onclick = function(){
        
        //appStart.classList.add('app-start--close');
        appStartMode.classList.add('app-start-mode--active');
        appModeContent.classList.add('.app-mode-content--active');

    }

    // 1.1 change mode
    pVsPInput.onchange = function(){
        changeNameForm();
    };

    pVsAiInput.onchange = function(){
        changeNameForm();
    };

    function changeNameForm(){
        pVsPForm.classList.toggle('displayMode');
        pVsAiForm.classList.toggle('displayMode');
    }

    // 1.2 set grid dimensions, number consecutive piece to win
    // 1.3 cancel, ok button

    // 1.3a validation (simple)

    function validate(input){
        const parent = input.closest('.app-mode__select-form');
        const messageElement = parent.querySelector('.form-message');
        if(!input.value.trim()){
            messageElement.innerHTML = 'This field is required';
            parent.classList.add('app-mode__select-form--invalid');
        }

        return messageElement.innerHTML === '' ? true : false;
    }

    function clearError(input){
        const parent = input.closest('.app-mode__select-form');
        const messageElement = parent.querySelector('.form-message');
    
        messageElement.innerHTML = '';
        if(parent.className.includes('app-mode__select-form--invalid')){
            parent.classList.remove('app-mode__select-form--invalid');
        }
    }

    const textInputs = $$("input[type='text']");

    textInputs.forEach(textInput => {
        textInput.onblur = function(){
            validate(textInput);
        };
    });

    textInputs.forEach(textInput => {
        textInput.oninput = function(){
            clearError(textInput);
        };
    });


    const cancelBtn = $('.cancel');
    const okBtn = $('.ok');
    const closeBtn = $('.app-mode__select-header').querySelector('a');

    function cancelInput() {
        appStartMode.classList.remove('app-start-mode--active');
        appModeContent.classList.remove('app-mode-content--active');
        textInputs.forEach(textInput => {
            clearError(textInput);
            textInput.value = "";
        });

        if(!pVsPInput.checked){
            pVsPInput.checked = true;
            pVsPForm.classList.add('displayMode');
            pVsAiForm.classList.remove('displayMode');
        }
        
    }

    cancelBtn.onclick = function() {
        cancelInput();
    }

    closeBtn.onclick = function() {
        cancelInput();
    }

    okBtn.onclick = function(){
        onSubmit();
    };

    function onSubmit(){

        // Validation
        let isValid = true;

        if(pVsPInput.checked){

            let pVsPSelectForms = pVsPForm.querySelectorAll('.app-mode__select-form');
            pVsPSelectForms.forEach(form => {
                if(!form.className.includes('app-mode__select-form--invalid')){
                    let input = form.querySelector('input');
                    if(!validate(input)){
                        isValid = false;
                    }
                }else{
                    isValid = false;
                }
            });

        } else {

            let pVsAiSelectForm = pVsAiForm.querySelector('.app-mode__select-form');
            
            if(!pVsAiSelectForm.className.includes('app-mode__select-form--invalid')){
                let input = pVsAiSelectForm.querySelector('input');
                if(!validate(input)){
                    isValid = false;
                }
            }else{
                isValid = false;
            }
            
        }

        if(isValid){

            let gameInput;

            const height = gridForm.querySelector('#gridHeight').value;
            const width = gridForm.querySelector('#gridWidth').value;
            const number = gridForm.querySelector('#winNumber').value;

            if(pVsPInput.checked){

                gameInput = {
                    mode: 'pvp',
                    player1: pVsPForm.querySelector('#player1name').value,
                    player2: pVsPForm.querySelector('#player2name').value,
                    height,
                    width,
                    number,
                }

            }else{
                gameInput = {
                    mode: 'pvp',
                    player1: pVsAiForm.querySelector('#player3name').value,
                    player2: 'AI',
                    height,
                    width,
                    number,
                }
            }

            // close dialog & loading game function

            appModeContent.style.cssText = "animation: flyOut ease-in-out 0.75s forwards;";
        
            //appStart.classList.add('app-start--close');

            

            setTimeout(() => {

                appStartMode.classList.remove('app-start-mode--active');
                appModeContent.classList.remove('.app-mode-content--active');
                
                appModeContent.style.cssText = "animation: popUp ease-in-out 0.75s forwards;";

                appStartHeading.style.cssText = "animation: slideOutToLeft ease-in-out 1s forwards;";
                appStartBtn.style.cssText = "animation: slideOutToRight ease-in-out 1s forwards;";

                setTimeout(() => {

                    appStart.classList.add('app-start--close');
                    
                    // reset animation
                    appStartHeading.style.cssText = "animation: slideInFromRight ease-out 1s forwards;";
                    appStartBtn.style.cssText = "animation: slideInFromLeft ease-out 1s forwards;";

                    // add app-transit
                    appTransit(gameInput);

                }, 1100);

            }, 850);
            

        }

    }

}

// app loading transit 
function appTransit(obj){

    const appTransit = $('.app-transit');
    const appTransitStep1 = appTransit.querySelector('.app-transit__step-1');
    const appTransitStep2 = appTransit.querySelector('.app-transit__step-2');
    const appTransitStep3 = appTransit.querySelector('.app-transit__step-3');
    const appTransitStep4 = appTransit.querySelector('.app-transit__step-4');

    appTransit.classList.add('app-transit--active');
    appTransitStep1.classList.add('app-transit__step--active');

    setTimeout(
        () => {
            appTransitStep1.classList.remove('app-transit__step--active');
            appTransitStep2.classList.add('app-transit__step--active');

            setTimeout(() => {

                appTransitStep2.classList.remove('app-transit__step--active');
                appTransitStep3.classList.add('app-transit__step--active');

                setTimeout(() => {

                    appTransitStep3.classList.remove('app-transit__step--active');
                    appTransitStep4.classList.add('app-transit__step--active');

                    setTimeout(() => {

                        appTransitStep4.classList.remove('app-transit__step--active');

                        // reset app-transit
                        appTransit.classList.remove('app-transit--active');

                        loadGame(obj);

                    }, 1000);

                }, 1000);

            }, 1000);
        }

    , 1000);

}


// load game
function loadGame({mode, player1, player2, height, width, number}){

    // define elements of the game
    // define gameboard
    let Gameboard = function(row, column){

        const rows = row;
        const columns = column;
    
        let board = [];
    
        const getRows = () => rows;
        const getColumns = () => columns;

        // make a 2d array to present gameboard
        for(let i = 0; i < rows; i++){
            board[i] = [];
            for(let j = 0; j < columns; j++){

                board[i][j] = Cell();
            }
        }

        const getBoard = () => board;

        const makeAMark = (row, column, player) => {
            if(board[row][column].getValue() !== 0) return;
            board[row][column].addValue(player);
        };

        const clearAllMarks = () => {
            for(let i = 0; i < rows; i++){
                for(let j = 0; j < columns; j++){
    
                    board[i][j].addValue();
                }
            }
        };

        return { getRows, getColumns, getBoard, makeAMark, clearAllMarks };
    }

    // define cell
    function Cell(){
        let value = 0;
        
        const addValue = function(player = { playerValue: 0 }){
            value = player.playerValue;
        };
    
        const getValue = () => value;
    
        return { addValue, getValue };
    }

    // define player
    let Player = function(name, value){
        const playerName = name;
        const playerValue = value;

        return {
            playerName, playerValue
        };
    }


    function GameController(
        rows,
        columns,
        n,
        playerOneName = "Player One",
        playerTwoName = "Player two",
        mode
    ){

        const board = Gameboard(rows, columns);

        const players = [Player(playerOneName, 1), Player(playerTwoName, 2)];

        let activePlayer = players[0];

        const switchActivePlayer = () => {
            if(activePlayer === players[0]){
                activePlayer = players[1];
            }else{
                activePlayer = players[0];
            }
        };

        const getActivePlayer = () => activePlayer;


        const initialRender = () => {
            // remove app-game--close 
            const appGame = $('.app-game');
            if(appGame.className.includes('app-game--close')){
                appGame.classList.remove('app-game--close');
            }
            // set css variables
            const root = document.documentElement;
            root.style.setProperty('--board-column-num', width.toString());
            root.style.setProperty('--board-row-num', height.toString());

            let heightCell = '150px';
            if(height >= 5 || width >= 8){
                heightCell = (700 / height).toFixed(0) + 'px';
            }

            root.style.setProperty('--cell-dim', heightCell);

            // set heading
            const headingElement = $('.app-game_header__heading');
            headingElement.innerHTML = `${players[0].playerName}'s turn`;

            // creat cells
            const boardElement = $('.app-game_gameboard__board');

            for(let i = 0; i < rows; i++){
                for(let j = 0; j < columns; j++){
                    let cell = document.createElement('button');
                    cell.classList.add('app-game_gameboard__cell');
                    cell.dataset.y = i.toString();
                    cell.dataset.x = j.toString();
                    boardElement.appendChild(cell);
                }
            }
            
        }

        const clearBoard = () => {
            const boardElement = $('.app-game_gameboard__board');
            const cellElements = boardElement.querySelectorAll('button'); 
            
            cellElements.forEach(
                (cell) => {
                    cell.innerHTML = '';
                    cell.disabled = false;
                    if(cell.className.includes('cell--active')){
                        cell.classList.remove('cell--active');
                    }

                    if(cell.className.includes('cell--freeze')){
                        cell.classList.remove('cell--freeze');
                    }

                    if(cell.className.includes('cell--highlight')){
                        cell.classList.remove('cell--highlight');
                    }
                }
            );

            activePlayer = players[0];
            reRender();
            board.clearAllMarks();
            moveCount = 0;
        }

        const addUiEvents = () => {
            // cell events
            const boardElement = $('.app-game_gameboard__board');
            const cellElements = boardElement.querySelectorAll('button'); 
            
            const xIcon = '<i class="fa-solid fa-xmark"></i>';
            const oIcon = '<i class="fa-solid fa-o"></i>';

            const headingElement = $('.app-game_header__heading');

            cellElements.forEach(
                cell => {
                    cell.onclick = function(){
                        cell.classList.add('cell--active');
                        let actvPlayer = getActivePlayer();
                        if(actvPlayer.playerValue === 1){
                            cell.innerHTML = xIcon;
                        }else{
                            cell.innerHTML = oIcon;
                        }
                        cell.disabled = true;

                        const y = +cell.dataset.y;
                        const x = +cell.dataset.x;

                        board.makeAMark(y, x, actvPlayer);
                        let result = checkWinner(y, x, actvPlayer);

                        if(result[0] !== -1){

                            if(result[0] === 1){

                                switch(result[2]){
                                    case 'X':{
                                        
                                        for(let j = 0; j < number; j++){
                                            boardElement.querySelector(`[data-y='${y}'][data-x='${result[1] + j}']`).classList.add('cell--highlight');
                                        }

                                        break;
                                    }
                                    case 'Y': {

                                        for(let j = 0; j < number; j++){
                                            boardElement.querySelector(`[data-y='${result[1] + j}'][data-x='${x}']`).classList.add('cell--highlight');
                                        }

                                        break;
                                    }
                                    case 'D':{

                                        for(let j = 0; j < number; j++){
                                            boardElement.querySelector(`[data-y='${result[1] + j}'][data-x='${result[1] - y + x + j}']`).classList.add('cell--highlight');
                                        }

                                        break;
                                    }
                                    case 'rD':{

                                        for(let j = 0; j < number; j++){
                                            boardElement.querySelector(`[data-y='${result[1] + j}'][data-x='${y + x - result[1] - j}']`).classList.add('cell--highlight');
                                        }

                                        break;
                                    }
                                }

                                headingElement.innerHTML = `${actvPlayer.playerName} won`;

                            }else{

                                headingElement.innerHTML = `${players[0].playerName} drawed ${players[1].playerName}`;
                            }

                            // freeze all cells

                            cellElements.forEach(cell => {
                                if(!cell.className.includes('cell--highlight')){
                                    cell.classList.add('cell--freeze');
                                }
                                
                                cell.disabled = true;
                            });

                        } else {
                            switchActivePlayer();
                            reRender();
                        }
                        
                    };
                }
            );

            
            const appFooter = $('.app-game_footer');
            const refreshBtn = appFooter.querySelector('.refresh');
            const restartBtn = appFooter.querySelector('.restart');
            
            // reset event
            refreshBtn.onclick = function(){
                clearBoard();
            }

            // restart event
            restartBtn.onclick = function(){
                resetInput();
                start();
            }

        }

        const reRender = () => {
            const headingElement = $('.app-game_header__heading');
            const activePlayer = getActivePlayer();
            headingElement.innerHTML = `${activePlayer.playerName}'s turn`;
        }

        let moveCount = 0;

        const checkWinner = (row, column, player) => {
            
            moveCount++;

            const value = player.playerValue;

            let myBoard = board.getBoard();

            // check in X direction
            const xSrange = Math.max(0, column - n + 1);
            const xErange = Math.min(board.getColumns() - 1, column + n - 1);
            
            for(let i = xSrange; i <= column; i++){

                if(i + n - 1 > xErange) {
                    break;
                }

                let isGood = true;

                for(let j = 0; j < n; j++){

                    if(myBoard[row][i + j].getValue() !== value){
                        isGood = false;
                        break;
                    }
                }

                if(isGood) {
                    return [1, i, 'X'];
                }
            }


            // check in Y direction
            const ySrange = Math.max(0, row - n + 1);
            const yErange = Math.min(board.getRows() - 1, row + n - 1);
            
            for(let i = ySrange; i <= row; i++){

                if(i + n - 1 > yErange) {
                    break;
                }


                let isGood = true;

                for(let j = 0; j < n; j++){

                    if(myBoard[i + j][column].getValue() !== value){
                        isGood = false;
                        break;
                    }

                }

                if(isGood) {
                    return [1, i, 'Y'];
                }
            }


            // diagonal direction
            const xdSrange = row <= column ? 0 : row - column;
            let xdErange = row;

            let k = column;
            while(true){
                k++;
                if(k > (board.getColumns() - 1)) break;
                if(xdErange >= (board.getRows() - 1)) break;
                xdErange++
            }
            

            for(let i = xdSrange; i <= row; i++){

                if(i + n - 1 > xdErange) {
                    break;
                }

                let isGood = true;

                for(let j = 0; j < n; j++){

                    if(myBoard[i + j][i - row + column + j].getValue() !== value){
                        isGood = false;
                        break;
                    }

                }

                if(isGood) {
                    return [1, i, 'D'];
                }

            }

            // rdiagonal direction    
            const xrdSrange = Math.max((row - (board.getColumns() - 1 - column)), 0);
            let xrdErange = row;
            
            let p = column;
            while(true){
                p--;
                if(p < 0) break;
                if(xrdErange >= (board.getRows() - 1)) break;
                xrdErange++
            }

            for(let i = xrdSrange; i <= row; i++){

                if(i + n - 1 > xrdErange) {
                    break;
                }

                let isGood = true;

                for(let j = 0; j < n; j++){

                    if(myBoard[i + j][row + column - i - j].getValue() !== value){
                        isGood = false;
                        break;
                    }

                }

                if(isGood) {
                    return [1, i, 'rD'];
                }

            }

            if(moveCount == board.getRows()*board.getColumns()){
                return [0, 0, ''];
            }

            return [-1, 0, ''];

        }

        const resetInput = () => {
            // reset input form
            const appGame = $('.app-game');

            appGame.classList.add('app-game--close');
            appStart.classList.remove('app-start--close');

            pVsPForm.querySelector('#player1name').value = '';
            pVsPForm.querySelector('#player2name').value = '';
            pVsAiForm.querySelector('#player3name').value = '';
            
            gridForm.querySelector('#gridHeight').selectedIndex = 0;
            gridForm.querySelector('#gridWidth').selectedIndex = 0;
            gridForm.querySelector('#winNumber').selectedIndex = 0;

            // delete old cells
            const boardElement = $('.app-game_gameboard__board');
            boardElement.innerHTML = '';
        };

        return {
            initialRender,
            addUiEvents,
        };
    }
    
    const game = GameController(+height, +width, +number, player1, player2, mode);

    game.initialRender();
    game.addUiEvents();
}

start();