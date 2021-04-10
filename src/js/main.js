let cnv,ctx;
let DOTS=[],MS=[],SQUARE_COLORS=["#FF6103","#DC143C","#97FFFF","#FF3030","#00EE00","#FF69B4"],SCORE=0;
let squares=[],cur_sel=[];
function create_dots(w){
	w+=1
	var sx=250-(w*25-25/2)/2,sy=250-(w*25-25/2)/2
	var dots=[]
	for (var y=0;y<w;y++){
		for (var x=0;x<w;x++){
			dots.push([sx+x*25,sy+y*25])
		}
	}
	return [dots,[sx,sy]]
}
function distance(a,b){
	return Math.sqrt(Math.pow(b[0]-a[0],2)+Math.pow(b[1]-a[1],2))
}
function check_square(p){
	var s=[],eqs1=-1,neqs=-1
	s.push(distance(p[0],p[1]))
	s.push(distance(p[0],p[2]))
	s.push(distance(p[0],p[3]))
	if (s[0]==s[1]&&s[0]!=s[2]){eqs1=0;neqs=2}
	else if (s[1]==s[2]&&s[1]!=s[0]){eqs1=1;neqs=0}
	else if (s[0]==s[2]&&s[0]!=s[1]){eqs1=0;neqs=1}
	if (eqs1!=-1){
		var opp=0
		switch (neqs){
			case 0:opp=distance(p[2],p[3]);break
			case 1:opp=distance(p[1],p[3]);break
			case 2:opp=distance(p[1],p[2]);break
			default:break
		}
		if (opp==s[neqs]){
			var di=opp,ad=s[eqs1]
			for (let a=0;a<4;a++){
				var dc=0,ac=0
				for (let b=0;b<4;b++){
					if (a!=b){
						var dist=distance(p[a],p[b])
						if (dist==di){dc++}
						else if (dist==ad){ac++}
					}
				}
				if (!(dc==1&&ac==2)){return false}
			}
			return check_overlap(p)
		}
	}
	return false
}
function _ina(a,e){
	for (var o of a){
		if (o[0]==e[0]&&o[1]==e[1]){return true}
	}
	return false
}
function check_overlap(ps){
	for (var s of squares){
		var st=true
		for (var p of s[0]){
			let x=(p[0]-MS[0]-4)/25
			let y=(p[1]-MS[1]-4)/25
			if (!(_ina(ps,[x,y]))){st=false}
		}
		if (st){return false}
	}
	return true
}
function get_score(p){
	let s=Math.round(Math.pow(distance(p[0],p[1]),2))
	var dx=Math.abs(p[1][0]-p[0][0]),dy=Math.abs(p[1][1]-p[0][1])
	if (dx==dy){s*=1.5}
	else if (dx>0&&dy>0&&dx!=dy){s*=2}
	return s
}
function eval_square(p){
	if (check_square(p)){
		SCORE+=get_score(p)
		for (var pi=0;pi<p.length;pi++){
			p[pi][0]*=25
			p[pi][0]+=MS[0]+4
			p[pi][1]*=25
			p[pi][1]+=MS[1]+4
		}
		squares.push([p,SQUARE_COLORS[Math.floor(Math.random()*SQUARE_COLORS.length)],100])
	}

}
function click(pos){
	pos=[pos.pageX,pos.pageY]
	pos[0]=Math.round((pos[0]-MS[0])/25)
	pos[1]=Math.round((pos[1]-MS[1])/25)
	cur_sel.push(pos)
	if (cur_sel.length==4){eval_square(cur_sel);cur_sel=[]}
}
document.addEventListener("DOMContentLoaded",()=>{
	var cnv=document.createElement("canvas");
	cnv.width=500;
	cnv.height=600;
	document.body.appendChild(cnv);
	cnv.style.position="absolute";
	cnv.style.top="0px";
	cnv.style.left="0px";
	ctx=cnv.getContext("2d");
	ctx.lineWidth=3;
	ctx.lineCap="round";
	ctx.textAlign="center";
	ctx.font="bold 130px Consolas";
	cnv.onclick=click;
	DOTS=create_dots(18)
	MS=DOTS[1]
	DOTS=DOTS[0]
	requestAnimationFrame(draw);
},false);
function draw(){
	ctx.clearRect(0,0,800,600);
	ctx.strokeStyle="#b4b4b4";
	ctx.strokeText(SCORE,250,580);
	ctx.fillStyle="#b4b4b4";
	ctx.beginPath();
	for (var d of DOTS){
		ctx.moveTo(d[0]+4,d[1]+4);
		ctx.arc(d[0]+4,d[1]+4,4,0,Math.PI*2,false);
	}
	ctx.fill();
	for (var s of squares){
		ctx.strokeStyle=s[1];
		ctx.beginPath();
		ctx.moveTo(...s[0][0]);
		ctx.lineTo(...s[0][1]);
		ctx.lineTo(...s[0][2]);
		ctx.lineTo(...s[0][3]);
		ctx.lineTo(...s[0][0]);
		ctx.stroke();
		if (s[2]>0){
			ctx.fillStyle=`${s[1]}${(Math.floor(s[2]*(256/100))).toString(16).padStart(2,"0")}`;
			ctx.fill();
			s[2]-=1;
		}
	}
	requestAnimationFrame(draw);
}
