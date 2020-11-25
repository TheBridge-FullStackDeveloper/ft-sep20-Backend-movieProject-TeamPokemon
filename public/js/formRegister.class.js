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
            //USER EMAIL CONTROL
            const nodeEditEmail = Factoria("div", [["class", "editElements"]], "");
                let nodeLabelEdit = Factoria("label", [["for", "userQuiz"]], "Usuario (email):");
                let nodeInputEdit = Factoria("input", [ ["type", "email"],
                                                    ["name", "userEmail"],
                                                    ["id", "userEmail"],
                                                    ["placeholder", "email usuario"],
                                                    ["tabindex", "1"],
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
                                                    ["tabindex", "2"],
                                                    ["autofocus", "true"],
                                                    ["required", "true"]], "");
            nodeEditPass.appendChild(nodeLabelEdit);
            nodeEditPass.appendChild(nodeInputEdit);
        nodeContUserData.appendChild(nodeEditPass);
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
            //PHONE CONTROL
            const nodeEditPhone = Factoria("div", [["class", "editElements"]], "");
                nodeLabelEdit = Factoria("label", [["for", "PhoneUser"]], "Teléfono:");
                nodeInputEdit = Factoria("input", [ ["type", "text"],
                                                    ["name", "PhoneUser"],
                                                    ["id", "PhoneUser"],
                                                    ["placeholder", "Teléfono"],
                                                    ["tabindex", "5"],
                                                    ["autofocus", "true"],
                                                    ["required", "true"]], "");
            nodeEditPhone.appendChild(nodeLabelEdit);
            nodeEditPhone.appendChild(nodeInputEdit);
        nodeContUserData.appendChild(nodeEditPhone);
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
        nodeBtnSubmit.addEventListener("click", (evnt) => {this.OnClickedRegister(evnt)});
        nodeBtnCancel.addEventListener("click", (evnt) => {this.OnClickedCancel(evnt)});
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
        const validator = new Validator();
        if (!validator.ValidateEmail(userEmail))
            return;
    
        //PASSWORD
        //Retrieve data
        const passUser = document.querySelector("#passUser").value;
        if (!validator.ValidatePassword(passUser, /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/))
            return;

        //BIRTHDAY
        //Retrieve data
        const birthdayUser = document.querySelector("#birthdayUser").value;
        if (!validator.ValidateDate(birthdayUser))
            return;

        //NIF/NIE
        //Retrieve data
        const NIFUser = document.querySelector("#NIFUser").value;
        if (!validator.ValidateNIF(NIFUser))
            return;

        //PHONE
        //Retrieve data
        const PhoneUser = document.querySelector("#PhoneUser").value;
        if (!validator.ValidatePhone(PhoneUser, /^(\+34 )*\d{9}$/))
            return;

        //Create JSON object with register data
        const registerData = {
                "dateBirth" : birthdayUser,
                "email" : userEmail,
                "nif" : NIFUser,
                "password" : passUser,
                "phone": PhoneUser,
                "profile" : "user"
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
};