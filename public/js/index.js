//Import of elements
import {Question} from './question.class.js';
import {Factoria} from './factoria.js';
import {Validator} from '../../lib/validator.class.js';
import {MessageBox} from './messageBox.class.js';
import {FormQuestion} from './formQuestion.class.js';
import {FormRegister} from './formRegister.class.js';

//------------------ NAV BAR -------------------//
/*
CREATION OF NAV BAR
Nav Bar appears at the top of the page to handle edition operations
*/
const createNavBar = () => {
    const nodeNavBar = Factoria("div", [["id", "navBar"]], "");
        const nodeBtnCreate = Factoria("div", [["id", "btnCreate"]], "Insertar Pregunta");
            const nodeCreateIcon = Factoria("i", [["class", "fas fa-plus"]], "");
        nodeBtnCreate.appendChild(nodeCreateIcon);
        const nodeBtnGetBack = Factoria("div", [["id", "btnGetBack"]], "Volver");
            const nodeGetBackIcon = Factoria("i", [["class", "fas fa-sign-out-alt"]], "");
        nodeBtnGetBack.appendChild(nodeGetBackIcon);
    nodeNavBar.appendChild(nodeBtnCreate);
    nodeNavBar.appendChild(nodeBtnGetBack);

    nodeBtnCreate.addEventListener("click", OnClickCreate);
    nodeBtnGetBack.addEventListener("click", OnClickGetBack);

    return nodeNavBar;
}//createNavBar
//NAV BAR´s event handlers for its buttons
const OnClickCreate = () => {
    let questionForm = new FormQuestion("INSERT", "", null, formCallback);
    document.querySelector("main").appendChild(questionForm.nodeForm);
    document.querySelector("#questionsList").className = "modal";
    document.querySelector("#formQuestion").className = "movFormNewQuestion";
}//OnClickCreate

const OnClickGetBack = () => {
    document.querySelector("#navBar").remove();
    document.querySelectorAll(".questionCard").forEach(element => element.remove());
    document.querySelector("#loginContainer").className = "";
    document.querySelector("#buttonContainer").className = "";
}//OnClickGetBack

//------------------ CARD -------------------//
/*
CREATION OF CARD
Each card is a div to represent data for each question
All cards for all the questions are piled up
*/
const createCard = (id, data) => {
    const nodeCard  = Factoria("div", [ ["class", "questionCard"],
                                        ["data-id", id]], "");
    const nodeId    = Factoria("p", [["class", "questionId"]], id);
    const nodeTitle = Factoria("p", [["class", "questionTitle"]], data.title);
    const nodeButtonsContainer = Factoria("div", [["class", "buttonsContainer"]], "");
    const nodeBtnEdit       = Factoria("div", [["class", "btnEdit"]], "");
    const nodeEditIcon      = Factoria("i", [["class", "fas fa-pencil-alt"]], "");
    const nodeBtnDelete     = Factoria("div", [["class", "btnDelete"]], "");
    const nodeDeleteIcon    = Factoria("i", [["class", "fas fa-trash-alt"]], "");

    nodeBtnEdit.appendChild(nodeEditIcon);
    nodeBtnDelete.appendChild(nodeDeleteIcon);

    nodeButtonsContainer.appendChild(nodeBtnEdit);
    nodeButtonsContainer.appendChild(nodeBtnDelete);

    nodeCard.appendChild(nodeId);
    nodeCard.appendChild(nodeTitle);
    nodeCard.appendChild(nodeButtonsContainer);

    nodeBtnEdit.addEventListener("click", evento => {
        const msg = [
            {
                "caption" : "¿Desea editar la pregunta siguiente?",
                "class" : "highText"
            },
            {
                "caption" : id,
                "class" : "id"
            },
            {
                "caption" : data.title,
                "class" : "mainText"
            },
        ];
        const cfg = {
            "operation" : "Edit",
            "btn1Caption" : "Editar",
            "btn2Caption" : "Cancelar"
        };
        let message = new MessageBox(msg, cfg, operate);
        message.DoModal();
    });
    nodeBtnDelete.addEventListener("click", evento => {
        const msg = [
            {
                "caption" : "¿Desea eliminar la pregunta siguiente?",
                "class" : "highText"
            },
            {
                "caption" : id,
                "class" : "id"
            },
            {
                "caption" : data.title,
                "class" : "mainText"
            },
        ];
        const cfg = {
            "operation" : "Delete",
            "btn1Caption" : "Delete",
            "btn2Caption" : "Cancel"
        };
        let message = new MessageBox(msg, cfg, operate);
        message.DoModal();
    });

    return nodeCard;
}//createCard

