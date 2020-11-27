import {MessageBox} from "../public/js/messageBox.class.js";

export class Validator
{
    constructor(val, constraints)
    {
        this.data           = val;
        this.constraints    = constraints;
    }

    LauchMessage(msg)
    {
        const cfg = {
            "operation" : "Inform",
            "btn1Caption" : "",
            "btn2Caption" : ""
        };
        let message = new MessageBox(msg, cfg, null);
        message.DoModal();
    }

    ValidateEmail(strEmail)
    {
        let constraints = {
            type : "EMAIL",
            regex : "",
            empty : false
        };

        //Checkout emptyness
        if (!constraints.empty) {
            //Data must not be empty
            if (strEmail == "") {
                this.LauchMessage(  [{
                                    "caption" : "Dirección de correo electrónico vacía!",
                                    "class" : "highText"
                                    }]);
                return false;
            }
        }

        if (constraints.regex !== "") {
            //Validate through incoming regex
        } else {
            //Validate through predefined regex
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (!re.test(strEmail))
            {
                this.LauchMessage(  [{
                                        "caption" : "Dirección de correo electrónico no válida!",
                                        "class" : "highText"
                                    }]);
                return false;
            }
        }
        return true;
    }

    ValidatePassword(strPass, strRegEx)
    {
        let constraints = {
            type : "PASSWORD",
            regex : strRegEx,
            empty : false
        };

        //Checkout emptyness
        if (!constraints.empty) {
            //Data must not be empty
            if (strPass == "") {
                this.LauchMessage(  [{
                                        "caption" : "Contraseña vacía!",
                                        "class" : "highText"
                                    }]);
                return false;
            }
        }

        if (constraints.regex !== "") {
            //Validate through incoming regex
            if (!constraints.regex.test(strPass))
            {
                this.LauchMessage(  [{
                                        "caption" : "Contraseña no válida!",
                                        "class" : "highText"
                                    }]);
                return false;
            }
        } else {
            //Validate through predefined regex
        }
        return true;
    }

    ValidateDate(strData)
    {
        let constraints = {
            type : "DATE",
            regex : "",
            empty : false,
            date : {
                upperLimit : "today",
                lowerLimit : "01/01/1900"
            },
        };

        //Checkout emptyness
        if (!constraints.empty) {
            //Data must not be empty
            if (strData == "") {
                this.LauchMessage(  [{
                                        "caption" : "Fecha de nacimiento vacía!",
                                        "class" : "highText"
                                    }]);
                return false;
            }
        }

        if (constraints.regex !== "")
        {
            //Validate through incoming regex
        } else {
            //Validate through predefined regex
            const re = /(19\d\d|20([0-4]\d|50))-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/;

            if (!re.test(strData))
            {
                this.LauchMessage(  [{
                                        "caption" : "Fecha inválida! El formato ha de ser dd/mm/aaaa",
                                        "class" : "highText"
                                    }]);
                return false;
            }
        }

        //Check out upper limit
        if (constraints.date.upperLimit === "today")
        {
            let inTheFuture = false;
            const today = new Date();
            let todayYear = today.getFullYear();
            let todayMonth = today.getMonth();
            let todayDate = today.getDate();
            const splitDate = strData.split("-");
            if (parseInt(splitDate[0]) > todayYear)
            {
                //Inserted birth year is higher than current so fails
                inTheFuture = true;
            } else {
                if (parseInt(splitDate[0]) === todayYear)
                {
                    //Inserted birth year is the same as current so further month checking is needed
                    if (parseInt(splitDate[1]) > (todayMonth + 1))
                    {
                        //Inserted birth month is higher than current on the same year so fails
                        inTheFuture = true;
                    } else {
                        if (parseInt(splitDate[1]) === (todayMonth + 1))
                        {
                            //Inserted birth month is the same as current so further day checkint is needed
                            if (parseInt(splitDate[2]) > todayDate)
                            {
                                //Inserted birth day is higher than current on the same year and month so fails
                                inTheFuture = true;
                            }
                        }
                    }
                }
                
            }
            if (inTheFuture)
            {   
                this.LauchMessage(  [{
                                        "caption" : "La fecha introducida es del futuro!",
                                        "class" : "highText"
                                    }]);
                return false;
            }
        }

        //Check out any additional condition
        if (constraints.callback !== undefined)
        {
            const callbackRet = constraints.callback(strData);
            if (!callbackRet.result)
            {
                this.LauchMessage(callbackRet.msg);
                return false;
            }
        }
        return true;
    }

    ValidateNIF(strNIF)
    {
        let constraints = {
            type : "NIF/NIE",
            regex : "",
            empty : false
        };

        //Checkout emptyness
        if (!constraints.empty) {
            //Data must not be empty
            if (strNIF == "") {
                this.LauchMessage(  [{
                                        "caption" : "Documento de identificación vacío!",
                                        "class" : "highText"
                                    }]);
                return false;
            }
        }

        if (constraints.regex !== "")
        {
            //Validate through incoming regex
        } else {
            //Validate through predefined regex
            const re = /(([XYZ\d])\d{7})([A-HJ-NP-TV-Z])/;
            
            if (!re.test(strNIF))
            {
                this.LauchMessage(  [{
                                        "caption" : "Documento de identificación no válido!",
                                        "class" : "highText"
                                    }]);
                return false;
            }

            //Formula validation
            let num = undefined;
            switch (strNIF[0])
            {
                case "X":
                    {
                        num = parseInt(strNIF.replace("X","0").substring(0,8));
                        break;
                    }
                case "Y":
                    {
                        num = parseInt(strNIF.replace("Y","1").substring(0,8));
                        break;
                    }
                case "Z":
                    {
                        num = parseInt(strNIF.replace("Z","2").substring(0,8));
                        break;
                    }
                default:
                    {
                        num = parseInt(strNIF.substring(0,8));
                        break;
                    }
            }
            if ("TRWAGMYFPDXBNJZSQVHLCKE"[num % 23] !== strNIF[8])
            {
                this.LauchMessage(  [{
                                        "caption" : "Documento de identificación erróneo!",
                                        "class" : "highText"
                                    }]);
                return false;
            }
        }
        return true;
    }

    ValidatePhone(strPhone, strRegEx)
    {
        let constraints = {
            type : "PHONE",
            regex : strRegEx,
            empty : false
        };

        //Checkout emptyness
        if (!constraints.empty) {
            //Data must not be empty
            if (strPhone == "") {
                this.LauchMessage(  [{
                                        "caption" : "Teléfono vacío!",
                                        "class" : "highText"
                                    }]);
                return false;
            }
        }

        if (constraints.regex !== "")
        {
            //Validate through incoming regex
            if (!constraints.regex.test(strPhone))
            {
                this.LauchMessage(  [{
                                        "caption" : "Número de teléfono no válido!",
                                        "class" : "highText"
                                    }]);
                return false;
            }
        } else {
            //Validate through predefined regex
        }
        return true;
    }
};