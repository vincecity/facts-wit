# Project Info
# This info is presented in a widget when you share.
# http://framerjs.com/docs/#info.info

Framer.Info =
	title: ""
	author: "Vincent Faure"
	twitter: ""
	description: ""



bg = new Layer
	width: 750
	height: 1334
	backgroundColor: "rgba(136,132,255,1)"

inputLayer = new Layer
	width: 702
	height: 214
	backgroundColor: "rgba(136,132,255,1)"
	style:
		padding:"20px";
	html: """<input id="question" type="text" style="width:100%;height:160px; background-color:transparent; border-bottom:solid white 1px; box-sizing:border-box;">"""
	y: 312
	x: 24



Utils.insertCSS("""
	input[type=text] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    font-size:60px;
    color:white;
    outline: none;
}
""")




inputLayer.states.add
	bottom:
		y: 1120
		x: 24
		backgroundColor: "rgba(106,220,229,1)"

	
bg.states.add
	stateA:
		backgroundColor: "rgba(106,220,229,1)"
		



		
Events.wrap(document.getElementById("question")).addEventListener "blur", (event) ->
    inputLayer.states.switch("bottom")
    bg.states.switch("stateA")

Events.wrap(document.getElementById("question")).addEventListener "focus", (event) ->
    inputLayer.states.switch("default")
    bg.states.switch("default")
    
    
Events.wrap(document.getElementById("question")).addEventListener "keyup", (event) ->
	print event.keyCode.parseInt()
	if event.keyCode is "13"
		this.blur()

#document.getElementById("question").focus()