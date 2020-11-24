import { Factoria } from "./factoria.js";
import { MessageBox } from "./messageBox.class.js";
import {Validator} from '../../lib/validatorMovies.class.js';

export class FormRegister{
    constructor(callbacAction)
    {
        this.callback = callbacAction;
        this.nodeForm = Factoria("form", [  ["id", "formRegister"],
                                            ["name", "formRegister"],
                                            ["action", ""],
                                            ["method", "POST"]], "");
        this.createWindow();
    }

    createWindow()
    {
        const nodeContUserData = Factoria("div", [["id", "contUserData"], ["class", "contUserData"]], "");
            //PHOTO CONTROL
                const nodePhotoFrame = Factoria("div", [["class", "editElements"]], "");
                let nodeImage = Factoria("img", [   ["id", "userPhoto"],
                                                    ["src", "./assets/nophoto.png"],
                                                    ["alt", "foto del usuario"]], "");
                const nodeFile = Factoria("input", [["type", "file"],
                                                    ["name", "photo"],
                                                    ["id", "userPhotoFile"]], "");
                                                    
                nodePhotoFrame.append(nodeImage, nodeFile);
            nodeContUserData.appendChild(nodePhotoFrame);
            //NAME EDIT CONTROL
            const nodeEditName = Factoria("div", [["class", "editElements"]], "");
                let nodeLabelEdit = Factoria("label", [["for", "userName"]], "Nombre:");
                let nodeInputEdit = Factoria("input", [ ["type", "text"],
                                                        ["name", "userName"],
                                                        ["id", "userName"],
                                                        ["placeholder", "nombre"],
                                                        ["tabindex", "1"],
                                                        ["autofocus", "true"]], "");
            nodeEditName.appendChild(nodeLabelEdit);
            nodeEditName.appendChild(nodeInputEdit);
        nodeContUserData.appendChild(nodeEditName);
            //SURNAME EDIT CONTROL
            const nodeEditSurname = Factoria("div", [["class", "editElements"]], "");
                nodeLabelEdit = Factoria("label", [["for", "userSurname"]], "Apellido:");
                nodeInputEdit = Factoria("input", [ ["type", "text"],
                                                        ["name", "userSurname"],
                                                        ["id", "userSurname"],
                                                        ["placeholder", "apellido"],
                                                        ["tabindex", "2"],
                                                        ["autofocus", "true"]], "");
            nodeEditSurname.appendChild(nodeLabelEdit);
            nodeEditSurname.appendChild(nodeInputEdit);
        nodeContUserData.appendChild(nodeEditSurname);
            //BIRTHDAY CONTROL
            const nodeEditBirthday = Factoria("div", [["class", "editElements"]], "");
                nodeLabelEdit = Factoria("label", [["for", "birthdayUser"]], "Fecha de nacimiento:");
                nodeInputEdit = Factoria("input", [ ["type", "date"],
                                                    ["name", "birthdayUser"],
                                                    ["id", "birthdayUser"],
                                                    ["tabindex", "3"],
                                                    ["autofocus", "true"],
                                                    ["required", "true"]], "");
            nodeEditBirthday.appendChild(nodeLabelEdit);
            nodeEditBirthday.appendChild(nodeInputEdit);
        nodeContUserData.appendChild(nodeEditBirthday);
            //NIF CONTROL
            const nodeEditNIF = Factoria("div", [["class", "editElements"]], "");
                nodeLabelEdit = Factoria("label", [["for", "NIFUser"]], "NIF/NIE:");
                nodeInputEdit = Factoria("input", [ ["type", "text"],
                                                    ["name", "NIFUser"],
                                                    ["id", "NIFUser"],
                                                    ["placeholder", "NIF/NIE"],
                                                    ["tabindex", "4"],
                                                    ["autofocus", "true"],
                                                    ["required", "true"]], "");
            nodeEditNIF.appendChild(nodeLabelEdit);
            nodeEditNIF.appendChild(nodeInputEdit);
        nodeContUserData.appendChild(nodeEditNIF);
            //USER EMAIL CONTROL
            const nodeEditEmail = Factoria("div", [["class", "editElements"]], "");
                nodeLabelEdit = Factoria("label", [["for", "userQuiz"]], "Usuario (email):");
                nodeInputEdit = Factoria("input", [ ["type", "email"],
                                                    ["name", "userEmail"],
                                                    ["id", "userEmail"],
                                                    ["placeholder", "email usuario"],
                                                    ["tabindex", "5"],
                                                    ["autofocus", "true"],
                                                    ["required", "true"]], "");
            nodeEditEmail.appendChild(nodeLabelEdit);
            nodeEditEmail.appendChild(nodeInputEdit);
        nodeContUserData.appendChild(nodeEditEmail);
            //PASSWORD CONTROL
            const nodeEditPass = Factoria("div", [["class", "editElements"]], "");
                nodeLabelEdit = Factoria("label", [["for", "passUser"]], "Contraseña:");
                nodeInputEdit = Factoria("input", [ ["type", "password"],
                                                    ["name", "passUser"],
                                                    ["id", "passUser"],
                                                    ["placeholder", "contraseña"],
                                                    ["tabindex", "6"],
                                                    ["autofocus", "true"],
                                                    ["required", "true"]], "");
            nodeEditPass.appendChild(nodeLabelEdit);
            nodeEditPass.appendChild(nodeInputEdit);
        nodeContUserData.appendChild(nodeEditPass);
        //FORM BUTTONS
        const nodeBtnsContainer = Factoria("div", [["id", "btnsContainerRegister"]], "");
            const nodeBtnSubmit = Factoria("button", [  ["type", "button"],
                                                        ["id", "btnRegisterSubmit"],
                                                        ["class", "btn"]], "Registrar");
        
            const nodeBtnCancel = Factoria("button", [  ["type", "button"],
                                                        ["id", "btnRegisterCancel"],
                                                        ["class", "btn"]], "Cancelar");
        nodeBtnsContainer.appendChild(nodeBtnSubmit);
        nodeBtnsContainer.appendChild(nodeBtnCancel);

        this.nodeForm.appendChild(nodeContUserData);
        this.nodeForm.appendChild(nodeBtnsContainer);

        //EVENT HANDLING
        nodeFile.addEventListener("change", (evnt) => {this.OnChangeFile(evnt)});
        nodeImage.addEventListener("click", (evnt) => {this.OnSelectPhoto(evnt)});
        nodeBtnSubmit.addEventListener("click", (evnt) => {this.OnClickedRegister(evnt)});
        nodeBtnCancel.addEventListener("click", (evnt) => {this.OnClickedCancel(evnt)});
    }