//------------------ CALLBACKS -------------------//
//Callback function to use inside cards in response to edition and deletion operations
const operate = (code) => {
    if (code.res === 1)
    {
        switch(code.operation)
        {
            case "Delete"://DELETE
            {
                console.log("Se eliminará ",code.data[1].caption);
                fetch("http://localhost:8888/deleteQuestion", {
                    method: 'DELETE',
                    headers: {
                        'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Headers' : '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"data" : code.data[1].caption})
                    }
                ).then(res => res.text()).then(data => {
                    if (data === 'ok')
                    {
                        //question deleted
                        document.querySelector(`#questionsList div[data-id=${code.data[1].caption}]`).remove();
                    }//if
                    else
                    {
                        //question not deleted
                        const msg = [
                            {
                                "caption" : "No ha sido posible eliminar la pregunta",
                                "class" : "highText"
                            }
                        ];
                        const cfg = {
                            "operation" : "Inform",
                            "btn1Caption" : "",
                            "btn2Caption" : ""
                        };
                        let message = new MessageBox(msg, cfg, null);
                        message.DoModal();
                    }//else
                });
                break;
            }
            case "Edit"://EDIT
            {
                console.log("Se editará ",code.data[1].caption);
                fetch("http://localhost:8888/question", {
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Headers' : '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"data" : code.data[1].caption})
                    }
                ).then(res => res.json()).then(data => {
                        console.log(data);
                        let questionForm = new FormQuestion("EDIT",
                                                            code.data[1].caption,
                                                            new Question(data),
                                                            formCallback);
                        document.querySelector("main").appendChild(questionForm.nodeForm);
                        document.querySelector("#questionsList").className = "modal";
                        document.querySelector("#formQuestion").className = "movFormNewQuestion";
                });
                break;
            }
        }//switch
    }//if
}//operate

