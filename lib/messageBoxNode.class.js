const Factoria = require("./factoriaNode.js");

class MessageBox{
	constructor(msg, cfg, callbackAction) {
		this.msg = msg;
		this.operation = cfg.operation;
		this.btnOk = cfg.btn1Caption;
		this.btnCancel = cfg.btn2Caption;
		this.callback = callbackAction;
		this.nodeFrame = Factoria("div", [["id", "frame"]], "");
		this.createWindow();
	}

	createWindow() {
		this.msg.map((element) => {
			this.nodeFrame.appendChild(Factoria("p", [["class", element.class]], element.caption));
		});
		if (this.operation !== "Inform") {
			const nodeButtonsContainer = Factoria("div", [["id", "buttonsContainer"]], "");
			const nodeBtnOk = Factoria("button", [ ["type", "button"],
				["id", "btnOk"],
				["class", "buttons"]], this.btnOk);
			const nodeBtnCancel = Factoria("button", [ ["type", "button"],
				["id", "btnCancel"],
				["class", "buttons"]], this.btnCancel);

			nodeBtnOk.addEventListener("click", () => {
				this.OnBtnOk();
			});
			nodeBtnCancel.addEventListener("click", () => {
				this.OnBtnCancel();
			});

			nodeButtonsContainer.appendChild(nodeBtnOk);
			nodeButtonsContainer.appendChild(nodeBtnCancel);

			this.nodeFrame.appendChild(nodeButtonsContainer);
		}
	}

	OnBtnOk() {
		const ret = {
			"operation" : this.operation,
			"res" : 1,
			"data" : this.msg};
		document.querySelector("main").className = "";
		this.nodeFrame.remove();
		this.callback(ret);
	}

	OnBtnCancel() {
		const ret = {
			"operation" : this.operation,
			"res" : 0,
			"data" : this.msg};
		document.querySelector("main").className = "";
		this.nodeFrame.remove();
		this.callback(ret);
	}

	DoModal() {
		const modalTimeout = 5000;
		document.querySelector("body").appendChild(this.nodeFrame);
		document.querySelector("main").className = "modal";
		if (this.operation === "Inform") {
			setTimeout(() => {
				this.nodeFrame.remove();
				document.querySelector("main").className = "";
			}, modalTimeout);
		}
	}

}

module.exports = MessageBox;