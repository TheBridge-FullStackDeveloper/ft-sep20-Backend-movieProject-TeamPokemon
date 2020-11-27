import {MessageBox} from "../public/js/messageBox.class.js";

export class Validator
{
    constructor(val, constraints)
    {
        this.data           = val;
        this.constraints    = constraints;
    }

    setData(val)
    {
        this.data = val;
    }
        
    setConstraints(cnstr)
    {
        this.constraints = cnstr;
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
            empty : false,
            digit : {
                type : undefined,
                upperLimit : undefined,
                lowerLimit : undefined
            }
        };
        this.setData(strEmail);
        this.setConstraints(constraints);
        return this.Validate();
    }

    ValidatePassword(strPass, strRegEx)
    {
        let constraints = {
            type : "PASSWORD",
            regex : strRegEx,
            empty : false,
            digit : {
                type : undefined,
                upperLimit : undefined,
                lowerLimit : undefined
            }
        };
        this.setData(strPass);
        this.setConstraints(constraints);
        return this.Validate();
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
        this.setData(strData);
        this.setConstraints(constraints);
        return this.Validate();
    }

    ValidateNIF(strNIF)
    {
        let constraints = {
            type : "NIF/NIE",
            regex : "",
            empty : false
        };
        this.setData(strNIF);
        this.setConstraints(constraints);
        return this.Validate();
    }

    ValidatePhone(strPhone, strRegEx)
    {
        let constraints = {
            type : "PHONE",
            regex : strRegEx,
            empty : false
        };
        this.setData(strPhone);
        this.setConstraints(constraints);
        return this.Validate();
    }
    
    Validate()
    {
        //Checkout emptyness
        if (!this.constraints.empty)
        {
            //Data must not be empty
            if (this.data == "")
            {
                let msg = undefined;
                switch (this.constraints.type)
                {
                    case "EMAIL":
                        {
                            msg = [
                                {
                                    "caption" : "Dirección de correo electrónico vacía!",
                                    "class" : "highText"
                                }];
                            break;
                        }
                    case "PASSWORD":
                        {
                            msg = [
                                {
                                    "caption" : "Contraseña vacía!",
                                    "class" : "highText"
                                }];
                            break;
                        }
                    case "DATE":
                        {
                            msg = [
                                {
                                    "caption" : "Fecha de nacimiento vacía!",
                                    "class" : "highText"
                                }];
                            break;
                        }
                    case "NIF/NIE":
                        {
                            msg = [
                                {
                                    "caption" : "Documento de identificación vacío!",
                                    "class" : "highText"
                                }];
                            break;
                        }
                    case "PHONE":
                        {
                            msg = [
                                {
                                    "caption" : "Teléfono vacío!",
                                    "class" : "highText"
                                }];
                            break;
                        }
                }
                this.LauchMessage(msg);
                return false;
            }
        }
        switch (this.constraints.type)
        {
            case "EMAIL":
                {
                    if (this.constraints.regex !== "")
                    {
                        //Validate through incoming regex
                    } else {
                        //Validate through predefined regex
                        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                        if (!re.test(this.data))
                        {
                            const msg = [
                                {
                                    "caption" : "Dirección de correo electrónico no válida!",
                                    "class" : "highText"
                                }
                            ];
                            this.LauchMessage(msg);
                            return false;
                        }
                    }
                    break;
                }
            case "PASSWORD":
                {
                    if (this.constraints.regex !== "")
                    {
                        //Validate through incoming regex
                        if (!this.constraints.regex.test(this.data))
                        {
                            const msg = [
                                {
                                    "caption" : "Contraseña no válida!",
                                    "class" : "highText"
                                }
                            ];
                            this.LauchMessage(msg);
                            return false;
                        }
                    } else {
                        //Validate through predefined regex
                    }
                    break;
                }
            case "DATE":
                {
                    if (this.constraints.regex !== "")
                    {
                        //Validate through incoming regex
                    } else {
                        //Validate through predefined regex
                        const re = /(19\d\d|20([0-4]\d|50))-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/;

                        if (!re.test(this.data))
                        {
                            const msg = [
                                {
                                    "caption" : "Fecha inválida! El formato ha de ser dd/mm/aaaa",
                                    "class" : "highText"
                                }
                            ];
                            this.LauchMessage(msg);
                            return false;
                        }
                    }

                    //Check out upper limit
                    if (this.constraints.date.upperLimit === "today")
                    {
                        let inTheFuture = false;
                        const today = new Date();
                        let todayYear = today.getFullYear();
                        let todayMonth = today.getMonth();
                        let todayDate = today.getDate();
                        const splitDate = this.data.split("-");
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
                            const msg = [
                                {
                                    "caption" : "La fecha introducida es del futuro!",
                                    "class" : "highText"
                                }
                            ];
                            this.LauchMessage(msg);
                            return false;
                        }
                    }

                    //Check out any additional condition
                    if (this.constraints.callback !== undefined)
                    {
                        const callbackRet = this.constraints.callback(this.data);
                        if (!callbackRet.result)
                        {
                            this.LauchMessage(callbackRet.msg);
                            return false;
                        }
                    }
                    break;
                }
            case "NIF/NIE":
                {
                    if (this.constraints.regex !== "")
                    {
                        //Validate through incoming regex
                    } else {
                        //Validate through predefined regex
                        const re = /(([XYZ\d])\d{7})([A-HJ-NP-TV-Z])/;
                        
                        if (!re.test(this.data))
                        {
                            const msg = [
                                {
                                    "caption" : "Documento de identificación no válido!",
                                    "class" : "highText"
                                }
                            ];
                            this.LauchMessage(msg);
                            return false;
                        }

                        //Formula validation
                        let num = undefined;
                        switch (this.data[0])
                        {
                            case "X":
                                {
                                    num = parseInt(this.data.replace("X","0").substring(0,8));
                                    break;
                                }
                            case "Y":
                                {
                                    num = parseInt(this.data.replace("Y","1").substring(0,8));
                                    break;
                                }
                            case "Z":
                                {
                                    num = parseInt(this.data.replace("Z","2").substring(0,8));
                                    break;
                                }
                            default:
                                {
                                    num = parseInt(this.data.substring(0,8));
                                    break;
                                }
                        }
                        if ("TRWAGMYFPDXBNJZSQVHLCKE"[num % 23] !== this.data[8])
                        {
                            const msg = [
                                {
                                    "caption" : "Documento de identificación erróneo!",
                                    "class" : "highText"
                                }
                            ];
                            this.LauchMessage(msg);
                            return false;
                        }
                    }
                    break;
                }
            case "PHONE":
                {
                    if (this.constraints.regex !== "")
                    {
                        //Validate through incoming regex
                        if (!this.constraints.regex.test(this.data))
                        {
                            const msg = [
                                {
                                    "caption" : "Número de teléfono no válido!",
                                    "class" : "highText"
                                }
                            ];
                            this.LauchMessage(msg);
                            return false;
                        }
                    } else {
                        //Validate through predefined regex
                    }
                }
        }
        return true;
    }
};