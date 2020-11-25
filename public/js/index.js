//Import of elements
import {Factoria} from './factoria.js';
import {Validator} from '../../lib/validatorMovies.class.js';
import {MessageBox} from './messageBox.class.js';
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

//------------------ CALLBACKS -------------------//
const formRegisterCallback = (ret, callbackData) => {
    if (ret)
    {
        fetch("http://localhost:8888/register", {
            method: 'POST',
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
                        document.querySelector("#userMovies").value = "";
                        document.querySelector("#claveMovies").value = "";
                        break;
                    }
                case 1:
                    {
                        document.querySelector("#loginContainer").className = "";
                        document.querySelector("#userMovies").value = "";
                        document.querySelector("#claveMovies").value = "";
                        break;
                    }
            }//switch
        });
    }
    else
    {
        document.querySelector("#loginContainer").className = "";
        document.querySelector("#userMovies").value = "";
        document.querySelector("#claveMovies").value = "";
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
    const user = document.querySelector("#userMovies").value;
    //Get password user input
    const pass = document.querySelector("#claveMovies").value;

    //EMAIL
    const validator = new Validator();
    if (!validator.ValidateEmail(user))
        return;

    //PASSWORD
    if (!validator.ValidatePassword(pass, /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/))
        return;

    //Create json with credentials
    const credentials = {
        "user" : user,
        "pass" : pass
    };

    fetch("http://localhost:8888/login", {
        method: 'POST',
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
                                break;
                            }
                        case "usuario":
                            {
                                //Access as user
                                console.log("Login aceptado como usuario");
                                //window.location.assign("quiz.html");
                                break;
                            }
                    }//switch
                    break;
                }
        }//switch
    });
});

document.querySelector("#userMovies").value = "";
document.querySelector("#claveMovies").value = "";