var boardcontroller = (function(){
    var Card = function(id, description, num) {
        this.id = id;
        this.description = description;
        this.num = num
    }

    var data = {
        card: []
    }

    return {
        addCard: function(description) {
            var ID , newCard, num;

            if (data.card.length > 0) {
                ID = data.card[data.card.length - 1].id + 1;
                num = data.card.length + 1;
                console.log(ID + ' ' + num)
            } else {
                ID = 0;
                num = 1
            }

            newCard = new Card(ID, description,num);
            console.log(newCard)

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
            console.log(data.card)
        },
        test: function() {
            console.log(data.card)
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
    var setupListener = function() {

        var DOM = UICtrl.getDOMString();
        
        document.querySelector(DOM.addButton).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    }

    var ctrlAddItem = function() {
        var input , newItem;
        // 1. Get input from UI
        input = UICtrl.getInput();
        // 2. Add item to the board controller
        newItem = boardCtrl.addCard(input);
        // 3. Add item to the UI
        UICtrl.addNewCard(newItem);
        // 4. Clear the fields
        UICtrl.clearField();
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
        }

        

        
    }
    return {
        init: function() {
            console.log('Application started')
            setupListener();
        }
    }
})(boardcontroller, UIController);

controller.init();