const formCallback = (callbackData) => {
    if (callbackData.res === 1)
    {
        switch(callbackData.mode)
        {
            case "EDIT":
                {
                    fetch("http://localhost:8888/updateQuestion", {
                        method: 'PUT',
                        headers: {
                            'Access-Control-Allow-Origin' : '*',
                            'Access-Control-Allow-Headers' : '*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(callbackData.questionData)
                        }
                    ).then(res => res.text()).then(data => {
                        if (data === "ok")
                        {
                            //Question udated, so update the list
                            document.querySelector("#questionsList").className = "";
                            document.querySelectorAll(".questionCard").forEach(element => {
                                if (element.dataset.id === callbackData.questionData.id)
                                {
                                    element.querySelectorAll(".questionTitle")[0].innerText = callbackData.questionData.data.title;

                                }//if
                            });
                        }//if
                    });
                    break;
                }
            case "INSERT":
                {
                    fetch("http://localhost:8888/nextIDCount").then(res => res.json()).then(data => {
                        let nextCount = data;
                        ++nextCount;
                        let key = `question${data}`;

                        let insertion = {};
                        const question = {};
                
                        question[key] = callbackData.questionData.data;
                
                        insertion = {
                            "nextCount" : nextCount,
                            "data" : question
                        };

                        fetch("http://localhost:8888/newQuestion", {
                            method: 'POST',
                            headers: {
                                'Access-Control-Allow-Origin' : '*',
                                'Access-Control-Allow-Headers' : '*',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(insertion)
                            }
                        ).then(res => res.text()).then(data => {
                            if (data === "ok")
                            {
                                //Insert another card with the new question at the bottom
                                document.querySelector("#questionsList").className = "";

                                document.querySelector("#questionsList").appendChild(createCard(key, new Question(callbackData.questionData.data)));
                            }//if
                        });
                    });   
                    break;
                }
        }//switch
    }//if
    else
    {
        document.querySelector("#questionsList").className = "";
    }//else
}//formCallback

const formRegisterCallback = (ret, callbackData) => {
    if (ret)
    {
        fetch("http://localhost:8888/register", {
            method: 'POST',
            //credentials: 'omit',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers' : '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(callbackData)
            }
        ).then(res => res.json()).then(data => {
            switch (data.res)
            {
                case 0:
                    {
                        const msg = [
                            {
                                "caption" : data.msg,
                                "class" : "highText"
                            }
                        ];
                        const cfg = {
                            "operation" : "Inform",
                            "btn1Caption" : "",
                            "btn2Caption" : ""
                        };
                        let message = new MessageBox(msg, cfg, null);
                        message.DoModal();
                        document.querySelector("#loginContainer").className = "";
                        document.querySelector("#userQuiz").value = "";
                        document.querySelector("#claveQuiz").value = "";
                        break;
                    }
                case 1:
                    {
                        document.querySelector("#loginContainer").className = "";
                        document.querySelector("#userQuiz").value = "";
                        document.querySelector("#claveQuiz").value = "";
                        break;
                    }
            }//switch
        });
    }
    else
    {
        document.querySelector("#loginContainer").className = "";
        document.querySelector("#userQuiz").value = "";
        document.querySelector("#claveQuiz").value = "";
    }//else

};//formRegisterCallback

//------------------ EVENT LISTENERS -------------------//
//REGISTER USER (POST)
document.querySelector("#signUp").addEventListener("click", (evento) => {
    document.querySelector("#loginContainer").className = "unvisible";
    document.querySelector("main").appendChild(new FormRegister(formRegisterCallback).nodeForm);
    document.querySelector("#formRegister").className = "movFormRegister";
});
//LOGIN USER
document.querySelector("#loginContainer").addEventListener("submit", evento => {
    evento.preventDefault();

    //Validate form data
    //Get email user input
    const user = document.querySelector("#userQuiz").value;
    //Get password user input
    const pass = document.querySelector("#claveQuiz").value;

    //EMAIL
    let constraints = {
        type : "EMAIL",
        regex : "",
        empty : false,
        digit : {
            type : undefined,
            upperLimit : undefined,
            lowerLimit : undefined
        }
    };
    const validator = new Validator(user, constraints);
    if (!validator.Validate())
        return;

    //PASSWORD
    constraints = {
        type : "PASSWORD",
        regex : /[\w\dñÑ#\*%&$]{1,}/,
        empty : false,
        digit : {
            type : undefined,
            upperLimit : undefined,
            lowerLimit : undefined
        }
    };
    validator.setData(pass);
    validator.setConstraints(constraints);
    if (!validator.Validate())
        return;

    //Create json with credentials
    const credentials = {
        "user" : user,
        "pass" : pass
    };

    fetch("http://localhost:8888/login", {
        method: 'POST',
        //credentials: 'omit',
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Headers' : '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
        }
    ).then(res => res.json()).then(data => {
        switch (data.res)
        {
            case "0":
                {
                    //Access failed
                    const msg = [
                        {
                            "caption" : data.msg,
                            "class" : "highText"
                        }
                    ];
                    const cfg = {
                        "operation" : "Inform",
                        "btn1Caption" : "",
                        "btn2Caption" : ""
                    };
                    let message = new MessageBox(msg, cfg, null);
                    message.DoModal();
                    break;
                }
            case "1":
                {
                    //Access granted
                    switch (data.msg)
                    {
                        case "admin":
                            {
                                //Access as administrator
                                document.querySelector("#loginContainer").className = "unvisible";
                                //document.querySelector("#buttonContainer").className = "unvisible";
            
                                fetch("http://localhost:8888/questions").then(d => d.json()).then(d => {
                                    document.querySelector("#questionsList").appendChild(createNavBar());
                                    
            
                                    let questionsIDs = Object.keys(d);
                                    let questionsList = Object.values(d).map(question => new Question(question));
            
                                    questionsList.map((question, index) => {
                                        document.querySelector("#questionsList").appendChild(createCard(questionsIDs[index], question));
                                    });
                                    
                                });
                                break;
                            }
                        case "player":
                            {
                                //Access as player
                                //console.log(document.cookie);
                                //console.log("Login aceptado como player");
                                window.location.assign("quiz.html");
                                break;
                            }
                    }//switch
                    break;
                }
        }//switch
        /*
        switch (data)
        {
            case '-1'://Error
                {  
                    console.log('error');
                    break;
                }
            case '0'://Wrong credentials
                {
                    console.log('wrong credentials');
                    const messageBox = Factoria("div", [["id", "messageBox"]], "Credenciales erróneas!");
                    document.querySelector("#loginContainer").insertBefore(messageBox, document.querySelector("#loginContainer > div:first-child"));
                    setTimeout(() => {
                        document.querySelector("#messageBox").remove();
                    }, 5000);
                    break;
                }
            case '1'://Login OK
                {
                    console.log('Login OK');
                    document.querySelector("#loginContainer").className = "unvisible";
                    document.querySelector("#buttonContainer").className = "unvisible";

                    fetch("http://localhost:8888/questions").then(d => d.json()).then(d => {
                        document.querySelector("#questionsList").appendChild(createNavBar());
                        

                        let questionsIDs = Object.keys(d);
                        let questionsList = Object.values(d).map(question => new Question(question));

                        questionsList.map((question, index) => {
                            document.querySelector("#questionsList").appendChild(createCard(questionsIDs[index], question));
                        });
                        
                    });
                    break;
                }
        }//switch
        */
    });
});

document.querySelector("#userQuiz").value = "";
document.querySelector("#claveQuiz").value = "";