    OnChangeFile(evnt)
    {
        const photoFile = evnt.currentTarget.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(photoFile);
        reader.onload = function(e){
            document.querySelector("#userPhoto").setAttribute("src", e.target.result);
        }
    }

    OnSelectPhoto(evnt)
    {
        document.querySelector("#userPhotoFile").click();
    }

    OnClickedRegister(evnt)
    {
        //Validate form data
        //NAME up to the user, can be null, nothing to check
        //SURNAME up to the user, can be null, nothing to check
        //EMAIL not null, valid email structure
        //PASSWORD not null, between 6 - 10 characters, must have letters, numbers and some special characters
        //BIRTHDAY dd/mm/yyyy format not null. The user must be adult (>= 18)
        //NIF not null, X******X, ********X

        //EMAIL
        //Retrieve data
        const userEmail = document.querySelector("#userEmail").value;
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
        const validator = new Validator(userEmail, constraints);
        if (!validator.Validate())
            return;
    
        //PASSWORD
        //Retrieve data
        const passUser = document.querySelector("#passUser").value;
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
        validator.setData(passUser);
        validator.setConstraints(constraints);
        if (!validator.Validate())
            return;

        //BIRTHDAY
        //Retrieve data
        const birthdayUser = document.querySelector("#birthdayUser").value;
        constraints = {
            type : "DATE",
            regex : "",
            empty : false,
            date : {
                upperLimit : "today",
                lowerLimit : "01/01/1900"
            },
            callback : this.adultCheck
        };
        validator.setData(birthdayUser);
        validator.setConstraints(constraints);
        if (!validator.Validate())
            return;

        //NIF/NIE
        //Retrieve data
        const NIFUser = document.querySelector("#NIFUser").value;
        constraints = {
            type : "NIF/NIE",
            regex : "",
            empty : false
        };
        validator.setData(NIFUser);
        validator.setConstraints(constraints);
        if (!validator.Validate())
            return;

        //Create JSON object with register data
        const registerData = {
                dateBirth : birthdayUser,
                email : userEmail,
                nif : NIFUser,
                password : passUser,
                profile : "player"
        };

        this.callback(true, registerData);
        this.nodeForm.remove();  
    }

    OnClickedCancel(evnt)
    {
        const ret = {
            "res" : 0,
            "msg" : "cancel"
        };
        this.nodeForm.remove();      
        this.callback(false, ret);
    }

    adultCheck(date)
    {
        //Check out if new user is adult
        let ret = {
            result : false,
            msg : []
        };
        
        const today = Date();
        const todayMilliseconds = Date.parse(today);
        const splitDate = date.split("-");
        const adult = new Date(parseInt(splitDate[0]) + 18, parseInt(splitDate[1]) - 1, parseInt(splitDate[2]));
        const adultMilliseconds = Date.parse(adult);
        const diff = todayMilliseconds - adultMilliseconds;
        if (diff >= 0)
        {
            ret.result = true;
        } else {
            ret.msg.push({
                "caption" : `Lo sentimos, pero debes ser mayor de edad para registrarte`,
                "class" : "highText"
            });
        }
        return ret;
    }
};