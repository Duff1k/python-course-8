var combination_text = document.getElementById("combination-text");
var summary_text = document.getElementById("summary-text");
var summary_button = document.getElementById("summary-button");
var historyContainer = document.getElementById('history');
var num_buttons = document.getElementsByClassName("number-button");
var option_buttons = document.getElementsByClassName("opt-button");


var flag = false
var flag2 = false


function add_history(event){
    const newParagraph = document.createElement('li'); 
    newParagraph.textContent = event;
    historyContainer.appendChild(newParagraph);
    var heightx = historyContainer.offsetHeight + 13;
    historyContainer.style.height = heightx + "px";
}

function clear_history(event){
    const children = Array.from(historyContainer.children);
    children.forEach(child => {
        if (child.tagName !== 'DIV') {
            historyContainer.removeChild(child);
        }
    });
    historyContainer.style.height = 100 + "px";
}

function add_num(event) {
    if(flag2){
        clear_all()
        flag2 = false
    }

    if(summary_text.value == "0" || flag){
        summary_text.value = this.textContent;
        flag = false
    }
    else{
        summary_text.value += this.textContent;
    }
}

function add_option(event) {
    combination_text.value = summary_text.value + " " + this.textContent
    flag = true
    flag2 = false
}

function clear_all(event){
    combination_text.value = "";
    summary_text.value = "0";
}

function summ(event){
    var operator = combination_text.value.charAt(combination_text.value.length-1)
    if(operator == "="){
        var val = combination_text.value.split(" ")
        operator = val[1]
        combination_text.value = summary_text.value + " " + operator
        summary_text.value = val[2]
    }

    
    if (operator == "÷"){
        var num = combination_text.value.slice(0,-1)
        combination_text.value +=  " " + summary_text.value + " ="
        summary_text.value = Number(num) / Number(summary_text.value)
        add_history(combination_text.value + " " + summary_text.value)
    }
    else if (operator == "×"){
        var num = combination_text.value.slice(0,-1)
        combination_text.value +=  " " + summary_text.value + " ="
        summary_text.value = Number(num) * Number(summary_text.value)
        add_history(combination_text.value + " " + summary_text.value)
    }
    else if (operator == "-"){
        var num = combination_text.value.slice(0,-1)
        combination_text.value +=  " " + summary_text.value + " ="
        summary_text.value = Number(num) - Number(summary_text.value)
        add_history(combination_text.value + " " + summary_text.value)
    }
    else if (operator == "+"){
        var num = combination_text.value.slice(0,-1)
        combination_text.value +=  " " + summary_text.value + " ="
        summary_text.value = Number(num) + Number(summary_text.value)
        add_history(combination_text.value + " " + summary_text.value)
    }
    flag2 = true
}

summary_button.addEventListener('click', summ)

Array.from(num_buttons).forEach(button => {
    button.addEventListener('click', add_num);
});
Array.from(option_buttons).forEach(button => {
    button.addEventListener('click', add_option);
});

document.getElementById("ac").addEventListener("click", clear_all);

document.getElementById("c").addEventListener("click", function(event){
    summary_text.value = "0";
});

document.getElementById("del").addEventListener("click", function(event){
    const currentValue = summary_text.value;
    if (currentValue.length > 1)
        summary_text.value = currentValue.slice(0, -1); 
    else
        summary_text.value = 0

});
document.getElementById('clear-history').addEventListener("click", clear_history)