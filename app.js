var boardcontroller = (function(){
    var Card = function(id, description, num) {
        this.id = id;
        this.description = description;
        this.num = num
    }

    var data = {
        card: []
    };
    var dataCheck = [];
    return {
        addCard: function(description) {
            var ID , newCard, num;

            if (data.card.length > 0) {
                ID = data.card[data.card.length - 1].id + 1;
                num = data.card.length + 1;
            } else {
                ID = 0;
                num = 1
            }

            newCard = new Card(ID, description,num);

            data.card.push(newCard);
            return newCard
        },
        deleteCard: function(ID) {
            var ids,index;

            ids = data.card.map(function(curr) {
                return curr.id;
            });
            index = ids.indexOf(ID);

            if (index !== -1) {
                data.card.splice(index, 1);
            }
        },
        updateCard: function() {
            for (var i = 0; i < data.card.length; i++) {
                data.card[i].num = i + 1;
            }
            return data
        },
        checkData: function() {
            return data
        },
        selectOption:function() {
            var randomNum, finalOption;

            randomNum = Math.floor(Math.random() * data.card.length);
            finalOption = data.card[randomNum].description.choice;

            return finalOption 
        },
        deleteAll: function() {
            data = {
                card : [],
            }
            return data
        },
        test: function() {
            console.log(data.card);
        }
    }
})();

var UIController = (function() {
    var DOMString = {
        inputField: '.bottom__input',
        addButton: '.bottom__button',
        boardContainer: '.board',
        deleteButton: '.far',
        container: '.board',
        cardNum: '.board__card-num',
        message1: '.message1',
        message2: '.message2',
        result: '.bottom__cta',
        publishResult: '.popup__content__result',
        removeButton: '.bottom__reset',
        card: '.board__card',
        id: '.opt-0',
    }
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    }
    return {
        getInput: function() {
            return {
                choice: document.querySelector(DOMString.inputField).value,
            }
        },
        addNewCard: function(obj) {
            var html, newHtml, element;

            element = DOMString.boardContainer;
            // create html with placeholder text
            html = '<div class="board__card" id="opt-%id%"><div class="board__card-num">%num%</div><div class="board__card-text">%description%</div><button class="board__card-delete"><i class="far fa-times-circle"></i></button></div>'
            // replace placeholder with actural data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%num%', parseInt(obj.num));
            newHtml = newHtml.replace('%description%', obj.description.choice);

            // insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListCard: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        deleteAllCard: function() {
            
            var re = document.querySelectorAll(DOMString.card);
            if (re.length > 0) {
                for (var i = 0; i < re.length; i++) {
                    var ied = re[i].id;
                    var el = document.getElementById(ied);
                    el.parentNode.removeChild(el);
                }
            }                  
        },
        updateCard: function(data) {
            var numList = document.querySelectorAll(DOMString.cardNum);
            if (data.card.length > 0) {
                nodeListForEach(numList, function(curr, index){
                    curr.textContent = data.card[index].num;
                    console.log(data.card[index].num)
                });
            }
            
        },
        showResult: function(finalResult){
            document.querySelector(DOMString.publishResult).textContent = finalResult;
        },
        
        clearField: function(){
            
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMString.inputField);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, arr) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },
        getDOMString: function() {
            return DOMString
        }
    }
})();

var controller = (function(boardCtrl, UICtrl) {
    var DOM = UICtrl.getDOMString();
    var setupListener = function() {

        document.querySelector(DOM.addButton).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.result).addEventListener('click', ctrlResult);
        document.querySelector(DOM.removeButton).addEventListener('click', ctrlRemoveAllItem);
    }
    
    var update = function() {
        // 1. Update the data structure
        var updatedData = boardCtrl.updateCard();
        // 2. Update the UI
        console.log(updatedData);
        UICtrl.updateCard(updatedData);

    }
    var ctrlRemoveAllItem = function(event) {
        // 1. delete all the data from board ctrl
        boardCtrl.deleteAll();
        // 2. update the UI
        UICtrl.deleteAllCard();
    }

    var ctrlAddItem = function() {
        var input , newItem, data;

        data = boardCtrl.checkData();
        // 1. Get input from UI
        input = UICtrl.getInput();
        if (input.choice == '' && input.choice.length < 20) {
            document.querySelector(DOM.message2).style.display = "block";
            setInterval(function(){ 
                document.querySelector(DOM.message2).style.display = "none"; 
            }, 3000);
            
        }else // 2. Add item to the board controller
         if (input.choice !== '' && input.choice.length < 25) {
            newItem = boardCtrl.addCard(input);
            console.log(newItem)
            // 3. Add item to the UI
            UICtrl.addNewCard(newItem);
            // 4. Clear the fields
            UICtrl.clearField();
            update();
        }

        // for (var i = 0; i < data.card.length; i++) {
        //     if (data.card[i].description.choice ==  input.choice) {
        //         document.querySelector(DOM.message1).style.display = "block"; 
        //         setInterval(function(){ 
        //             document.querySelector(DOM.message1).style.display = "none"; 
        //         }, 5000);
        //     } 
        // }

    }

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, ID;

        itemID = event.target.parentNode.parentNode.id;
        
        if (itemID) {
            splitID = itemID.split('-');
            ID = parseInt(splitID[1]);
            // 1. Delete card from data structure 
            boardCtrl.deleteCard(ID);           
            // 2. update card in the UI
            UICtrl.deleteListCard(itemID);
            update();
        }
    }

    var ctrlResult = function() {
        // 1. Get the result from board controller
        var finalResult = boardCtrl.selectOption();
        
        // 2. Display it on UI popup
        UICtrl.showResult(finalResult);
    } 
    return {
        init: function() {
            console.log('Application started')
            setupListener();
        }
    }
})(boardcontroller, UIController);

controller.init();
